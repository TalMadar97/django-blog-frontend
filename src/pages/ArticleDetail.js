import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Button, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://myblog-backend-lvtd.onrender.com/articles/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data);
        setLikes(data.total_likes || 0);
        setLiked(Array.isArray(data.likes) && data.likes.includes(user?.id));
        setIsFavorite(
          Array.isArray(data.favorited_by) &&
            data.favorited_by.includes(user?.id)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `https://myblog-backend-lvtd.onrender.com/articles/${id}/comments/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("You need to log in to like an article");
      return;
    }

    try {
      const response = await fetch(
        `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/like/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like the article");
      }

      setLikes((prev) => (liked ? prev - 1 : prev + 1));
      setLiked(!liked);
      toast.success(liked ? "Like removed" : "Article liked!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("You need to log in to save articles as favorites");
      return;
    }

    try {
      const response = await fetch(
        `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/favorite/`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      setIsFavorite(!isFavorite);
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites!"
      );
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      const response = await fetch(
        `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/comments/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      const response = await fetch(
        `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      toast.success("Article deleted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {article && (
        <Card>
          <Card.Body>
            <Card.Title>{article.title}</Card.Title>
            <Card.Text>{article.content}</Card.Text>
            <Card.Footer className="text-muted">
              Written by {article.author?.username || "Unknown"} on{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </Card.Footer>

            <div className="mt-3">
              <Button
                variant={liked ? "danger" : "outline-danger"}
                onClick={handleLike}
                className="me-2"
              >
                {liked ? "Unlike" : "Like"} ({likes})
              </Button>

              <Button
                variant={isFavorite ? "success" : "outline-success"}
                onClick={handleFavorite}
              >
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </div>

            {user && user.id === article.author?.id && (
              <div className="mt-3">
                <Link
                  to={`/article/edit/${article.id}`}
                  className="btn btn-warning me-2"
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={handleDeleteArticle}>
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <h3 className="mt-4">Comments</h3>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map((comment) => (
          <Card key={comment.id} className="mt-3">
            <Card.Body>
              <Card.Text>{comment.content}</Card.Text>
              <Card.Footer className="text-muted">
                {comment.user?.username || "Unknown"} -{" "}
                {new Date(comment.created_at).toLocaleString()}
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
      )}

      {user && (
        <Form onSubmit={handleCommentSubmit} className="mt-3">
          <Form.Group>
            <Form.Label>Write a comment:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="mt-2">
            Add Comment
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default ArticleDetail;
