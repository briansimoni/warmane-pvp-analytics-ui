import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Search from "./features/search/Search";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import DogPicture from "./components/DogPicture";
import Nemisis from "./components/Nemisis";
import Summary from "./components/Summary";
import ClassWinRate from "./components/ClassWinRate";

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
            <DogPicture />
          </Col>
          <Col>
            <Summary />
          </Col>
          <Col>
            <Nemisis />
          </Col>
        </Row>
        {/* <Row>
          <Col>
            <CoolThing />
          </Col>
        </Row> */}
        <Row>
          <Col>
            <ClassWinRate />
          </Col>
        </Row>
        {/* <DataDemo /> */}
      </Container>
    </>
  );
}

export default App;
