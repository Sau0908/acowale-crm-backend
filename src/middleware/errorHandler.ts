import { Request, Response, NextFunction } from 'express'
import { Prisma } from '@prisma/client'

type HttpError = Error & { status?: number; statusCode?: number }

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[ERROR] ${err.message}`, err.stack)

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Feedback not found',
    })
    return
  }

  const statusCode = err.statusCode || err.status || 500

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  })
}
