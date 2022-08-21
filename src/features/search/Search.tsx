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
  const [realm, setRealm] = useState("Blackrock");
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

  function handleRealmChange(event: React.FormEvent<HTMLInputElement>) {
    setRealm(event.currentTarget.value);
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
        realm,
      })
    );
    dispatch(clearMatchHistory());
  }

  useEffect(() => {
    if (crawlFinished && matches.length === 0) {
      dispatch(
        getMatchHistory({
          charachter,
          realm,
        })
      );
    }
  }, [crawlFinished, charachter, dispatch, matches, realm]);

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
            value="Blackrock"
            checked={realm === "Blackrock"}
            type={"radio"}
            id={"blackrock-radio"}
            label={"Blackrock"}
            onChange={handleRealmChange}
          />
          <Form.Check
            value="Icecrown"
            checked={realm === "Icecrown"}
            type={"radio"}
            id={`icecrown-radio`}
            label={"Iceclown"}
            onChange={handleRealmChange}
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
