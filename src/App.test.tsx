import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";

describe("app tests", () => {
  beforeEach(() => {
    window.ResizeObserver = jest.fn(() => {
      return {
        observe() {},
        disconnect() {},
        unobserve() {},
      };
    });
  });

  test("renders learn react link", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const linkElement = screen.getByText(/Search for players across warmane!/i);
    expect(linkElement).toBeInTheDocument();
  });
});
