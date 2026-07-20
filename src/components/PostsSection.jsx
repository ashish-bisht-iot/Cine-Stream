import { useState, useEffect } from "react";
import PostCard from "./PostCard";

const DEMO_AUTHOR_ID = "6a5e69eb5630fdb2d8e9a697";

function PostsSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, authorId: DEMO_AUTHOR_ID }),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.message || `Failed: ${res.status}`);
      }

      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setFormData({ title: "", content: "" });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const prevPosts = posts;
    setPosts(posts.filter((p) => p._id !== id));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
    } catch (err) {
      setPosts(prevPosts);
      setError(`Delete failed: ${err.message}`);
    }
  };

  return (
    <section className="posts-section">
      <h2 className="section-title">Data Hub Posts</h2>

      <form onSubmit={handleSubmit} className="add-post-form">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Post title"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write something…"
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Add Post"}
        </button>
        {submitError && <p className="error">{submitError}</p>}
      </form>

      {loading && <p className="loading-text">Loading posts…</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="loading-text">No posts yet.</p>
      )}

      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onDelete={handleDelete} />
        ))}
      </div>
    </section>
  );
}

export default PostsSection;