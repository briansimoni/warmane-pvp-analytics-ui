import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
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
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Player Search</Form.Label>
        <input
          className="form-control"
          type="text"
          onChange={handleChange}
          value={charachter}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default Search;
