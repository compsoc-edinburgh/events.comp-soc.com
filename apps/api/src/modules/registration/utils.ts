import type { CustomField, Nullable, RegistrationFormAnswer } from "@events.comp-soc.com/shared";
import { BadRequestError } from "../../lib/errors.js";

export const validateRegistrationAnswers = ({
  form,
  answers,
}: {
  form: Nullable<CustomField[]> | undefined;
  answers: Nullable<RegistrationFormAnswer> | undefined;
}): RegistrationFormAnswer => {
  const fields = form ?? [];
  const providedAnswers = answers ?? {};
  const fieldIds = new Set(fields.map((field) => field.id));

  for (const answerId of Object.keys(providedAnswers)) {
    if (!fieldIds.has(answerId)) {
      throw new BadRequestError(`Unknown registration answer: ${answerId}`);
    }
  }

  const normalisedAnswers: RegistrationFormAnswer = {};

  for (const field of fields) {
    const answer = providedAnswers[field.id]?.trim();

    if (!answer) {
      if (field.required) {
        throw new BadRequestError(`${field.label} is required`);
      }
      continue;
    }

    if (field.type === "select" && !field.options?.includes(answer)) {
      throw new BadRequestError(`${field.label} has an invalid answer`);
    }

    normalisedAnswers[field.id] = answer;
  }

  return normalisedAnswers;
};
