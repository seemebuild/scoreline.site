import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthorsPage from "./page";

describe("AuthorsPage", () => {
  it("renders the author index", async () => {
    render(await AuthorsPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /editorial team/i,
      }),
    ).toBeInTheDocument();
  });
});
