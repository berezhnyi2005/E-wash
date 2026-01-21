import * as repo from "../repositories/appointmentRepository.js";
import prisma from "../config/prisma.js";

const WORK_START = 9 * 60;
const WORK_END = 17 * 60;

const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();

const isAppointmentFinished = (appointment) => {
  const start = new Date(appointment.dateTime);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + appointment.service.durationMin);
  return end < new Date();
};

const syncDoneStatus = async (appointments) => {
  for (const a of appointments) {
    if (
      a.status !== "DONE" &&
      a.status !== "CANCELLED" &&
      isAppointmentFinished(a)
    ) {
      await repo.updateStatus(a.id, "DONE");
      a.status = "DONE";
    }
  }
};

export const getAllAppointments = async () => {
  const appointments = await repo.getAll();
  await syncDoneStatus(appointments);
  return appointments;
};

export const getMyAppointments = async (userId) => {
  const appointments = await repo.getByUserId(userId);
  await syncDoneStatus(appointments);
  return appointments;
};

export const getBusySlotsByDate = async (date) => {
  if (!date) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["DATE_REQUIRED"],
    };
  }

  const appointments = await repo.getByDate(date);

  return appointments
    .filter((a) => a.status !== "CANCELLED")
    .map((a) => ({
      dateTime: a.dateTime,
      durationMin: a.service.durationMin,
    }));
};

export const createAppointment = async ({
  userId,
  serviceId,
  dateTime,
  notes,
}) => {
  const errors = [];

  if (!userId || !serviceId || !dateTime) {
    errors.push("MISSING_FIELDS");
  }

  const service = serviceId
    ? await prisma.service.findUnique({
        where: { id: Number(serviceId) },
      })
    : null;

  if (!service) {
    errors.push("SERVICE_NOT_FOUND");
  }

  let start;
  if (dateTime) {
    start = new Date(dateTime);
    if (isNaN(start.getTime())) {
      errors.push("INVALID_DATE");
    }
  }

  const now = new Date();
  if (start && start < now) {
    errors.push("PAST_DATE");
  }

  if (service && start) {
    const startMin = toMinutes(start);
    const endMin = startMin + service.durationMin;

    if (startMin < WORK_START || endMin > WORK_END) {
      errors.push("OUTSIDE_WORKING_HOURS");
    }

    const dayAppointments = await repo.getByDate(
      start.toISOString().split("T")[0],
    );

    const hasOverlap = dayAppointments.some((a) => {
      if (a.status === "CANCELLED") return false;

      const aStart = new Date(a.dateTime);
      const aStartMin = toMinutes(aStart);
      const aEndMin = aStartMin + a.service.durationMin;

      return startMin < aEndMin && endMin > aStartMin;
    });

    if (hasOverlap) {
      errors.push("TIME_NOT_AVAILABLE");
    }
  }

  if (errors.length > 0) {
    throw {
      type: "VALIDATION_ERROR",
      errors,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
  });

  if (!user) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["USER_NOT_FOUND"],
    };
  }

  const isAdmin = user.role === "ADMIN";

  return repo.create({
    userId,
    serviceId,
    dateTime: start,
    status: isAdmin ? "APPROVED" : "PENDING",
    notes,
  });
};

export const changeStatus = async (id, newStatus) => {
  const appointment = await repo.getById(id);

  if (!appointment) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["APPOINTMENT_NOT_FOUND"],
    };
  }

  const allowed = ["PENDING", "APPROVED", "CANCELLED", "DONE"];
  if (!allowed.includes(newStatus)) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["INVALID_STATUS"],
    };
  }

  if (appointment.status === "DONE") {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["DONE_IMMUTABLE"],
    };
  }

  return repo.updateStatus(id, newStatus);
};

export const deleteAppointment = async (id) => {
  const appointment = await repo.getById(id);

  if (!appointment) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["APPOINTMENT_NOT_FOUND"],
    };
  }

  if (appointment.status === "DONE") {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["DONE_CANNOT_DELETE"],
    };
  }

  return repo.remove(id);
};
