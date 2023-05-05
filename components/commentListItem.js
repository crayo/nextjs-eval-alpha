import Link from "next/link";
import Date from "@/components/date";
import styles from "./commentListItem.module.css";

export default function CommentListItem({ comment, owner, timestamp }) {
  return (
    <li className={styles["comment-list-item"]}>
      <div className={styles["comment-body"]} dangerouslySetInnerHTML={{ __html: comment }}></div>
      <div className={styles["comment-meta"]}>
        <span className={styles["comment-owner"]}>{owner}</span>
        <Date dateString={timestamp} className={styles["comment-date"]}/>
      </div>
    </li>
  );
}
