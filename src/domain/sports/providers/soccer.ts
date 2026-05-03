import type { ProviderSnapshot } from "./types";

type ApiFootballClientOptions = {
  apiKey: string;
  baseUrl: string;
  fetch?: typeof fetch;
  retry?: {
    attempts: number;
    delayMs: number;
  };
  timeoutMs?: number;
};

type ApiFootballRequestParams = Record<string, string | number | boolean | undefined>;

type ApiFootballTransport = {
  get: <TResponse = unknown>(endpoint: string, params?: ApiFootballRequestParams) => Promise<TResponse>;
};

type SoccerApiFootballClient = ApiFootballTransport & {
  getLeagues: <TResponse = unknown>(params?: ApiFootballRequestParams) => Promise<TResponse>;
  getFixtures: <TResponse = unknown>(params?: ApiFootballRequestParams) => Promise<TResponse>;
  getStandings: <TResponse = unknown>(params?: ApiFootballRequestParams) => Promise<TResponse>;
};

export function createApiFootballSoccerClient(options: ApiFootballClientOptions): SoccerApiFootballClient {
  const transport = createApiFootballTransport(options);

  return {
    ...transport,
    getLeagues: (params) => transport.get("leagues", params),
    getFixtures: (params) => transport.get("fixtures", params),
    getStandings: (params) => transport.get("standings", params),
  };
}

function createApiFootballTransport(options: ApiFootballClientOptions): ApiFootballTransport {
  const fetchImpl = options.fetch ?? fetch;
  const retryAttempts = Math.max(1, options.retry?.attempts ?? 1);
  const retryDelayMs = Math.max(0, options.retry?.delayMs ?? 250);
  const timeoutMs = Math.max(1, options.timeoutMs ?? 10_000);

  return {
    async get<TResponse = unknown>(endpoint: string, params?: ApiFootballRequestParams): Promise<TResponse> {
      const url = new URL(endpoint, options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`);
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined) {
            url.searchParams.set(key, String(value));
          }
        }
      }

      for (let attempt = 1; attempt <= retryAttempts; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
          const response = await fetchImpl(url, {
            method: "GET",
            headers: {
              "x-apisports-key": options.apiKey,
            },
            signal: controller.signal,
          });

          if (!response.ok) {
            if (shouldRetryStatus(response.status) && attempt < retryAttempts) {
              continue;
            }

            throw new Error(`API-Football request failed with status ${response.status}`);
          }

          return (await response.json()) as TResponse;
        } catch (error) {
          if (attempt >= retryAttempts) {
            throw error;
          }
        } finally {
          clearTimeout(timeout);
        }

        if (retryDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
      }

      throw new Error("API-Football request failed");
    },
  };
}

function shouldRetryStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

export type { ProviderSnapshot };
