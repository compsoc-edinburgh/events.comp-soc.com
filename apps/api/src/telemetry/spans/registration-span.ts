import { Attributes, Span, SpanStatusCode, trace } from "@opentelemetry/api";
import { AppError } from "../../lib/errors.js";

const tracer = trace.getTracer("compsoc.registration");

type RegistrationSpanContext = {
  span: Span;
  setOutcome: (outcome: string) => void;
};

export const withRegistrationSpan = async <T>(
  name: string,
  attributes: Attributes,
  operation: (context: RegistrationSpanContext) => Promise<T>
): Promise<T> => {
  return tracer.startActiveSpan(name, { attributes }, async (span) => {
    let hasOutcome = false;

    const setOutcome = (outcome: string) => {
      hasOutcome = true;
      span.setAttribute("compsoc.registration.outcome", outcome);
    };

    try {
      return await operation({ span, setOutcome });
    } catch (error) {
      const exception = error instanceof Error ? error : new Error(String(error));
      const isExpectedBusinessRejection = hasOutcome && error instanceof AppError;

      if (!hasOutcome) {
        setOutcome("fault");
      }

      if (!isExpectedBusinessRejection) {
        span.recordException(exception);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: exception.message,
        });
      }

      throw error;
    } finally {
      span.end();
    }
  });
};
