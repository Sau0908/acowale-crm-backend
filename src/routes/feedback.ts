import { Router } from "express";
import {
  submitFeedback,
  getFeedback,
  getAnalytics,
  updateFeedbackStatus,
} from "../controllers/feedbackController";
import { validate } from "../middleware/validate";
import {
  feedbackIdParamSchema,
  getFeedbackSchema,
  submitFeedbackSchema,
  updateFeedbackStatusSchema,
} from "../schemas/feedbackSchema";

const router = Router();

router.post("/", validate(submitFeedbackSchema, "body"), submitFeedback);
router.get("/", validate(getFeedbackSchema, "query"), getFeedback);
router.get("/analytics", getAnalytics);
router.patch(
  "/:id/status",
  validate(feedbackIdParamSchema, "params"),
  validate(updateFeedbackStatusSchema, "body"),
  updateFeedbackStatus,
);

export default router;
