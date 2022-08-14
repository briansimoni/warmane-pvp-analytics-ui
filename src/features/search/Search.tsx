import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import { getMatchHistory } from "./search-slice";

function Search() {
  const dispatch = useAppDispatch();
  const [charachter, setCharachter] = useState("");

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const c = event.currentTarget.value;
    setCharachter(c);
  }

  function handleSumbit(event: React.FormEvent) {
    event.preventDefault();
    dispatch(
      getMatchHistory({
        charachter,
        realm: "Blackrock",
      })
    );
  }

  return (
    <Form onSubmit={handleSumbit}>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <input
              placeholder="Cutrock"
              className="form-control"
              type="text"
              onChange={handleChange}
              value={charachter}
            />
          </Form.Group>
          <Form.Check
            defaultChecked
            type={"radio"}
            id={`blackrock-radio`}
            label={`Blackrock`}
          />
          <Form.Check
            disabled={true}
            type={"radio"}
            id={`icecrown-radio`}
            label={`Icecrown`}
          />
        </Col>
        <Col lg="2">
          <Button variant="primary" type="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default Search;
