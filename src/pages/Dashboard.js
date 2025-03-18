import { useAuth } from "../context/AuthContext";
import { Container, Card } from "react-bootstrap";
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
        <p className="text-center">This is your dashboard.</p>
      </Card>
    </Container>
  );
}

export default Dashboard;
