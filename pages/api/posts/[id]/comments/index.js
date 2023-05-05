import { getLogger } from "@/lib/logger";
import { getCommentsForPost, addCommentToPost } from "@/data-access/comments";

export default async function handler(req, res) {
  // check headers for a request id
  const requestHeaders = new Headers(req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "API:posts/[id]/comments" });

  // what type of request is this?
  const { method } = req;
  if (method === "GET") {
    logger.trace({ query: req.query }, `GET request for post`);

    const { id } = req.query;
    const comments = await getCommentsForPost(id, reqID);
    logger.trace({comments}, "returning comments");
    if (!Array.isArray(comments)) return res.status(404).json({ message: "No post found with that id" });
    return res.status(200).json({ message: "OK", comments });
  } else if (method === "POST") {
    logger.trace({ body: req.body, query: req.query }, `received POST data`);
    const { body: { owner, comment }, query: { id: urlid } } = req;
    try {
      const result = await addCommentToPost({ comment, urlid, owner }, reqID);
      logger.trace(result, "got result from addCommentToPost");
      return res.status(200).json({ message: "OK" });
    } catch (dbErr) {
      logger.error(dbErr, "Could not add comment to post.");
      return res.status(500).json({ message: "An error occurred while adding the comment to the post.", err: dbErr.message });
    }

  }
  return res.status(404).json({ message: "Request method not supported." });
}
