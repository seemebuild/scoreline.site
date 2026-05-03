import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StudioPage from "./page";

describe("StudioPage", () => {
  it("renders starter drafts", () => {
    render(<StudioPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /sanity editorial workspace/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/scoreline editorial policy/i)).toBeInTheDocument();
  });
});
