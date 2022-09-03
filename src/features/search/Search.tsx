import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { crawlAndWait, CrawlStatus } from "../crawl/crawl-slice";
import {
  clearMatchHistory,
  getMatchHistory,
  SearchStatus,
} from "./search-slice";
import { useParams } from "react-router-dom";

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

  const params = useParams();
  // console.log(params);
  // if (
  //   params.realm &&
  //   params.charachter &&
  //   !state.search.charachter &&
  //   crawlStatus !== CrawlStatus.LOADING
  // ) {
  //   console.log(params);
  //   // dispatch(
  //   //   crawlAndWait({
  //   //     charachter: params.charachter,
  //   //     realm: params.realm,
  //   //   })
  //   // );
  // }

  useEffect(() => {
    if (
      params.realm &&
      params.charachter &&
      !state.search.charachter &&
      crawlStatus !== CrawlStatus.LOADING
    ) {
      console.log(params);
      // dispatch(
      //   crawlAndWait({
      //     charachter: params.charachter,
      //     realm: params.realm,
      //   })
      // );
    }
  }, [params, charachter, crawlStatus, state.search, dispatch]);

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const c = event.currentTarget.value;
    setCharachter(c.trim());
  }

  function handleRealmChange(event: React.FormEvent<HTMLInputElement>) {
    setRealm(event.currentTarget.value);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (
      searchStatus === SearchStatus.LOADING ||
      crawlStatus === CrawlStatus.LOADING
    ) {
      return;
    }
    if (charachter === "") {
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
    if (crawlStatus === CrawlStatus.LOADING && progress <= 60) {
      setTimeout(() => {
        setProgress(progress + 1);
      }, 1000);
    }
    if (crawlStatus === CrawlStatus.IDLE) {
      setProgress(0);
    }
  }, [crawlStatus, progress, setProgress]);

  return (
    <Form onSubmit={handleSubmit}>
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
              {/* <ProgressBar now={progress} /> */}
              <Alert variant="primary">
                Crawling warmane.com for data. This may take a minute. Time
                elapsed: {progress}s
              </Alert>
            </>
          )}
          {CrawlStatus.FAILED === crawlStatus && (
            <>
              <Alert variant="warning">{state.crawl.error.message}</Alert>
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
