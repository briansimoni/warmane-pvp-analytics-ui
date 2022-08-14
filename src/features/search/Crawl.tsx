import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { crawlAndPoll, Status } from "./search-slice";

interface CrawlProps {
  charachter: string;
  realm: string;
}

function Crawl(props: CrawlProps) {
  const state = useAppSelector((e) => e);
  const { status } = state.search;
  const dispatch = useAppDispatch();

  // function handleChange(event: React.FormEvent<HTMLInputElement>) {
  //   const c = event.currentTarget.value;
  //   setCharachter(c);
  // }

  function handleClick(event: React.FormEvent) {
    event.preventDefault();
    dispatch(
      crawlAndPoll({
        charachter: props.charachter,
        realm: props.realm,
      })
    );
  }

  if (status === Status.LOADING) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Button onClick={handleClick} variant="secondary" type="submit">
      Crawl
    </Button>
  );
}

export default Crawl;
