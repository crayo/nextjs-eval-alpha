import CommentList from "@/components/commentList";
import Date from "@/components/date";
import styles from "./postWithComments.module.css";

export default function PostWithComments({ description, owner, comments, timestamp }) {
  return (
    <>
      <div className={styles["container-post"]}>
        <div className={styles["post-body"]}>{description}</div>
        <div className={styles["post-meta"]}>
          <span className={styles["post-owner"]}>{owner}</span>
          <Date dateString={timestamp} className={styles["post-date"]} />
        </div>
      </div>
      <div className={styles["container-comments"]}>
        <div className={styles["comments-header"]}>Comments</div>
        <CommentList comments={comments} />
      </div>
    </>
  );
}
