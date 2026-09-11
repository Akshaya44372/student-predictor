import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/page-header";
import { EVALUATION_METRICS, MODEL_RESULTS, PIPELINE_STEPS, PROJECT } from "@/lib/research";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Project — Student Performance Prediction" },
      {
        name: "description",
        content:
          "Problem statement, methodology, dataset, feature engineering, evaluation metrics and reported results of the resource-efficient student performance prediction framework.",
      },
      { property: "og:title", content: "About the Project — Student Performance Prediction" },
      {
        property: "og:description",
        content:
          "Methodology and reported results of a study comparing six ML algorithms for student performance prediction.",
      },
    ],
  }),
  component: About,
});

const SECTIONS = [
  {
    id: "overview",
    title: "A. Project Overview",
    body: [
      `${PROJECT.title}. The study applies supervised machine learning to student academic, demographic and socioeconomic attributes in order to classify expected performance into High, Medium and Low bands.`,
      "Six classifiers are trained and evaluated under an identical preprocessing and validation protocol so that their predictive quality can be compared directly, alongside the computational resources each one requires.",
    ],
  },
  {
    id: "problem",
    title: "B. Problem Statement",
    body: [
      "Institutions collect substantial student data but often identify struggling students late. Manual review does not scale, and highly accurate models are not always practical to deploy where computing resources are limited.",
      "The problem addressed here is therefore twofold: predict student performance reliably, and do so at a computational cost that is reasonable for routine institutional use.",
    ],
  },
  {
    id: "objective",
    title: "C. Objective",
    body: [
      "Build and compare six machine learning models for student performance classification, evaluate them with a consistent set of metrics, and report predictive quality together with resource considerations rather than accuracy alone.",
    ],
  },
  {
    id: "dataset",
    title: "F. Dataset",
    body: [
      `The dataset comprises ${PROJECT.records} student records with ${PROJECT.features} features covering academic scores, demographic attributes and socioeconomic indicators.`,
      "Input attributes collected by this interface are gender, race/ethnicity, parental level of education, lunch type, test preparation course status, and the math, reading and writing scores.",
    ],
  },
  {
    id: "feature-engineering",
    title: "G. Feature Engineering",
    body: [
      "An Average Score is derived from the math, reading and writing scores. Categorical attributes are label encoded and numerical attributes are standardised with StandardScaler before training.",
      "All encoding and scaling are performed by the Python pipeline. This interface forwards raw values only and never reproduces the transformation logic.",
    ],
  },
  {
    id: "efficiency",
    title: "I. Computational Efficiency",
    body: [
      "Models differ substantially in the resources they consume. Logistic Regression and Decision Tree are inexpensive to train and to serve; K-Nearest Neighbors defers cost to inference time; the Artificial Neural Network is the most demanding of the six.",
      "The framework therefore treats accuracy and computational cost as joint criteria when recommending a model for deployment.",
    ],
  },
  {
    id: "results",
    title: "J. Results",
    body: [
      `Random Forest achieved the best reported cross-validation accuracy of ${PROJECT.bestAccuracy}, with the Artificial Neural Network and K-Nearest Neighbors close behind. Differences between the top models are small.`,
      "Because the accuracy spread across models is narrow, computational cost becomes a meaningful tie-breaker for deployment.",
    ],
  },
  {
    id: "limitations",
    title: "K. Limitations",
    body: [
      `Findings are based on a single dataset of ${PROJECT.records} records, so generalisation to other institutions has not been established. Predicted classes derive from academic score bands and reflect the attributes recorded in the dataset only.`,
      "Results should be interpreted as decision support, never as an individual judgement about a student.",
    ],
  },
  {
    id: "future",
    title: "L. Future Scope",
    body: [
      "Larger and more diverse datasets, additional behavioural and attendance attributes, model explainability for individual predictions, and measured deployment cost benchmarks are natural extensions of this work.",
    ],
  },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Research"
        title="About the Project"
        description={PROJECT.title}
      />

      <div className="grid gap-6 py-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {SECTIONS.slice(0, 3).map((section) => (
            <Section key={section.id} title={section.title} body={section.body} />
          ))}

          <article className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">D. Proposed Methodology</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Records pass through a fixed sequence before a class is produced. Every stage below
              runs inside the Python pipeline.
            </p>
            <ol className="mt-5 space-y-2">
              {PIPELINE_STEPS.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-md bg-foreground/5 font-mono text-[10px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{step}</span>
                  {i < PIPELINE_STEPS.length - 1 ? (
                    <span className="h-px flex-1 bg-border" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </article>

          {SECTIONS.slice(3).map((section) => (
            <Section key={section.id} title={section.title} body={section.body} />
          ))}
        </div>

        <div className="space-y-6 lg:col-span-5">
          <article className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">E. Machine Learning Models</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Model
                    </th>
                    <th className="pb-2 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      Accuracy
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MODEL_RESULTS.map((m) => (
                    <tr key={m.name} className={m.best ? "bg-brand/5" : ""}>
                      <td className="py-3 pr-3">
                        <span className={m.best ? "font-medium" : ""}>{m.name}</span>
                        {m.best ? (
                          <span className="ml-2 rounded-full bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                            Best
                          </span>
                        ) : null}
                      </td>
                      <td
                        className={[
                          "py-3 text-right font-mono",
                          m.best ? "font-medium text-brand" : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {m.accuracy.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Cross-validation accuracies as reported in the research paper. Per-model F1, ROC-AUC
              and Cohen&apos;s Kappa values are available from the evaluation output of the Python
              pipeline and can be surfaced here once supplied.
            </p>
          </article>

          <article className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">H. Evaluation Metrics</h2>
            <ul className="mt-4 space-y-3">
              {EVALUATION_METRICS.map((metric) => (
                <li key={metric.name}>
                  <p className="text-sm font-medium">{metric.name}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{metric.desc}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel p-6">
            <h2 className="text-base font-semibold tracking-tight">Key Findings</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">
                  Random Forest reported the highest accuracy.
                </span>{" "}
                {PROJECT.bestAccuracy} under {PROJECT.cvFolds}-fold cross-validation.
              </li>
              <li>
                <span className="font-medium text-foreground">The top models are close.</span> ANN
                (89.1%) and KNN (88.9%) sit within half a percentage point of the best result.
              </li>
              <li>
                <span className="font-medium text-foreground">Cost matters at similar accuracy.</span>{" "}
                With a narrow accuracy spread, computational cost becomes a decisive factor.
              </li>
              <li>
                <span className="font-medium text-foreground">Simple baselines hold up.</span>{" "}
                Logistic Regression reached 88.0% at a fraction of the resource requirement.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}

function Section({ title, body }: { title: string; body: string[] }) {
  return (
    <article className="panel p-6">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {body.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </article>
  );
}
