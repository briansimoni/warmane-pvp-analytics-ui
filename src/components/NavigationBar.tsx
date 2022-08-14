import { Nav } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "./WoW_icon.svg";

function NavigationBar() {
  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />{" "}
          <span id="nav-brand-text">warmane.dog</span>
        </Navbar.Brand>
        <Nav className="me-auto">
          {/* <Nav.Link href="#link">About</Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
