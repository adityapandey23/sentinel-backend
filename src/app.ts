import express, { type NextFunction, type Request, type Response } from "express";
import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./di/inversify.config";

import "./controller/auth.controller";
import type { ConfigService } from "./service/config-service.interface";
import { TYPES } from "./di/types";

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
});

server.setErrorConfig((app) => {

  // Catch-all handler for invalid routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = Object.assign(new Error(`Cannot find ${req.originalUrl} on this server`), { status: 404 });
    next(error);
  });

  // Global error handler
  app.use((err: Error & { status: number }, req: Request, res: Response, next: NextFunction) => {
    const configService = container.get<ConfigService>(TYPES.ConfigService);
    const isDev = configService.get('NODE_ENV') === 'development';
    const statusCode = err.status || 500;

    res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Something went wrong on the server',
      ...(isDev && { stack: err.stack })
    });
  });
});

export const app = server.build();

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.status(200).json({
//     status: "ok",
//     message: "Server is healthy",
//     timestamp: new Date().toISOString(),
//   });
// });
