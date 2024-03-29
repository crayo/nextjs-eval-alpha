import PostListItem from "@/components/postListItem";
import styles from "./postList.module.css";

export default function PostList({ posts }) {
  return (
    <ul className={styles["post-list"]}>
      {posts.map(({ _id, urlid, title, owner, timestamp }) => (
        <PostListItem key={_id} urlid={urlid} title={title} owner={owner} timestamp={timestamp} />
      ))}
    </ul>
  );
}
