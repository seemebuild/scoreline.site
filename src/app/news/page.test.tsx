import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NewsPage from "./page";

describe("NewsPage", () => {
  it("renders the editorial shell", async () => {
    render(await NewsPage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /editorial coverage/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /scoreline editorial workflow is coming online/i })).toBeInTheDocument();
  });
});
