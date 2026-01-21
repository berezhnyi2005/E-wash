import * as user from "../services/userService.js";

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

export const getAllUsers = async (req, res) => {
  try {
    const data = await user.getAllUsers();
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;

    if (!id) errors.push("MISSING_USER_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_USER_ID");

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const data = await user.getUserById(Number(id));
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createUser = async (req, res) => {
  try {
    const errors = [];
    const { name, email, password, role } = req.body;

    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim();

    if (!trimmedName) errors.push("MISSING_NAME");
    if (!trimmedEmail) errors.push("MISSING_EMAIL");
    if (!password) errors.push("MISSING_PASSWORD");

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push("INVALID_EMAIL");
    }

    if (password && password.length < 6) {
      errors.push("PASSWORD_TOO_SHORT");
    }

    if (role && !["USER", "ADMIN"].includes(role)) {
      errors.push("INVALID_ROLE");
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const data = await user.createUser({
      name: trimmedName,
      email: trimmedEmail,
      password,
      role: role || "USER",
    });

    res.status(201).json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;
    const { name, email, role } = req.body;

    const trimmedName = (name || "").trim();
    const trimmedEmail = (email || "").trim();

    if (!id) errors.push("MISSING_USER_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_USER_ID");

    if (name !== undefined && !trimmedName) {
      errors.push("INVALID_NAME");
    }

    if (
      email !== undefined &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      errors.push("INVALID_EMAIL");
    }

    if (role !== undefined && !["USER", "ADMIN"].includes(role)) {
      errors.push("INVALID_ROLE");
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const data = await user.updateUser(Number(id), {
      name: name !== undefined ? trimmedName : undefined,
      email: email !== undefined ? trimmedEmail : undefined,
      role,
    });

    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;

    if (!id) errors.push("MISSING_USER_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_USER_ID");

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    await user.deleteUser(Number(id));
    res.json({ status: "success" });
  } catch (err) {
    handleError(res, err);
  }
};
