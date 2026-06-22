import { Request, Response, NextFunction } from "express";
import { Prisma, FeedbackCategory, FeedbackStatus } from "@prisma/client";
import prisma from "../db/prisma";
import {
  FeedbackIdParamInput,
  SubmitFeedbackInput,
  UpdateFeedbackStatusInput,
} from "../schemas/feedbackSchema";

export const submitFeedback = async (
  req: Request<{}, {}, SubmitFeedbackInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, category, comment } = req.body;

    const feedback = await prisma.feedback.create({
      data: { name, email, category, comment },
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
};

export const getFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt((req.query.page as string) || "1");
    const limit = parseInt((req.query.limit as string) || "10");
    const category = req.query.category as FeedbackCategory | undefined;
    const status = req.query.status as FeedbackStatus | undefined;
    const search = req.query.search as string | undefined;
    const skip = (page - 1) * limit;

    const where: Prisma.FeedbackWhereInput = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { comment: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [
      totalCount,
      categoryDistribution,
      statusDistribution,
      recentFeedbacks,
    ] = await Promise.all([
      prisma.feedback.count(),

      prisma.feedback.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { _count: { category: "desc" } },
      }),

      prisma.feedback.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCount,
        categoryDistribution: categoryDistribution.map((c) => ({
          category: c.category,
          count: c._count.category,
        })),
        statusDistribution: statusDistribution.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
        recentFeedbacks,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateFeedbackStatus = async (
  req: Request<FeedbackIdParamInput, {}, UpdateFeedbackStatusInput>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const feedback = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, data: feedback });
  } catch (err) {
    next(err);
  }
};
