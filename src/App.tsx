import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import CoolThing from "./components/CoolThing";
import Search from "./features/search/Search";
import DataDemo from "./features/DataDemo/DataDemo";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import TotalLosses from "./components/TotalLosses";

function App() {
  return (
    <>
      <NavigationBar />
      <Container className="p-3">
        <h2>Search for players across warmane!</h2>
        <small>And see how terrible they are!</small>
        <Search />
        <hr />
        <Row>
          <Col>
            <CoolThing />
          </Col>
          <Col>
            <TotalLosses />
          </Col>
        </Row>
        <DataDemo />
      </Container>
    </>
  );
}

export default App;
