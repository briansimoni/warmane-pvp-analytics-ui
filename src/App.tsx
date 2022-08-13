import React from "react";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";
import CoolThing from "./components/graph";
import Search from "./features/search/Search";
import DataDemo from "./features/DataDemo/DataDemo";

function App() {
  return (
    <Container className="p-3">
      <CoolThing />
      <Card>
        <h1 className="header">You are bad</h1>
      </Card>
      <Search />
      <DataDemo />
    </Container>
  );
}

export default App;
