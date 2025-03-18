import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Button, Alert } from "react-bootstrap";
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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/articles/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/articles/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
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
              Written by {article.author.username} on{" "}
              {new Date(article.created_at).toLocaleDateString()}
            </Card.Footer>

            {user && user.id === article.author.id && (
              <>
                <Link
                  to={`/article/edit/${article.id}`}
                  className="btn btn-warning me-2"
                >
                  Edit
                </Link>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ArticleDetail;
