// Home page
import Layout from "@/components/layout";
import PostList from "@/components/postList";
import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";

export async function getServerSideProps(context) {
  // check headers for a request id
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "Page:Home" });
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

  // return our props
  return {
    props: {
      posts: posts.map(p => ({ ...p, timestamp: p.timestamp.toISOString()}))
    },
  };
}

export default function Home({ posts }) {
  return (
    <Layout home pageTitle="Look at all of these posts!">
      <PostList posts={posts}/>
    </Layout>
  );
}
