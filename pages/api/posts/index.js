import { getLogger } from "@/lib/logger";
import { getPosts, addPost } from "@/data-access/posts";

export default async function handler(req, res) {
  // check headers for a request id
  const requestHeaders = new Headers(req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "API:posts" });

  // what type of request is this?
  const { method } = req;
  if (method === "GET") {
    logger.trace(`GET request for posts`);
    const posts = await getPosts(reqID);
    logger.trace(posts, "returning posts");
    return res.status(200).json({ message: "OK", posts });
  } else if (method === "POST") {
    const { body: reqBody } = req;
    logger.trace(reqBody, `received POST data`);
    const { owner, title, body } = reqBody;
    try {
      const result = await addPost({ owner, title, body }, reqID);
      logger.trace(result, "got result from addPost");
      return res.status(200).json({ message: "OK" });
    } catch (dbErr) {
      logger.error(dbErr, "Could not insert post.");
      return res.status(500).json({ message: "An error occurred while adding the post.", err: dbErr.message });
    }
  }
  return res.status(404).json({ message: "Request method not supported." });
}
