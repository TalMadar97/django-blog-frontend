import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Card,
  ListGroup,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.access}`,
        },
        body: JSON.stringify({ username, email, bio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      login({ ...user, username, email, bio });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="text-center">Welcome, {user.username}!</h2>
        <p className="text-center">Manage your account details below:</p>

        {success && (
          <Alert variant="success">Profile updated successfully!</Alert>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Update Profile
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Dashboard;
