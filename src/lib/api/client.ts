/**
 * API abstraction for the Python ML backend.
 *
 * Production: set VITE_API_BASE_URL (e.g. http://localhost:8000) and every call
 * below hits the real Flask/FastAPI endpoints:
 *   POST /predict        POST /predict-bulk
 *   GET  /dataset        GET  /model-info
 *   GET  /health         GET  /weather
 *
 * Development: with no base URL configured the mock service in ./mock.ts is used
 * and every response is flagged `mock: true`.
 *
 * The frontend never encodes, scales or models anything — it only forwards inputs.
 */
import * as mock from "./mock";
import type {
  BulkPredictionResponse,
  DatasetResponse,
  HealthResponse,
  ModelInfo,
  PredictionResponse,
  StudentInput,
  WeatherResponse,
} from "./types";

export const API_BASE_URL: string =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "") ?? "";

export const IS_MOCK = API_BASE_URL === "";

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const FRIENDLY: Record<number, string> = {
  400: "The data sent to the prediction service was rejected. Please check the values and try again.",
  404: "The prediction service could not be found at the configured address.",
  413: "That file is too large for the prediction service.",
  422: "Some values were not in the format the model expects.",
  500: "The prediction service ran into a problem. Please try again in a moment.",
  503: "The prediction service is currently unavailable. Please try again shortly.",
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      ...init,
    });
  } catch {
    throw new ApiError(
      "Could not reach the prediction service. Please check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new ApiError(
      FRIENDLY[response.status] ?? "The prediction service returned an unexpected response.",
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new ApiError("The prediction service returned a response we could not read.");
  }
}

export const api = {
  health(): Promise<HealthResponse> {
    return IS_MOCK ? mock.mockHealth() : request<HealthResponse>("/health");
  },

  modelInfo(): Promise<ModelInfo> {
    return IS_MOCK ? mock.mockModelInfo() : request<ModelInfo>("/model-info");
  },

  dataset(): Promise<DatasetResponse> {
    return IS_MOCK ? mock.mockDataset() : request<DatasetResponse>("/dataset");
  },

  predict(input: StudentInput): Promise<PredictionResponse> {
    if (IS_MOCK) return mock.mockPredict(input);
    return request<PredictionResponse>("/predict", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  predictBulk(rows: Record<string, string | number>[]): Promise<BulkPredictionResponse> {
    if (IS_MOCK) return mock.mockPredictBulk(rows);
    return request<BulkPredictionResponse>("/predict-bulk", {
      method: "POST",
      body: JSON.stringify({ records: rows }),
    });
  },

  weather(query?: string): Promise<WeatherResponse> {
    if (IS_MOCK) return mock.mockWeather();
    const qs = query ? `?location=${encodeURIComponent(query)}` : "";
    return request<WeatherResponse>(`/weather${qs}`);
  },
};
