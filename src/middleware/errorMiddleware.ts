import express from 'express'
import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};