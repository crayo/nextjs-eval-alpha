import assert from "node:assert";
import { MongoClient } from "mongodb";
import { getLogger } from "@/lib/logger";

const k_uriMongodb = process.env.MONGODB_URI;
assert(k_uriMongodb, "MONGODB_URI env var must be set.");

let logger;
let client;
let db;

const init = async () => {
  // configure our local logger
  logger = getLogger({ module: "db" });

  try {
    logger.trace("Database initializing");
    client = new MongoClient(k_uriMongodb);
    await client.connect();
    db = client.db(); // grab the default db from the URI
    logger.info("Database connected");
  } catch (dbErr) {
    logger.error(dbErr, "An error occured while initializing the database.");
  }
};

export const getClient = async () => {
  if (!client) {
    await init();
  }
  return client;
};

export const getDB = async () => {
  if (!db) {
    await init();
  }
  return db;
};
