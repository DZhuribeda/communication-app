import { render, screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "react-query";
import Home from "../pages/rooms";

function renderComponent() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <Home />
    </QueryClientProvider>
  );
}

describe("Home", () => {
  it("renders a heading", () => {
    renderComponent();

    const heading = screen.getByRole("heading", {
      name: /Rooms/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
