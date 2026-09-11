# Student Predictor

I am building the frontend for my Machine Learning research project:

"Resource-Efficient Machine Learning Framework for Student Performance Prediction: Balancing Accuracy and Computational Cost"

I already have the ML implementation and research paper. Build a modern, clean, responsive, attractive frontend around my existing ML project.

IMPORTANT:

- Do not invent ML models, dataset features, accuracy values, or prediction logic.

- The frontend should be designed to connect to my existing Python ML backend/API later.

- Use the exact input features and preprocessing logic from my existing ML code.

- Keep the UI professional enough for a research project / IEEE conference demonstration.

- The application must work well on desktop, tablet, and mobile.

- Provide BOTH Dark Mode and Light Mode.

- Add a theme toggle in the navbar.

- Use smooth animations, subtle transitions, cards, charts, icons, and clean spacing.

- Avoid excessive animations or unnecessary visual effects.

- The design should look like a professional AI/ML dashboard rather than a generic website.

PROJECT INFORMATION

Project title:

Resource-Efficient Machine Learning Framework for Student Performance Prediction: Balancing Accuracy and Computational Cost

The project predicts student academic performance using machine learning.

The research compares:

1. Logistic Regression

2. Decision Tree

3. Random Forest

4. Support Vector Machine (SVM)

5. K-Nearest Neighbors (KNN)

6. Artificial Neural Network (ANN)

The research evaluates models using:

- Accuracy

- Precision

- Recall

- F1 Score

- ROC-AUC

- Cohen's Kappa

- Confusion Matrix

- Computational/resource considerations

Random Forest is the main/best-performing model reported in the research paper.

The project uses student academic, demographic, socioeconomic, and related features.

The ML workflow includes:

- Data loading

- Data cleaning

- Feature engineering

- Categorical encoding

- Feature scaling

- Train/test split

- Model training

- Prediction

- Model evaluation

The project also creates an Average Score from:

- Math Score

- Reading Score

- Writing Score

The application should support student performance categories:

- High

- Medium

- Low

IMPORTANT:

Use the actual backend/model logic for determining the class. Do not hard-code a different prediction rule in the frontend.

==================================================

WEBSITE STRUCTURE

==================================================

Create the following main pages:

1. HOME

2. ABOUT PROJECT

3. SINGLE STUDENT PREDICTION

4. BULK / MULTI-STUDENT PREDICTION

5. DATASET

6. WEATHER

7. MODEL / RESULTS section if useful

Use a professional navbar with:

- Home

- About

- Single Prediction

- Bulk Prediction

- Dataset

- Weather

- Theme Toggle

- GitHub / Project button if required

The navbar should remain clean and responsive.

==================================================

1. HOME PAGE

==================================================

Create an attractive hero section.

Hero heading:

"Student Performance Prediction Using Machine Learning"

Subtitle:

"An efficient machine learning framework for predicting student performance while balancing predictive accuracy and computational cost."

Add two primary buttons:

"Predict Student Performance"

"Explore the Project"

Add a visually attractive ML/education illustration or dashboard-style graphic.

Below the hero, show important project statistics in cards:

- 490 Student Records

- 17 Features

- 6 ML Models

- 5-Fold Cross Validation

- Best Reported Accuracy: 89.3%

- Performance Classes: High / Medium / Low

Add a section:

"Why This Project?"

Explain briefly:

- Student performance prediction

- Educational data mining

- Early identification of students requiring support

- Comparison of multiple ML algorithms

- Accuracy vs computational cost

Add a "Machine Learning Pipeline" visual:

Data Collection

↓

Data Preprocessing

↓

Feature Engineering

↓

Model Selection

↓

Training & Validation

↓

Evaluation

↓

Prediction

Add a section showing the six models as attractive cards.

Highlight Random Forest as the best-performing model reported in the research.

Add a call-to-action:

"Try a Prediction"

==================================================

2. ABOUT PROJECT PAGE

==================================================

Create a detailed but easy-to-read About page.

Sections:

A. Project Overview

B. Problem Statement

C. Objective

D. Proposed Methodology

E. Machine Learning Models

F. Dataset

G. Feature Engineering

H. Evaluation Metrics

I. Computational Efficiency

J. Results

K. Limitations

L. Future Scope

