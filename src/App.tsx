import React from "react";
import Card from 'react-bootstrap/Card'
import { Container } from "react-bootstrap";
import CoolThing from "./components/graph";

import "./App.css";
import { Thing } from "./Thing";

function App() {
  return (
    <Container className="p-3">
      <CoolThing/>
      <Thing/>
      <Card>
        <h1 className="header">
          Welcome To React-Bootstrap TypeScript Example
        </h1>
      </Card>
    </Container>
  );
}

export default App;
