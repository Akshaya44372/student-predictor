import { z } from "zod";

/**
 * Input features. These mirror the columns consumed by the Python ML pipeline.
 * Encoding / scaling / feature engineering all happen on the backend —
 * the frontend only collects and forwards raw values.
 */

export const GENDER_OPTIONS = ["female", "male"] as const;
export const RACE_OPTIONS = ["group A", "group B", "group C", "group D", "group E"] as const;
export const PARENTAL_EDUCATION_OPTIONS = [
  "some high school",
  "high school",
  "some college",
  "associate's degree",
  "bachelor's degree",
  "master's degree",
] as const;
export const LUNCH_OPTIONS = ["standard", "free/reduced"] as const;
export const TEST_PREP_OPTIONS = ["none", "completed"] as const;

export const studentInputSchema = z.object({
  gender: z.enum(GENDER_OPTIONS, { message: "Select a gender" }),
  race_ethnicity: z.enum(RACE_OPTIONS, { message: "Select a race/ethnicity group" }),
  parental_level_of_education: z.enum(PARENTAL_EDUCATION_OPTIONS, {
    message: "Select a parental education level",
  }),
  lunch: z.enum(LUNCH_OPTIONS, { message: "Select a lunch type" }),
  test_preparation_course: z.enum(TEST_PREP_OPTIONS, {
    message: "Select a test preparation status",
  }),
  math_score: z.number().min(0, "Score must be 0–100").max(100, "Score must be 0–100"),
  reading_score: z.number().min(0, "Score must be 0–100").max(100, "Score must be 0–100"),
  writing_score: z.number().min(0, "Score must be 0–100").max(100, "Score must be 0–100"),
});

export type StudentInput = z.infer<typeof studentInputSchema>;

export const CATEGORICAL_FEATURES = [
  {
    key: "gender",
    label: "Gender",
    hint: "Reported gender of the student.",
    options: GENDER_OPTIONS as readonly string[],
  },
  {
    key: "race_ethnicity",
    label: "Race / Ethnicity",
    hint: "Anonymised demographic group as recorded in the dataset.",
    options: RACE_OPTIONS as readonly string[],
  },
  {
    key: "parental_level_of_education",
    label: "Parental Level of Education",
    hint: "Highest education level completed by a parent.",
    options: PARENTAL_EDUCATION_OPTIONS as readonly string[],
  },
  {
    key: "lunch",
    label: "Lunch",
    hint: "Lunch programme type — a socioeconomic indicator.",
    options: LUNCH_OPTIONS as readonly string[],
  },
  {
    key: "test_preparation_course",
    label: "Test Preparation Course",
    hint: "Whether the student completed the preparation course.",
    options: TEST_PREP_OPTIONS as readonly string[],
  },
] as const;

export const SCORE_FEATURES = [
  { key: "math_score", label: "Math Score", hint: "Exam score from 0 to 100." },
  { key: "reading_score", label: "Reading Score", hint: "Exam score from 0 to 100." },
  { key: "writing_score", label: "Writing Score", hint: "Exam score from 0 to 100." },
] as const;

export type ScoreKey = (typeof SCORE_FEATURES)[number]["key"];
export type CategoricalKey = (typeof CATEGORICAL_FEATURES)[number]["key"];

export const REQUIRED_COLUMNS = [
  ...CATEGORICAL_FEATURES.map((f) => f.key),
  ...SCORE_FEATURES.map((f) => f.key),
] as string[];

export function averageScore(input: Pick<StudentInput, ScoreKey>): number {
  return (input.math_score + input.reading_score + input.writing_score) / 3;
}

/* ---------- API response shapes ---------- */

export type PredictionResponse = {
  /** Predicted performance class, produced by the backend model. */
  prediction: string;
  /** Optional class probabilities keyed by class name, values 0–1. */
  probabilities?: Record<string, number>;
  /** Model that produced the prediction, e.g. "Random Forest". */
  model?: string;
  /** Average score as computed by the backend, if returned. */
  average_score?: number;
  /** Optional human-readable explanation from the backend. */
  explanation?: string;
  /** True when the response came from the local mock service, not a real model. */
  mock?: boolean;
};

export type BulkPredictionRow = PredictionResponse & {
  id: string | number;
  input: Record<string, string | number>;
};

export type BulkPredictionResponse = {
  results: BulkPredictionRow[];
  model?: string;
  mock?: boolean;
};

export type ModelInfo = {
  active_model: string;
  models: string[];
  classes: string[];
  features: string[];
  mock?: boolean;
};

export type HealthResponse = { status: string; mock?: boolean };

export type WeatherResponse = {
  location: string;
  temperature_c: number;
  condition: string;
  humidity: number;
  wind_kph: number;
  updated_at: string;
  mock?: boolean;
};

export type DatasetResponse = {
  records: number;
  features: number;
  numerical_features: string[];
  categorical_features: string[];
  classes: string[];
  preview: Record<string, string | number>[];
  class_distribution?: Record<string, number>;
  score_distribution?: { bucket: string; math: number; reading: number; writing: number }[];
  mock?: boolean;
};
