import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { db } from "../db/db.js";

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}

const dbPlugin: FastifyPluginAsync = async (server) => {
  server.decorate("db", db);
};

export default fp(dbPlugin);
