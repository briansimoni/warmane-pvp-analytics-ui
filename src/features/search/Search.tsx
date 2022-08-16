import React, { useEffect, useState } from "react";
import { Button, Col, Form, ProgressBar, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { crawlAndWait, CrawlStatus } from "../crawl/crawl-slice";
import {
  clearMatchHistory,
  getMatchHistory,
  SearchStatus,
} from "./search-slice";

function Search() {
  const dispatch = useAppDispatch();
  const [charachter, setCharachter] = useState("");
  const [progress, setProgress] = useState(0);
  const state = useAppSelector((e) => e);
  const searchStatus = state.search.status;
  const matches = state.search.matches;
  const crawlStatus = state.crawl.status;
  const crawlFinished = state.crawl.crawlFinished;

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const c = event.currentTarget.value;
    setCharachter(c);
  }

  function handleSumbit(event: React.FormEvent) {
    event.preventDefault();
    if (
      searchStatus === SearchStatus.LOADING ||
      crawlStatus === CrawlStatus.LOADING
    ) {
      return;
    }
    dispatch(
      crawlAndWait({
        charachter,
        realm: "Blackrock",
      })
    );
    dispatch(clearMatchHistory());
  }

  useEffect(() => {
    if (crawlFinished && matches.length === 0) {
      dispatch(
        getMatchHistory({
          charachter,
          realm: "Blackrock",
        })
      );
    }
  }, [crawlFinished, charachter, dispatch, matches]);

  useEffect(() => {
    if (crawlStatus === CrawlStatus.LOADING && progress <= 100) {
      setTimeout(() => {
        setProgress(progress + 1);
      }, 250);
    }
    if (crawlStatus === CrawlStatus.IDLE) {
      setProgress(0);
    }
  }, [crawlStatus, progress, setProgress]);

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
          {CrawlStatus.LOADING === crawlStatus && (
            <>
              <p>Crawling warmane.com for data. This may take a minute.</p>
              <ProgressBar now={progress} />
            </>
          )}
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
