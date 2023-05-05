import { useRouter } from 'next/router';
import CommentList from "@/components/commentList";
import Date from "@/components/date";
import styles from "./postWithComments.module.css";

export default function PostWithComments({ body, owner, comments, timestamp }) {
  const router = useRouter();
  const { id: urlid } = router.query;
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    const data = {
      owner: event.target.owner.value,
      comment: event.target.comment.value,
    };

    console.log(`submitting`, data);
    const response = await fetch(
      `/api/posts/${urlid}/comments`,
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

    event.target.comment.value = "";
    refreshData();
  };

  return (
    <>
      <div className={styles["container-post"]}>
        <div className={styles["post-body"]} dangerouslySetInnerHTML={{ __html: body }}></div>
        <div className={styles["post-meta"]}>
          <span className={styles["post-owner"]}>{owner}</span>
          <Date dateString={timestamp} className={styles["post-date"]} />
        </div>
      </div>
      <div className={styles["container-comments"]}>
        <div className={styles.formContainer}>
          <div className={styles.formHeading}>Add a comment!</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.formOwnerContainer}>
              <label htmlFor="form-comment-owner">Who are you?</label>
              <input id="form-comment-owner" name="owner" type="text" minLength="2" size="60" required />
            </div>
            <div className={styles.formCommentContainer}>
              <label htmlFor="form-comment">Your comment:</label>
              <textarea id="form-comment" name="comment" rows="5" cols="60" required></textarea>
            </div>
            <div className={styles.formButtonContainer}>
              <button type="submit">Do the thing!</button>
            </div>
          </form>
        </div>
        <div className={styles["comments-header"]}>Comments</div>
        <CommentList comments={comments} />
      </div>
    </>
  );
}
