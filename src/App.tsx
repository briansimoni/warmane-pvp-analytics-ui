import React from "react";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";
import CoolThing from "./components/graph";
import Search from "./features/search/Search";

function App() {
  return (
    <Container className="p-3">
      <CoolThing />
      <Card>
        <h1 className="header">
          Welcome To React-Bootstrap TypeScript Example
        </h1>
      </Card>
      <Search />
    </Container>
  );
}

export default App;
