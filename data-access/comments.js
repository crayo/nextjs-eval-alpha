import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";
import { getFullPostByUrlid } from "@/data-access/posts";
import { v4 as uuidv4 } from 'uuid';
import { stripHtml } from "string-strip-html";

export const getCommentsForPost = async (urlid, reqID = "unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:getCommentsForPost" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // get our comments
  logger.trace({ urlid }, "Getting comments for post");
  const postData = await getFullPostByUrlid(urlid, reqID);
  logger.trace(postData, "Fetched post data");
  return postData.length === 1 ? postData[0].comments : null;
};

export const addCommentToPost = async ({ comment, urlid, owner }, reqID = "unknown request id") => {
  // set up our logger
  const logger = getLogger({ reqID, module: "DataAccess:addCommentToPost" });
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();

  // add our post
  logger.trace({ comment, urlid, owner }, "Adding a comment to post");
  const result = await db.collection("posts").aggregate([
    { $match: { urlid } },
    {
      $project: {
        _id: uuidv4(),
        postId: "$_id",
        timestamp: new Date(),
        owner,
        comment
      }
    },
    {
      $merge: {
        into: "comments",
        on: "_id",
        whenMatched: "fail",
        whenNotMatched: "insert"
      }
    }
  ]).toArray();
  logger.trace(result, "Added comment");
  return result;
};
