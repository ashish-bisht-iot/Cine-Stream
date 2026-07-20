function PostCard({ post, onDelete }) {
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <small>
        By {post.authorId?.name || "Unknown"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>
      <button onClick={() => onDelete(post._id)}>Delete</button>
    </div>
  );
}

export default PostCard;