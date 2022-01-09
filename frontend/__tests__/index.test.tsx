import { render, screen } from "@testing-library/react";
import Home from "@/pages/index";
import { QueryClientProvider, QueryClient } from "react-query";

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
