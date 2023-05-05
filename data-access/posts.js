import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { stripHtml } from "string-strip-html";

export const getPosts = async (filter={}, reqID="unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:getPosts" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // fetch the posts
  logger.trace({filter}, "Fetching posts");
  const posts = await db.collection("posts").find(
    filter,
    {
      sort: {
        timestamp: -1
      }
    }
  ).toArray();
  logger.trace(posts, "Fetched posts");

  return posts;
};

export const getAllPosts = reqID => (getPosts({}, reqID));
export const getPostByUrlid = (urlid, reqID) => (getPosts({urlid}, reqID));

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

export const getFullPosts = async (filter={}, reqID="unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:getFullPost" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // fetch post and its comments
  logger.trace({filter}, "Fetching post and comments");

  const postData = await db.collection("posts").aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
      }
    }
  ]).toArray();
  logger.trace(postData, "Fetched post and comments");

  return postData;
};

export const getFullPostByUrlid = (urlid, reqID) => (getFullPosts({urlid}, reqID));
