import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { crawl, CrawlStatus } from "../crawl/crawl-slice";
import {
  clearMatchHistory,
  getMatchHistory,
  SearchStatus,
} from "./search-slice";
import { useNavigate, useParams } from "react-router-dom";

type ComponentState = "loading" | "error" | "idle" | "done";

function Search() {
  const dispatch = useAppDispatch();
  const [charachter, setCharachter] = useState("");
  const [realm, setRealm] = useState("Blackrock");
  const [progress, setProgress] = useState(0);
  const state = useAppSelector((e) => e);
  const navigate = useNavigate();
  const searchStatus = state.search.status;
  const matches = state.search.matches;
  const crawlStatus = state.crawl.status;
  const [componentState, setComponentState] = useState<ComponentState>("idle");

  const params = useParams();

  useEffect(() => {
    async function search(charachter: string, realm: string) {
      setComponentState("loading");
      await dispatch(
        crawl({
          charachter,
          realm,
        })
      );

      await dispatch(
        getMatchHistory({
          charachter,
          realm,
        })
      );
      setComponentState("done");
    }
    if (
      params.realm &&
      params.charachter &&
      componentState !== "done" &&
      componentState !== "loading"
    ) {
      search(params.charachter, params.realm);
    }
  }, [
    charachter,
    componentState,
    dispatch,
    params.charachter,
    params.realm,
    realm,
    matches,
  ]);

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
    dispatch(clearMatchHistory());
    setComponentState("idle");
    const replace = !!params.charachter;
    navigate(`/p/${realm}/${charachter}`, {
      replace,
    });
  }

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
            value="icecrown"
            checked={realm === "icecrown"}
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
