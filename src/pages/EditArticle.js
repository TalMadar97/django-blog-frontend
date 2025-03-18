import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }
        const data = await response.json();

        // בודק שהמשתמש הוא הכותב של המאמר
        if (user.id !== data.author.id) {
          toast.error("You are not authorized to edit this article.");
          navigate("/");
          return;
        }

        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://myblog-backend-lvtd.onrender.com/api/articles/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update article");
      }

      toast.success("Article updated successfully!");
      navigate(`/article/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <h2 className="text-center">Edit Article</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Enter article content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Article"}
        </Button>
      </Form>
    </Container>
  );
}

export default EditArticle;
