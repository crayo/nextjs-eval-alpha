import Link from "next/link";
import Date from "@/components/date";
import styles from "./postListItem.module.css";

export default function PostListItem({ urlid, title, owner, timestamp }) {
  return (
    <li className={styles["post-list-item"]}>
      <Link href={`/posts/${urlid}`} className={styles["post-title"]}>{title}</Link>
      <br />
      <div className={styles["post-subtitle"]}>
        <span className={styles["post-owner"]}>{owner}</span>
        <Date dateString={timestamp} className={styles["post-date"]}/>
      </div>
    </li>
  );
}
