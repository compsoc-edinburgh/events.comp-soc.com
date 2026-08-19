import { z, ZodError } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";

const hasStatusCode = (error: unknown): error is { statusCode: number } =>
  typeof error === "object" &&
  error !== null &&
  "statusCode" in error &&
  typeof (error as { statusCode: unknown }).statusCode === "number";

const resolveStatusCode = (error: unknown): number => {
  if (error instanceof ZodError) {
    return 400;
  }

  if (hasStatusCode(error)) {
    return error.statusCode;
  }

  return 500;
};

export const errorHandler = (error: unknown, request: FastifyRequest, reply: FastifyReply) => {
  const statusCode = resolveStatusCode(error);
  const type = error instanceof Error ? error.name : typeof error;

  request.log[statusCode >= 500 ? "error" : "warn"](
    { err: error, statusCode, type },
    "request failed"
  );

  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      details: z.treeifyError(error),
      requestId: request.id,
    });
  }

  const message =
    statusCode < 500 && error instanceof Error ? error.message : "Internal Server Error";

  return reply.status(statusCode).send({ statusCode, message, requestId: request.id });
};
