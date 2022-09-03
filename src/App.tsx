import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Search from "./features/search/Search";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import DogPicture from "./components/DogPicture";
import Nemisis from "./components/Nemisis";
import Summary from "./components/Summary";
import ClassWinRate from "./components/ClassWinRate";
import BracketBreakdown from "./components/Bracket/BracketBreakdown";

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
        <Row>
          <Col>
            <ClassWinRate />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Solo Queue Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="5v5" title="Solo Queue Breakdown" />
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>2v2 Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="2v2" title="2v2 Breakdown" />
          </Col>
        </Row>

        <Row>
          <Col>
            <h2>3v3 Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="3v3" title="3v3 Breakdown" />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