Explain the project using information from my research paper.

Do not create fake claims.

Include a visual methodology diagram.

Include the model comparison in a professional table.

Model comparison should show the research results:

Logistic Regression - 88.0%

Decision Tree - 87.0%

Random Forest - 89.3%

SVM - 86.9%

KNN - 88.9%

ANN - 89.1%

Also show F1 scores where appropriate.

Create a clean "Key Findings" section.

==================================================

3. SINGLE STUDENT PREDICTION PAGE

==================================================

This is one of the most important pages.

Create a professional form where the user can enter information for ONE student.

The input fields must come from the actual dataset and existing ML code.

Use the actual project fields such as:

- Gender

- Race/Ethnicity

- Parental Level of Education

- Lunch

- Test Preparation Course

- Math Score

- Reading Score

- Writing Score

Also include any additional features that actually exist in my dataset/code.

DO NOT invent additional ML features.

Use appropriate UI controls:

Dropdowns for categorical features.

Number inputs or sliders for scores.

Validation for score ranges.

Helpful labels and tooltips.

Automatically calculate/display:

Average Score =

(Math Score + Reading Score + Writing Score) / 3

However, the final prediction must be generated using the backend ML model rather than only using frontend rules.

Add a large button:

"Predict Performance"

When clicked:

1. Validate inputs.

2. Send data to backend/API.

3. Receive model prediction.

4. Display prediction result.

Result should be visually attractive.

Example:

PREDICTED PERFORMANCE

HIGH

Confidence / probability visualization if the backend provides probabilities.

Also show:

- Input summary

- Average Score

- Predicted class

- Model used

- Prediction explanation if supported by backend

Use a result card with different visual treatment for:

High Performance

Medium Performance

Low Performance

Do not fake confidence values.

==================================================

SAMPLE DATA BUTTONS

==================================================

This is VERY IMPORTANT.

On the Single Prediction page, provide sample buttons:

"Try High Performance Sample"

"Try Medium Performance Sample"

"Try Low Performance Sample"

When the user clicks one:

- Automatically populate the form with realistic sample values.

- The sample should be based on the actual dataset.

- Do not randomly invent values.

- Clearly label it as sample data.

- Allow the user to modify the values before prediction.

Also add:

"Clear Form"

button.

==================================================

4. BULK / MULTI-STUDENT PREDICTION PAGE

==================================================

Create a professional bulk prediction interface.

Purpose:

Allow the user to upload multiple student records and receive predictions for all students.

Support:

- CSV

- Excel (.xlsx / .xls)

- Multiple files/folder upload if supported by the browser/backend

Main area:

"Upload Student Dataset"

Drag-and-drop upload area.

Show:

- File name

- File size

- Number of records

- Validation status

- Remove file option

Buttons:

"Upload Dataset"

"Predict All Students"

"Download Results"

"Clear"

After uploading:

Show a preview table containing the uploaded student data.

Then send the data to the backend for prediction.

Display:

Total Students

High

Medium

Low

Also show a prediction results table:

Student ID

Relevant Input Information

Average Score

Predicted Performance

Probability/Confidence if available

Add filters:

- All

- High

- Medium

- Low

Add search functionality.

Add charts:

- Performance distribution

- High vs Medium vs Low

- Average score distribution

Allow:

"Download Prediction Results"

as CSV/Excel.

IMPORTANT:

The bulk prediction must use the same preprocessing and trained ML model as the single prediction system.

Do not implement separate prediction logic in the frontend.

==================================================

5. DATASET PAGE

==================================================

Create a detailed Dataset page.

Show dataset overview cards:

- Number of Records

- Number of Features

- Numerical Features

- Categorical Features

- Performance Classes

Explain:

"The dataset contains student academic, demographic and socioeconomic information used for student performance prediction."

Show a professional dataset preview table.

Include sections:

Dataset Description

Feature Description

Data Preprocessing

Feature Engineering

Class Distribution

Show the performance categories:

High

Medium

Low

Create charts where useful.

Include:

Math Score

Reading Score

Writing Score

Average Score

Show correlation visualization between academic scores if backend/static research data supports it.

Also show the research observations such as relationships between academic scores and parental education, but do not exaggerate correlation.



==================================================

7. MODEL RESULTS / ANALYTICS

