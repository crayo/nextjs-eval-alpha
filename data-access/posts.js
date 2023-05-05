import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { stripHtml } from "string-strip-html";

export const getPosts = async (reqID="unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:getPosts" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // fetch the posts for the main page
  logger.trace("Fetching posts");
  const posts = await db.collection("posts").find(
    {},
    {
      sort: {
        timestamp: -1
      }
    }
  ).toArray();
  logger.trace(posts, "Fetched posts");

  return posts;
};

export const addPost = async (post, reqID="unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:addPost" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // add our post
  logger.trace(post, "Adding new post");
  const { owner, title, body } = post;
  const result = await db.collection("posts").insertOne({
    _id: uuidv4(),
    urlid: nanoid(),
    timestamp: new Date(),
    owner,
    title: stripHtml(title).result,
    body: stripHtml(body).result
  });
  logger.trace(result, "Added post");
  return result;
};
