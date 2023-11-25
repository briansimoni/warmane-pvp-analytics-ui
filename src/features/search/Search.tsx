import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dogBreedsArr } from "../../components/assets/dogBreedsArr";
import { crawl, CrawlStatus } from "../crawl/crawl-slice";
import {
  clearMatchHistory,
  getMatchHistory,
  SearchStatus,
} from "./search-slice";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchLabel from "./SearchLabel";
import "../../App.css";
import { getCharacterMetadata } from "../../api/warmane-analytics";

type ComponentState = "loading" | "error" | "idle" | "done";

function Search() {
  const dispatch = useAppDispatch();
  const [character, setCharacter] = useState("");
  const [realm, setRealm] = useState("");
  const [progress, setProgress] = useState(0);
  const state = useAppSelector((e) => e);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState();
  const searchStatus = state.search.status;
  const matches = state.search.matches;
  const crawlStatus = state.crawl.status;
  const [componentState, setComponentState] = useState<ComponentState>("idle");
  const [hoveredRealm, setHoveredRealm] = useState<string | null>(null);

  const params = useParams();

  useEffect(() => {
    async function search(character: string, realm: string) {
      if (["error"].includes(componentState)) {
        return;
      }
      setComponentState("loading");
      // getCharacterMetadata makes sure that they actually exist first
      try {
        await getCharacterMetadata(character, realm);
      } catch (error: any) {
        setComponentState("error");
        setErrorMessage(error.message);
        return;
      }
      await dispatch(
        crawl({
          character,
          realm,
        })
      );

      await dispatch(
        getMatchHistory({
          character,
          realm,
        })
      );
      setComponentState("done");
    }
    if (
      params.realm &&
      params.character &&
      componentState !== "done" &&
      componentState !== "loading"
    ) {
      search(params.character, params.realm);
    }
  }, [
    character,
    componentState,
    dispatch,
    params.character,
    params.realm,
    realm,
    matches,
  ]);

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const c = event.currentTarget.value;
    setCharacter(c.trim());
  }

  function handleRealmChange(event: React.FormEvent<HTMLInputElement>) {
    setRealm(event.currentTarget.value);
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLLabelElement>) {
    setHoveredRealm(event.currentTarget.htmlFor);
  }

  function handleMouseLeave() {
    setHoveredRealm(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (
      searchStatus === SearchStatus.LOADING ||
      crawlStatus === CrawlStatus.LOADING
    ) {
      return;
    }
    if (character === "") {
      return;
    }
    dispatch(clearMatchHistory());
    setComponentState("idle");
    const replace = !!params.character;
    navigate(`/p/${realm}/${character}`, {
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

  const randomIndex = Math.floor(Math.random() * dogBreedsArr.length);

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="d-flex justify-content-center">
        <Col>
          <Row className="justify-self-center searchbar-container">
            <Form.Group controlId="formBasicEmail">
              <input
                className="form-control searchbar-text"
                type="text"
                onChange={handleChange}
                value={character}
                placeholder={dogBreedsArr[randomIndex]}
              />
              <Button
                variant="primary"
                type="submit"
                id="character-search-btn"
                disabled={!realm || !character}
                className={!realm || !character ? "disabled" : ""}
              >
                {" "}
                <FontAwesomeIcon
                  className="fa_icon fa_magnifying-glass"
                  icon={faMagnifyingGlass}
                />
              </Button>
            </Form.Group>
          </Row>
          <Row className="search-alert-container">
            {CrawlStatus.LOADING === crawlStatus && (
              <>
                {/* <ProgressBar now={progress} /> */}
                <Alert className="search-alert" variant="primary">
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

            {SearchStatus.FAILED === searchStatus && (
              <>
                <Alert variant="warning">{state.search.errorMessage}</Alert>
              </>
            )}

            {componentState === "error" && (
              <>
                <Alert variant="warning">{errorMessage}</Alert>
              </>
            )}
          </Row>
          <Row className="d-flex justify-content-center">
            <Col className="d-flex justify-content-center">
              <div className="radio-container">
                <input
                  className="custom-form-check"
                  type="radio"
                  id="blackrock-radio"
                  value="Blackrock"
                  checked={realm === "Blackrock"}
                  onChange={handleRealmChange}
                />
                <SearchLabel
                  hoveredRealm={hoveredRealm}
                  htmlFor="Blackrock"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  selectedRealm={realm}
                />
              </div>
            </Col>
            <Col className="d-flex justify-content-center">
              <div className="radio-container">
                <input
                  className="custom-form-check"
                  type="radio"
                  id="iceclown-radio"
                  value="iceclown"
                  checked={realm === "iceclown"}
                  onChange={handleRealmChange}
                />
                <SearchLabel
                  hoveredRealm={hoveredRealm}
                  htmlFor="iceclown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  selectedRealm={realm}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
}

export default Search;
