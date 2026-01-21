import * as repo from "../repositories/reviewRepository.js";
import prisma from "../config/prisma.js";

export const getAllReviews = async () => {
  return repo.getAll();
};

export const getReviewById = async (id) => {
  const review = await repo.getById(id);

  if (!review) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["REVIEW_NOT_FOUND"],
    };
  }

  return review;
};

export const createReview = async ({ userId, rating, comment, imgReview }) => {
  const errors = [];

  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    errors.push("INVALID_RATING");
  }

  const c = String(comment || "").trim();
  if (!c || c.length < 5) {
    errors.push("COMMENT_TOO_SHORT");
  }

  const uid = Number(userId);
  if (!Number.isFinite(uid) || uid <= 0) {
    errors.push("INVALID_USER_ID");
  }

  const user = uid
    ? await prisma.user.findUnique({ where: { id: uid } })
    : null;

  if (!user) {
    errors.push("USER_NOT_FOUND");
  }

  if (errors.length) {
    throw {
      type: "VALIDATION_ERROR",
      errors,
    };
  }

  return repo.create({
    userId: uid,
    rating: r,
    comment: c,
    imgReview: imgReview || null,
  });
};

export const updateReview = async (id, data) => {
  const existing = await repo.getById(id);

  if (!existing) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["REVIEW_NOT_FOUND"],
    };
  }

  const errors = {};
  const updateData = {};

  if ("adminReview" in data) {
    const ar = String(data.adminReview || "").trim();
    if (ar.length < 3) {
      errors.adminReview = "ADMIN_REVIEW_TOO_SHORT";
    } else {
      updateData.adminReview = ar;
    }
  }

  if ("imgReview" in data) {
    updateData.imgReview = data.imgReview;
  }

  if (Object.keys(errors).length) {
    throw {
      type: "VALIDATION_ERROR",
      errors: Object.values(errors),
    };
  }

  return repo.update(id, updateData);
};

export const deleteReview = async (id) => {
  const existing = await repo.getById(id);

  if (!existing) {
    throw {
      type: "VALIDATION_ERROR",
      errors: ["REVIEW_NOT_FOUND"],
    };
  }

  await repo.remove(id);
  return true;
};
