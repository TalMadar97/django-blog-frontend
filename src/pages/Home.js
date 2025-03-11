import { Link } from "react-router-dom";
import { Container, Button, Row, Col } from "react-bootstrap";

function Home() {
  return (
    <Container className="text-center mt-5">
      <Row>
        <Col>
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
    </Container>
  );
}

export default Home;
