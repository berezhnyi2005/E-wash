import * as service from "../services/appointmentService.js";

const handleError = (res, err) => {
  if (err?.type === "VALIDATION_ERROR") {
    return res.status(400).json({
      status: "error",
      errors: err.errors,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};

export const getAllAppointments = async (req, res) => {
  try {
    const data = await service.getAllAppointments();
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const errors = [];
    const { userId } = req.query;

    if (!userId) errors.push("MISSING_USER_ID");
    if (userId && isNaN(Number(userId))) errors.push("INVALID_USER_ID");

    if (errors.length) {
      throw {
        type: "VALIDATION_ERROR",
        errors,
      };
    }

    const data = await service.getMyAppointments(Number(userId));
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};
export const getBusySlots = async (req, res) => {
  try {
    const errors = [];
    const { date } = req.query;

    if (!date) errors.push("MISSING_DATE");
    if (date && isNaN(Date.parse(date))) errors.push("INVALID_DATE");

    if (errors.length) {
      throw {
        type: "VALIDATION_ERROR",
        errors,
      };
    }

    const data = await service.getBusySlotsByDate(date);
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};
export const createAppointment = async (req, res) => {
  try {
    const errors = [];
    const { userId, serviceId, dateTime } = req.body;

    if (!userId) errors.push("MISSING_USER_ID");
    if (!serviceId) errors.push("MISSING_SERVICE_ID");
    if (!dateTime) errors.push("MISSING_DATETIME");

    if (userId && isNaN(Number(userId))) errors.push("INVALID_USER_ID");
    if (serviceId && isNaN(Number(serviceId)))
      errors.push("INVALID_SERVICE_ID");
    if (dateTime && isNaN(Date.parse(dateTime)))
      errors.push("INVALID_DATETIME");

    if (errors.length) {
      throw {
        type: "VALIDATION_ERROR",
        errors,
      };
    }

    const isAdmin = Boolean(req.body.isAdmin);

    const data = await service.createAppointment({
      userId: Number(userId),
      serviceId: Number(serviceId),
      dateTime,
      notes: req.body.notes || "",
      isAdmin,
    });

    res.status(201).json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;
    const { status } = req.body;

    if (!id) errors.push("MISSING_APPOINTMENT_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_APPOINTMENT_ID");

    if (!status) errors.push("MISSING_STATUS");

    if (errors.length) {
      throw {
        type: "VALIDATION_ERROR",
        errors,
      };
    }

    const data = await service.changeStatus(Number(id), status);
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};
export const deleteAppointment = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;

    if (!id) errors.push("MISSING_APPOINTMENT_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_APPOINTMENT_ID");

    if (errors.length) {
      throw {
        type: "VALIDATION_ERROR",
        errors,
      };
    }

    await service.deleteAppointment(Number(id));
    res.json({ status: "success" });
  } catch (err) {
    handleError(res, err);
  }
};
