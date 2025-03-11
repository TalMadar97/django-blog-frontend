import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-4 text-danger">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </Container>
  );
}

export default NotFound;
