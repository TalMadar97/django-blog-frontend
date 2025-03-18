import { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          "https://myblog-backend-lvtd.onrender.com/api/articles/favorites/",
          {
            headers: { Authorization: `Bearer ${user.access}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite articles");
        }

        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (!user) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="warning">
          You must be logged in to view favorites.
        </Alert>
      </Container>
    );
  }

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
      <h2>Your Favorite Articles</h2>
      {favorites.length === 0 ? (
        <p>No favorite articles yet.</p>
      ) : (
        favorites.map((article) => (
          <Card key={article.id} className="mt-3">
            <Card.Body>
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.content.slice(0, 100)}...</Card.Text>
              <Link to={`/article/${article.id}`} className="btn btn-primary">
                Read More
              </Link>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Favorites;
