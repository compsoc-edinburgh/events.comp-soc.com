import { z, ZodError } from "zod";
import { AppError } from "./errors.js";
import { FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      details: z.treeifyError(error),
    });
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  reply.status(500).send({
    statusCode: 500,
    message: "Internal Server Error",
  });
};
