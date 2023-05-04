import Head from "next/head";
import Link from "next/link";
import Date from "@/components/date";
import { getDB } from "@/lib/db";
import { getLogger } from "@/lib/logger";

export async function getServerSideProps(context) {
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  const logger = getLogger({ reqID, module: "Page:Post" });
  logger.trace("Getting our DB connection");
  const db = await getDB();
  logger.trace(context.params, `context params`);
  const { id: urlid } = context.params;
  logger.trace("Fetching post and comments");
//  const posts = await db.collection("posts").find({}, { _id: 0, id: "$_id" }).toArray();
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

  if (postData.length === 0) return { notFound: true };
  const { title, description, owner, timestamp, comments } = postData[0];

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
    <>
      <Head>
        <title>Suited Post: {title}</title>
      </Head>
      <main className={`flex min-h-screen flex-col items-start justify-start p-24`}>
        <h1 className="place-self-center">{title}</h1>
        <div>{description}</div>
        <small>{owner} - <Date dateString={timestamp}/></small>
        <ul>
        {comments.map(({ _id, comment, owner, timestamp }) => (
          <li key={_id}>
            <div>{comment}</div>
            <small>{owner} - <Date dateString={timestamp}/></small>
          </li>
        ))}
        </ul>
      </main>
    </>
  );
}
