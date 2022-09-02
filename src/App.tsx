import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Search from "./features/search/Search";
import NavigationBar from "./components/NavigationBar";
import "./App.css";
import DogPicture from "./components/DogPicture";
import Nemisis from "./components/Nemisis";
import Summary from "./components/Summary";
import ClassWinRate from "./components/ClassWinRate";
import SoloQueueBreakDown from "./components/SoloQueue/SoloQueueBreakdown";

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
        <Row>
          <Col>
            <Card>
              <h2>Solo Queue Breakdown</h2>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <SoloQueueBreakDown />
          </Col>
        </Row>
        {/* <DataDemo /> */}
      </Container>
    </>
  );
}

export default App;
