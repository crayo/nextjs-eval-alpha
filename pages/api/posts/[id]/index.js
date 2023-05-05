import { getLogger } from "@/lib/logger";
import { getFullPostByUrlid } from "@/data-access/posts";

export default async function handler(req, res) {
  // check headers for a request id
  const requestHeaders = new Headers(req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "API:posts/[id]" });

  // what type of request is this?
  const { method } = req;
  if (method === "GET") {
    logger.trace({ query: req.query }, `GET request for post`);

    const { id } = req.query;
    const posts = await getFullPostByUrlid(id, reqID);
    if (posts.length === 0) return res.status(404).json({ message: "Post not found with that id" });
    const post = posts[0];
    logger.trace({post}, "returning post");
    return res.status(200).json({ message: "OK", post });
  }
  return res.status(404).json({ message: "Request method not supported." });
}
