import { z } from "zod";
import { FeedbackCategory, FeedbackStatus } from "@prisma/client";

export const FEEDBACK_CATEGORIES = Object.values(FeedbackCategory);
export const FEEDBACK_STATUSES = Object.values(FeedbackStatus);

export const submitFeedbackSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100).optional(),
  email: z.string().trim().email("Invalid email").optional(),
  category: z.nativeEnum(FeedbackCategory, { message: "Invalid category" }),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(1000),
});

export const getFeedbackSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  category: z.nativeEnum(FeedbackCategory).optional(),
  status: z.nativeEnum(FeedbackStatus).optional(),
  search: z.string().trim().max(100).optional(),
});

export const feedbackIdParamSchema = z.object({
  id: z.string().uuid("Invalid feedback id"),
});

export const updateFeedbackStatusSchema = z.object({
  status: z.nativeEnum(FeedbackStatus, { message: "Invalid status value" }),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type GetFeedbackInput = z.infer<typeof getFeedbackSchema>;
export type FeedbackIdParamInput = z.infer<typeof feedbackIdParamSchema>;
export type UpdateFeedbackStatusInput = z.infer<
  typeof updateFeedbackStatusSchema
>;
