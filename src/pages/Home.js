import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Row, Col, Card } from "react-bootstrap";

function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/articles/");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Container className="mt-5">
      <h1 className="text-center">Welcome to MyBlog</h1>
      <p className="text-center">
        Explore amazing articles and share your thoughts with the community!
      </p>

      <Row className="mt-4">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Col key={article.id} md={4} className="mb-4">
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
          ))
        ) : (
          <p className="text-center">No articles available.</p>
        )}
      </Row>
    </Container>
  );
}

export default Home;
