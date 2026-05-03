import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("renders the Scoreline launch shell", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /sports updates, live scores, and world cup coverage/i,
      }),
    ).toBeInTheDocument();
    const launchSports = screen.getByLabelText(/launch sports/i);
    expect(within(launchSports).getByText(/soccer/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/nba/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/american football/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/baseball/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/mma/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/tennis/i)).toBeInTheDocument();
    expect(within(launchSports).getByText(/golf/i)).toBeInTheDocument();
  });
});
