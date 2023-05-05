import { remark } from 'remark';
import html from 'remark-html';
import Layout from "@/components/layout";
import PostWithComments from "@/components/postWithComments";
import { getLogger } from "@/lib/logger";
import { getFullPostByUrlid } from "@/data-access/posts";

export async function getServerSideProps(context) {
  // check headers for a request id
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "Page:Post" });
  // pull data from our context
  const { id: urlid } = context.params;

  // get our post data
  const postData = await getFullPostByUrlid(urlid, reqID);

  // check if we got data
  if (postData.length === 0) return { notFound: true };
  // pull data into vars
  const { title, body, owner, timestamp, comments } = postData[0];

  // Use remark to convert markdown into HTML string
  logger.trace({body}, "processing body for markdown");
  const processedContent = await remark()
    .use(html)
    .process(body);
  logger.trace(processedContent, "processed body");
  const contentHtml = processedContent.toString();
  logger.trace({contentHtml}, "body to HTML");

  // return our props
  return {
    props: {
      title,
      body: contentHtml,
      owner,
      timestamp: timestamp.toISOString(),
      comments: comments.map(c => ({
        ...c,
        timestamp: c.timestamp.toISOString()
      }))
    }
  };
}

export default function Post({ title, body, owner, timestamp, comments }) {
  return (
    <Layout pageTitle={title}>
      <PostWithComments body={body} owner={owner} timestamp={timestamp} comments={comments} />
    </Layout>
  );
}
