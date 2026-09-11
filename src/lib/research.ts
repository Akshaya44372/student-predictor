/**
 * Static values reported in the research paper.
 * These are documentation constants only — they are NOT used to make predictions.
 * All predictions come from the Python ML backend (see src/lib/api).
 */

export const PROJECT = {
  title:
    "Resource-Efficient Machine Learning Framework for Student Performance Prediction: Balancing Accuracy and Computational Cost",
  shortTitle: "Student Performance Prediction Using Machine Learning",
  subtitle:
    "An efficient machine learning framework for predicting student performance while balancing predictive accuracy and computational cost.",
  records: 490,
  features: 17,
  models: 6,
  cvFolds: 5,
  bestAccuracy: "89.3%",
  bestModel: "Random Forest",
  githubUrl: "#",
} as const;

export type ModelResult = {
  name: string;
  short: string;
  accuracy: number;
  best?: boolean;
  note: string;
};

/** Cross-validation accuracies as reported in the paper. */
export const MODEL_RESULTS: ModelResult[] = [
  {
    name: "Logistic Regression",
    short: "LR",
    accuracy: 88.0,
    note: "Linear baseline, very low training and inference cost.",
  },
  {
    name: "Decision Tree",
    short: "DT",
    accuracy: 87.0,
    note: "Interpretable rule-based splits, cheap to train.",
  },
  {
    name: "Random Forest",
    short: "RF",
    accuracy: 89.3,
    best: true,
    note: "Best reported cross-validation accuracy; ensemble of decision trees.",
  },
  {
    name: "Support Vector Machine",
    short: "SVM",
    accuracy: 86.9,
    note: "Margin-based classifier, sensitive to scaling and kernel choice.",
  },
  {
    name: "K-Nearest Neighbors",
    short: "KNN",
    accuracy: 88.9,
    note: "Instance-based; no training phase but costlier at inference.",
  },
  {
    name: "Artificial Neural Network",
    short: "ANN",
    accuracy: 89.1,
    note: "Highest computational cost among the compared models.",
  },
];

export const EVALUATION_METRICS = [
  { name: "Accuracy", desc: "Overall proportion of correctly classified students." },
  { name: "Precision", desc: "Correctness of positive predictions per performance class." },
  { name: "Recall", desc: "Coverage of actual students within each performance class." },
  { name: "F1 Score", desc: "Harmonic mean of precision and recall." },
  { name: "ROC-AUC", desc: "Class separability across decision thresholds." },
  { name: "Cohen's Kappa", desc: "Agreement corrected for chance." },
  { name: "Confusion Matrix", desc: "Per-class breakdown of correct and incorrect predictions." },
  {
    name: "Computational cost",
    desc: "Training and inference cost considered alongside predictive quality.",
  },
];

export const PIPELINE_STEPS = [
  "Data Collection",
  "Data Preprocessing",
  "Feature Engineering",
  "Model Selection",
  "Training & Validation",
  "Evaluation",
  "Prediction",
];

export const PERFORMANCE_CLASSES = ["High", "Medium", "Low"] as const;
export type PerformanceClass = (typeof PERFORMANCE_CLASSES)[number];
