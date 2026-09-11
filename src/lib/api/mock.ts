/**
 * MOCK SERVICE — UI development only.
 *
 * Nothing here is a real machine-learning model. It exists so the interface can
 * be demonstrated before the Python backend is connected. Every response is
 * flagged with `mock: true` and the UI shows a "Demo mode" banner.
 *
 * Set VITE_API_BASE_URL to your Flask/FastAPI base URL and this file is bypassed
 * entirely — see src/lib/api/client.ts.
 */
import {
  averageScore,
  type BulkPredictionResponse,
  type DatasetResponse,
  type HealthResponse,
  type ModelInfo,
  type PredictionResponse,
  type StudentInput,
  type WeatherResponse,
} from "./types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Placeholder banding used only for the demo; the real class comes from the model. */
function placeholderClass(avg: number): string {
  if (avg >= 75) return "High";
  if (avg >= 55) return "Medium";
  return "Low";
}

export async function mockPredict(input: StudentInput): Promise<PredictionResponse> {
  await delay(650);
  const avg = averageScore(input);
  return {
    prediction: placeholderClass(avg),
    model: "Demo placeholder (no backend connected)",
    average_score: Number(avg.toFixed(2)),
    explanation:
      "Demo mode: this label is a placeholder based on the average score. Connect the Python backend to get real model output and probabilities.",
    mock: true,
  };
}

export async function mockPredictBulk(
  rows: Record<string, string | number>[],
): Promise<BulkPredictionResponse> {
  await delay(900);
  return {
    model: "Demo placeholder (no backend connected)",
    mock: true,
    results: rows.map((row, i) => {
      const avg =
        (Number(row.math_score) + Number(row.reading_score) + Number(row.writing_score)) / 3;
      return {
        id: (row.student_id as string | number) ?? i + 1,
        input: row,
        prediction: placeholderClass(avg),
        average_score: Number(avg.toFixed(2)),
        mock: true,
      };
    }),
  };
}

export async function mockModelInfo(): Promise<ModelInfo> {
  await delay(250);
  return {
    active_model: "Not connected",
    models: [
      "Logistic Regression",
      "Decision Tree",
      "Random Forest",
      "Support Vector Machine",
      "K-Nearest Neighbors",
      "Artificial Neural Network",
    ],
    classes: ["High", "Medium", "Low"],
    features: [
      "gender",
      "race_ethnicity",
      "parental_level_of_education",
      "lunch",
      "test_preparation_course",
      "math_score",
      "reading_score",
      "writing_score",
    ],
    mock: true,
  };
}

export async function mockHealth(): Promise<HealthResponse> {
  await delay(150);
  return { status: "mock", mock: true };
}

/** Example rows shown as a table preview. Replace with GET /dataset from the backend. */
export const SAMPLE_ROWS: Record<string, string | number>[] = [
  {
    gender: "female",
    race_ethnicity: "group B",
    parental_level_of_education: "bachelor's degree",
    lunch: "standard",
    test_preparation_course: "none",
    math_score: 72,
    reading_score: 72,
    writing_score: 74,
  },
  {
    gender: "female",
    race_ethnicity: "group C",
    parental_level_of_education: "some college",
    lunch: "standard",
    test_preparation_course: "completed",
    math_score: 69,
    reading_score: 90,
    writing_score: 88,
  },
  {
    gender: "female",
    race_ethnicity: "group B",
    parental_level_of_education: "master's degree",
    lunch: "standard",
    test_preparation_course: "none",
    math_score: 90,
    reading_score: 95,
    writing_score: 93,
  },
  {
    gender: "male",
    race_ethnicity: "group A",
    parental_level_of_education: "associate's degree",
    lunch: "free/reduced",
    test_preparation_course: "none",
    math_score: 47,
    reading_score: 57,
    writing_score: 44,
  },
  {
    gender: "male",
    race_ethnicity: "group C",
    parental_level_of_education: "some college",
    lunch: "standard",
    test_preparation_course: "none",
    math_score: 76,
    reading_score: 78,
    writing_score: 75,
  },
  {
    gender: "female",
    race_ethnicity: "group B",
    parental_level_of_education: "associate's degree",
    lunch: "standard",
    test_preparation_course: "none",
    math_score: 71,
    reading_score: 83,
    writing_score: 78,
  },
  {
    gender: "female",
    race_ethnicity: "group B",
    parental_level_of_education: "some college",
    lunch: "standard",
    test_preparation_course: "completed",
    math_score: 88,
    reading_score: 95,
    writing_score: 92,
  },
  {
    gender: "male",
    race_ethnicity: "group B",
    parental_level_of_education: "some college",
    lunch: "free/reduced",
    test_preparation_course: "none",
    math_score: 40,
    reading_score: 43,
    writing_score: 39,
  },
];

export async function mockDataset(): Promise<DatasetResponse> {
  await delay(300);
  return {
    records: 490,
    features: 17,
    numerical_features: ["math_score", "reading_score", "writing_score", "average_score"],
    categorical_features: [
      "gender",
      "race_ethnicity",
      "parental_level_of_education",
      "lunch",
      "test_preparation_course",
    ],
    classes: ["High", "Medium", "Low"],
    preview: SAMPLE_ROWS,
    mock: true,
  };
}

export async function mockWeather(): Promise<WeatherResponse> {
  await delay(400);
  return {
    location: "Not connected",
    temperature_c: 0,
    condition: "Demo mode — no weather source connected",
    humidity: 0,
    wind_kph: 0,
    updated_at: new Date().toISOString(),
    mock: true,
  };
}
