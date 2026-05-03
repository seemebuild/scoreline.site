import { describe, expect, it } from "vitest";

import {
  EVENT_STATUS_GROUPS,
  mapProviderEventStatus,
  type EventStatus,
} from "./status";

describe("EVENT_STATUS_GROUPS", () => {
  it("keeps lifecycle statuses grouped for public page filters", () => {
    expect(EVENT_STATUS_GROUPS.upcoming).toEqual(["scheduled", "postponed"]);
    expect(EVENT_STATUS_GROUPS.live).toEqual(["live", "halftime"]);
    expect(EVENT_STATUS_GROUPS.final).toEqual(["final", "cancelled"]);
  });
});

describe("mapProviderEventStatus", () => {
  it.each<[string, EventStatus]>([
    ["NS", "scheduled"],
    ["1H", "live"],
    ["HT", "halftime"],
    ["FT", "final"],
    ["PST", "postponed"],
    ["CANC", "cancelled"],
  ])("maps API-Football status %s to %s", (providerStatus, expected) => {
    expect(mapProviderEventStatus(providerStatus)).toBe(expected);
  });

  it("falls back to scheduled for unknown provider statuses", () => {
    expect(mapProviderEventStatus("mystery")).toBe("scheduled");
  });
});
