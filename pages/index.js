// Home page
import { useRouter } from 'next/router';
import Layout from "@/components/layout";
import PostList from "@/components/postList";
import { getLogger } from "@/lib/logger";
import { getPosts } from "@/data-access/posts";
import styles from "./index.module.css";

export async function getServerSideProps(context) {
  // check headers for a request id
  const requestHeaders = new Headers(context.req.headers);
  const reqID = requestHeaders.get("x-request-id") || "unknown request id";
  // set up our logger
  const logger = getLogger({ reqID, module: "Page:Home" });
  // get our posts
  const posts = await getPosts(reqID);

  // return our props
  return {
    props: {
      posts: posts.map(p => ({ ...p, timestamp: p.timestamp.toISOString()}))
    },
  };
}

export default function Home({ posts }) {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      owner: event.target.postowner.value,
      title: event.target.posttitle.value,
      body: event.target.postbody.value,
    };

    console.log(`submitting`, data);
    const response = await fetch(
      "/api/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const result = await response.json();
    console.log(`received response`, result);
    event.target.posttitle.value = "";
    event.target.postbody.value = "";
    refreshData();
  };

  return (
    <Layout home pageTitle="Your one-stop destination for posts!">
      <div className={styles.formContainer}>
        <div className={styles.formHeading}>Add your own post!</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formOwnerContainer}>
            <label htmlFor="form-post-owner">Who are you?</label>
            <input id="form-post-owner" name="postowner" type="text" minLength="2" size="60" required />
          </div>
          <div className={styles.formTitleContainer}>
            <label htmlFor="form-post-title">Post Title:</label>
            <input id="form-post-title" name="posttitle" type="text" minLength="4" size="60" required />
          </div>
          <div className={styles.formBodyContainer}>
            <label htmlFor="form-post-body">Post Body:</label>
            <textarea id="form-post-body" name="postbody" rows="5" cols="60" required></textarea>
          </div>
          <div className={styles.formButtonContainer}>
            <button type="submit">Post your thoughts</button>
          </div>
        </form>
      </div>
      <PostList posts={posts}/>
    </Layout>
  );
}
