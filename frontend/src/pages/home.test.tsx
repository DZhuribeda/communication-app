import React from "react";
import { MemoryRouter as Router } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Home from "./home";
import { useUser } from "../lib/state/user";

test("renders login if no user", () => {
  render(
    <Router>
      <Home />
    </Router>
  );
  const linkElement = screen.getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders welcome text for user", () => {
  // TODO: move to util
  useUser.setState({ username: "test" });
  render(
    <Router>
      <Home />
    </Router>
  );
  const linkElement = screen.getByText(/welcome/i);
  expect(linkElement).toBeInTheDocument();
});
