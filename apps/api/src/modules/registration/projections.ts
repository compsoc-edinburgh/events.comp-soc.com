import { eventsTable, registrationsTable, usersTable } from "../../db/schema.js";

export const RegistrationStoreSelection = {
  userId: registrationsTable.userId,
  firstName: usersTable.firstName,
  lastName: usersTable.lastName,
  email: usersTable.email,
  eventId: registrationsTable.eventId,
  status: registrationsTable.status,
  answers: registrationsTable.answers,
  createdAt: registrationsTable.createdAt,
  updatedAt: registrationsTable.updatedAt,
  eventTitle: eventsTable.title,
  eventDate: eventsTable.date,
  eventLocation: eventsTable.location,
};
