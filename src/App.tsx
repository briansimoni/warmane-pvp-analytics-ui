import { Col, Container, Row } from "react-bootstrap";
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
      <Container fluid="xl" className="p-3 main-container">
        <h1 className='header'>Search for players across Warmane...</h1>
        <p>Let's see just how terrible they are!</p>
        <Search />
        <hr />
          {/*  Summary */}
          <div className="bracket-divider">
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
        </div>
        {/* Solo Queue */}
        <div className="bracket-divider">
        <Row>
          <Col>
            <h2 className="header-caption">Solo Queue Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="5v5" title="Solo Queue Breakdown" />
          </Col>
        </Row>
        </div>

        {/* 2v2 */}
        <div className="bracket-divider">
        <Row>
          <Col>
            <h2 className="header-caption">2v2 Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="2v2" title="2v2 Breakdown" />
          </Col>
        </Row>
        </div>
        <div className="bracket-divider">
        <Row>
          <Col>
            <h2 className="header-caption">3v3 Breakdown</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <BracketBreakdown bracket="3v3" title="3v3 Breakdown" />
          </Col>
        </Row>
        </div>
        <Col></Col>
      </Container>
    </>
  );
}

export default App;
