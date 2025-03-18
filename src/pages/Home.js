import { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/articles/");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

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
      <h1 className="text-center">Welcome to MyBlog</h1>
      <p className="lead text-center">
        Explore amazing articles from our community!
      </p>

      {loading && <p className="text-center">Loading articles...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <Row className="mt-4">
        {articles.map((article) => (
          <Col key={article.id} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{article.title}</Card.Title>
                <Card.Text>{article.content.substring(0, 100)}...</Card.Text>
                <Button
                  as={Link}
                  to={`/article/${article.id}`}
                  variant="primary"
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
