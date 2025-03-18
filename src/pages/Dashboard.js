import { useAuth } from "../context/AuthContext";
import { Container, Card, ListGroup } from "react-bootstrap";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow">
        <h2 className="text-center">Welcome, {user.username}!</h2>
        <p className="text-center">Here are your account details:</p>

        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Username:</strong> {user.username}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email:</strong> {user.email}
          </ListGroup.Item>
          {user.bio && (
            <ListGroup.Item>
              <strong>Bio:</strong> {user.bio}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </Container>
  );
}

export default Dashboard;
