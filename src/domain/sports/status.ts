export const EVENT_STATUSES = [
  "scheduled",
  "live",
  "halftime",
  "final",
  "postponed",
  "cancelled",
] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_STATUS_GROUPS = {
  upcoming: ["scheduled", "postponed"],
  live: ["live", "halftime"],
  final: ["final", "cancelled"],
} as const satisfies Record<string, readonly EventStatus[]>;

const apiFootballStatusMap: Record<string, EventStatus> = {
  TBD: "scheduled",
  NS: "scheduled",
  "1H": "live",
  "2H": "live",
  ET: "live",
  BT: "live",
  P: "live",
  SUSP: "live",
  INT: "live",
  HT: "halftime",
  FT: "final",
  AET: "final",
  PEN: "final",
  PST: "postponed",
  CANC: "cancelled",
  ABD: "cancelled",
  AWD: "cancelled",
  WO: "cancelled",
};

export function mapProviderEventStatus(providerStatus: string): EventStatus {
  return apiFootballStatusMap[providerStatus.toUpperCase()] ?? "scheduled";
}
