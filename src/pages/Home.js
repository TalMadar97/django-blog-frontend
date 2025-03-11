import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/articles/");
        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col className="text-center">
          <h1>Welcome to MyBlog</h1>
          <p className="lead">
            Explore amazing articles and share your thoughts with the community!
          </p>
          <div className="mt-4">
            <Button as={Link} to="/register" variant="primary" className="me-2">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-secondary">
              Login
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2>Latest Articles</h2>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {articles.length === 0 && !loading && !error && (
            <Alert variant="info">No articles found</Alert>
          )}
          <Row>
            {articles.map((article) => (
              <Col key={article.id} md={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>
                      {article.content.length > 100
                        ? article.content.substring(0, 100) + "..."
                        : article.content}
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/articles/${article.id}`}
                      variant="primary"
                    >
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
