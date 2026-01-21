import * as review from "../services/reviewService.js";

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

export const getAllReviews = async (req, res) => {
  try {
    const data = await review.getAllReviews();
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getReviewById = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;

    if (!id) errors.push("MISSING_REVIEW_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_REVIEW_ID");

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const data = await review.getReviewById(Number(id));
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createReview = async (req, res) => {
  try {
    const errors = [];
    const { rating, comment, userId } = req.body;
    const file = req.file;

    const numericRating = Number(rating);
    const numericUserId = Number(userId);
    const trimmedComment = (comment || "").trim();

    if (rating === undefined) errors.push("MISSING_RATING");
    if (!Number.isFinite(numericRating)) errors.push("INVALID_RATING");
    if (
      Number.isFinite(numericRating) &&
      (numericRating < 1 || numericRating > 5)
    ) {
      errors.push("RATING_OUT_OF_RANGE");
    }

    if (!trimmedComment) errors.push("MISSING_COMMENT");
    if (trimmedComment && trimmedComment.length < 5) {
      errors.push("COMMENT_TOO_SHORT");
    }

    if (!userId) errors.push("MISSING_USER_ID");
    if (!Number.isFinite(numericUserId) || numericUserId <= 0) {
      errors.push("INVALID_USER_ID");
    }

    if (file && !file.mimetype.startsWith("image/")) {
      errors.push("INVALID_IMAGE_TYPE");
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const imgReview = file ? `/uploads/reviews/${file.filename}` : null;

    const data = await review.createReview({
      userId: numericUserId,
      rating: numericRating,
      comment: trimmedComment,
      imgReview,
    });

    res.status(201).json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const updateReview = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;
    const { adminReview } = req.body;
    const file = req.file;

    if (!id) errors.push("MISSING_REVIEW_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_REVIEW_ID");

    if (adminReview !== undefined) {
      const trimmed = String(adminReview).trim();
      if (!trimmed) errors.push("EMPTY_ADMIN_REVIEW");
      if (trimmed && trimmed.length < 3) {
        errors.push("ADMIN_REVIEW_TOO_SHORT");
      }
    }

    if (file && !file.mimetype.startsWith("image/")) {
      errors.push("INVALID_IMAGE_TYPE");
    }

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    const updateData = {};

    if (adminReview !== undefined) {
      updateData.adminReview = String(adminReview).trim();
    }

    if (file) {
      updateData.imgReview = `/uploads/reviews/${file.filename}`;
    }

    const data = await review.updateReview(Number(id), updateData);
    res.json({ status: "success", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const deleteReview = async (req, res) => {
  try {
    const errors = [];
    const { id } = req.params;

    if (!id) errors.push("MISSING_REVIEW_ID");
    if (id && isNaN(Number(id))) errors.push("INVALID_REVIEW_ID");

    if (errors.length) {
      throw { type: "VALIDATION_ERROR", errors };
    }

    await review.deleteReview(Number(id));
    res.json({ status: "success" });
  } catch (err) {
    handleError(res, err);
  }
};
