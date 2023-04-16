import React, { useState, useEffect } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import logo from "./assets/WoW_icon.svg";
import foundDog from "./assets/dog-search-v2.png";
import "../App.css";

function NavigationBar() {
  // keeps track of scroll position
  const [scrollPos, setScrollPos] = useState(0);
  // keeps track of whether Navbar should be shown or hidden
  const [showNavbar, setShowNavbar] = useState(true);

  // effect to update showNavbar and scrollPos
  useEffect(() => {
    const handleScroll = () => {
      // getting current scroll position (including 2 methods w/ identical functions for browser coverage)
      const currentScrollPos =
        document.documentElement.scrollTop || document.body.scrollTop;
      // if current scrollPos is less than previous scrollPos show Navbar, otherwise hide it
      setShowNavbar(currentScrollPos < scrollPos);
      // update scrollPos
      setScrollPos(currentScrollPos);
    };

    // listening for scroll events
    window.addEventListener("scroll", handleScroll);

    // cleanup function to remove event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPos]);

  // useEffect(() => {
  //   console.log(scrollPos);
  // }, [scrollPos]);

  const navbarClasses = showNavbar ? "show-navbar" : "hide-navbar";

  return (
    // on XS screens, scrolling up will hide navbar
    <Navbar className={navbarClasses}>
      <Container>
        <Link className="navbar-link" to="/">
          <Navbar.Brand>
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />{" "}
            <span id="nav-brand-text">warmane.dog</span>
          </Navbar.Brand>
        </Link>
        <div className="found-dog-wrapper">
          <img src={foundDog} className="img-fluid" alt="Found dog" />
        </div>
        <Nav className="me-auto">
          {/* <Nav.Link href="#link">About</Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
