// Home page
import Link from "next/link";
import Date from "@/components/date";
import PostList from "@/components/postList";
import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";

export async function getServerSideProps(context) {
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  const logger = getLogger({ reqID, module: "Page:Home" });
  logger.trace("Getting our DB connection");
  const db = await getDB();
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

  return {
    props: {
      posts: posts.map(p => ({ ...p, timestamp: p.timestamp.toISOString()}))
    },
  };
}

export default function Home({ posts }) {
  return (
    <main className={`flex min-h-screen flex-col items-start justify-start p-24 font-mono`}>
      <h1 className="place-self-center text-4xl mb-9">NextJS Evaluation Project Alpha</h1>
      <div className="text-2xl mb-3">Have a look at all these posts!</div>
      <PostList posts={posts}/>
    </main>
  );
}
