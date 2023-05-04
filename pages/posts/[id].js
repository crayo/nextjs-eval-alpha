import Layout from "@/components/layout";
import PostWithComments from "@/components/postWithComments";
import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";

export async function getServerSideProps(context) {
  // check headers for a request id
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "Page:Post" });
  // pull data from our context
  const { id: urlid } = context.params;
  // get our database connection
  logger.trace("Getting our DB connection");
  const db = await getDB();
  // fetch the data for our page
  logger.trace("Fetching post and comments");
  const postData = await db.collection("posts").aggregate([
    { $match: { urlid } },
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

  // check if we got data
  if (postData.length === 0) return { notFound: true };
  // pull data into vars
  const { title, description, owner, timestamp, comments } = postData[0];

  // return our props
  return {
    props: {
      title,
      description,
      owner,
      timestamp: timestamp.toISOString(),
      comments: comments.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }))
    }
  };
}

export default function Post({ title, description, owner, timestamp, comments }) {
  return (
    <Layout pageTitle={title}>
      <PostWithComments description={description} owner={owner} timestamp={timestamp} comments={comments} />
    </Layout>
  );
}
