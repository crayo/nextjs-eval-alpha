import CommentListItem from "@/components/commentListItem";
import styles from "./commentList.module.css";

export default function CommentList({ comments }) {
  return (
    <ul className={styles["comment-list"]}>
      {comments.map(({ _id, comment, owner, timestamp }) => (
        <CommentListItem key={_id} comment={comment} owner={owner} timestamp={timestamp} />
      ))}
    </ul>
  );
}