==================================================

Create a professional results section/page.

Show model comparison:

| Model | Accuracy |

| Logistic Regression | 88.0% |

| Decision Tree | 87.0% |

| Random Forest | 89.3% |

| SVM | 86.9% |

| KNN | 88.9% |

| ANN | 89.1% |

Use charts for comparison.

Create:

- Accuracy comparison chart

- F1-score comparison

- ROC-AUC comparison

- Confusion matrix visualization if backend/static research results are available

Highlight:

"Random Forest achieved the best reported cross-validation accuracy of 89.3%."

Also communicate the research focus:

"High predictive performance should be considered together with computational cost."

==================================================

8. DARK MODE AND LIGHT MODE

==================================================

The entire website must support:

LIGHT MODE

DARK MODE

Add a theme toggle in the navbar.

The theme should affect:

- Background

- Cards

- Text

- Tables

- Forms

- Buttons

- Charts

- Navigation

- Prediction results

- Upload area

Persist the selected theme using localStorage.

Make sure both modes are visually polished and readable.

Do not use harsh colors or excessive gradients.

==================================================

9. UI / UX DESIGN

==================================================

Design style:

Modern

Minimal

Professional

AI/ML

Educational technology

Research-oriented

Use:

- Clean typography

- Rounded cards

- Subtle shadows

- Good spacing

- Responsive grid layouts

- Icons

- Smooth hover effects

- Loading indicators

- Toast notifications

- Skeleton loaders where appropriate

- Accessible form controls

Use a consistent design system throughout the application.

Make prediction results visually prominent.

Use responsive tables that work properly on mobile.

==================================================

10. ERROR HANDLING

==================================================

Handle:

- Invalid score values

- Missing fields

- Incorrect file format

- Empty file

- Invalid dataset columns

- Backend/API failure

- Prediction failure

- Weather API failure

- Network errors

Show user-friendly error messages.

Never expose technical stack traces to normal users.

==================================================

11. BACKEND INTEGRATION

==================================================

Structure the frontend so it can communicate with my Python ML backend.

Recommended API structure:

POST /predict

POST /predict-bulk

GET /dataset

GET /model-info

GET /health

GET /weather

If the backend endpoints are not available yet:

- Create clean service/API abstraction files.

- Use mock data only for UI development.

- Clearly separate mock data from production API calls.

- Make it easy to replace mock services with my actual Flask/FastAPI backend later.

The ML model, preprocessing, encoder and scaler should remain on the backend.

The frontend should NOT recreate the machine learning model.

==================================================

12. IMPORTANT ML INTEGRATION RULE

==================================================

My Python code already performs:

- Label encoding

- StandardScaler preprocessing

- Feature engineering

- Model training

- Random Forest

- Logistic Regression

- Decision Tree

- SVM

- KNN

- ANN

- Evaluation

- Prediction

The frontend should collect the correct inputs and send them to the backend.

Do not duplicate preprocessing logic in JavaScript unless explicitly required by the backend architecture.

The backend should be responsible for:

Input preprocessing

Feature encoding

Scaling

Model prediction

Probability calculation

Result generation

==================================================

13. FOOTER

==================================================

Create a professional footer containing:

Project title

Short project description

Machine Learning / Educational Data Mining

Research project

GitHub link placeholder

Contact / team information placeholder

==================================================

14. FINAL REQUIREMENT

==================================================

Build the complete frontend with all pages connected through navigation.

The final experience should feel like a real deployed AI-powered educational analytics application.

The user journey should be:

Home

→ Learn about project

→ Enter single student data

→ Try sample High/Medium/Low data

→ Predict performance

OR

Home

→ Bulk Prediction

→ Upload CSV/Excel

→ Preview data

→ Predict all

→ View analytics

→ Download results

OR

Home

→ Dataset

→ Understand dataset/features

OR

Home

→ Weather

→ View weather information

Make the application polished enough to demonstrate as part of an academic research project / IEEE conference presentation.

Before generating the final implementation, inspect the existing project structure and integrate with the existing code instead of unnecessarily replacing the project architecture.

Use reusable components and clean code organization.

Make every page functional, responsive, and visually consistent.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e6a76721-3cb2-4cb0-887d-6ee9d1786e90).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
