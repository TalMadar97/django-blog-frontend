import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Spinner } from "react-bootstrap";

function ArticleDetail() {
  const { id } = useParams();
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
        <p className="text-danger">{error}</p>
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
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ArticleDetail;
