# Mission Health
### Astronaut Health Monitoring System

**NASA Space Apps Challenge 2026**

Mission Health is a software prototype designed to help monitor astronaut health during space missions. It brings together health indicators, trend analysis, symptom tracking, and health reporting in one dashboard.

The project follows a simple workflow: **GATHER → EVALUATE → ACT**. It collects health information, evaluates readings for potential concerns, and presents understandable results that can be reviewed by the ground team.

## Project Links

- **Live Application:** (https://bilaltalukder.github.io/space-apps-health-monitoring/)
- **Demonstration Video:** (https://www.youtube.com/watch?v=AD91C-7wUpE)
- **Team Name:** Lancer Larpers

## The Problem

Astronauts experience unique health challenges during spaceflight. Microgravity, isolation, changes in sleep, and other mission conditions can affect the human body. Monitoring these changes is important for identifying potential health concerns and supporting crew well-being.

Mission Health explores how a digital monitoring system could organize health information, highlight unusual readings, and make it easier for astronauts and ground teams to understand changes over time.

## Features

### Health Monitoring Dashboard

The dashboard provides an overview of an astronaut's health, including key measurements and their current status. It displays an overall Mission Health Score out of 100 to summarize the day's readings.

### Health Indicators

The application tracks eight health measurements and wellness indicators:

- Heart rate
- Blood pressure
- Blood glucose
- Body temperature
- Blood oxygen saturation (SpO₂)
- Respiratory rate
- Sleep
- Exercise

Each indicator is evaluated using simplified reference ranges and assigned a status to help highlight readings that may need attention.

### Trend Analysis

Mission Health examines changes in health readings over the simulation timeline. Trend alerts help identify patterns and repeated changes that may not be obvious from looking at a single measurement.

### Interactive Astronaut Body Map

The dashboard includes an interactive body map that allows users to explore different areas of the astronaut's body and view related health information.

### Symptom Analysis

Users can record symptoms and review related health information. This provides additional context alongside the numerical health measurements.

### Daily Health Check-in

Users can enter daily health information through a check-in form. Submitted readings update the dashboard and become part of the simulation history.

Existing check-ins can also be edited or cancelled without advancing the simulation day.

### Check-in History

The application stores submitted check-ins locally and allows users to review previous entries. This makes it possible to follow changes across the simulation timeline.

### Share with Ground

Mission Health can generate a health report containing the astronaut's current health score, flagged indicators, and trend alerts. The report can be copied for review or sharing with a ground team.

## How It Works

Mission Health is organized around three main stages:

**1. GATHER**

The application collects health readings and wellness information through daily check-ins. The current prototype uses simulated astronaut data.

**2. EVALUATE**

The system compares readings against defined reference ranges, assigns health statuses, calculates an overall score, and checks for trends that may require attention.

**3. ACT**

The dashboard presents health information, highlights potential concerns, and generates reports that can be reviewed by the ground team.

## Health Evaluation

Each health indicator is evaluated using reference ranges defined in the project source code. Readings are categorized into green, yellow, or red statuses to communicate their relative level of concern.

The Mission Health Score starts at 100 and is adjusted according to the statuses of the health indicators. Blood pressure is treated as one combined measurement when calculating the score to avoid counting systolic and diastolic readings separately.

The scoring system and alert rules are simplified examples created for this prototype. They are not official NASA medical thresholds and have not been clinically validated.

## Running the Project

1. Download or clone this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

For development, the project can be opened and edited using Visual Studio Code.

## Testing

The application includes basic self-tests for parts of its health evaluation logic. These tests help verify that indicator statuses and scoring behave as expected.

The dashboard and its interactive features were also tested during development, including daily check-ins, editing and cancelling entries, trend alerts, and report generation.

## Project Structure

| File | Description |
|---|---|
| `index.html` | Main application page and script loading |
| `style.css` | Application layout, styling, and responsive design |
| `app.js` | Main dashboard functionality and user interactions |
| `indicators.js` | Health indicator definitions and reference ranges |
| `seedData.js` | Simulated astronaut health data |
| `rules.js` | Health status evaluation, scoring, and trend logic |
| `symptoms.js` | Symptom analysis functionality |
| `charts.js` | Health data charts and visualizations |
| `healthFeatures.js` | Additional health-related functionality |

## Technologies Used

- HTML
- CSS
- JavaScript
- Chart.js
- LocalStorage
- GitHub and GitHub Pages

## Data and Sources

Mission Health uses simulated astronaut health readings for demonstration purposes. No real astronaut medical records or personal health information are used by the application.

Research for the project was supported by publicly available information on spaceflight health risks and human physiology. The following resources provide background information and opportunities for further research.

**Spaceflight Health Research**

- [NASA Human Research Program: Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards)
- [Overview of Spaceflight Hazards and Health Risks](https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687/)
- [Canadian Space Agency Open Data Portal](https://donnees-data.asc-csa.gc.ca/dataset/)
- [NASA Life Sciences Portal](https://nlsp.nasa.gov/)
- [NASA Open Science Data Repository](https://science.nasa.gov/biological-physical/data/osdr/)

**Open Data and APIs**

- [Government of Canada: Canadian Space Agency Datasets](https://search.open.canada.ca/opendata/?owner_org=csa-asc)
- [NASA APIs](https://api.nasa.gov/)

These resources were selected to support the project's research and provide possible directions for future development. They are not currently connected to the application's data pipeline.

The health reference ranges used in the application are simplified examples intended for demonstration. They are not official NASA medical thresholds and have not been clinically validated. The ranges and evaluation rules are defined in the project source code.

## Limitations and Future Development

Mission Health is a software prototype designed to demonstrate how astronaut health information could be collected, evaluated, and communicated during a space mission.

The current version uses simulated data rather than readings from physical sensors or medical devices. Health reference ranges are simplified and do not account for individual medical histories or personalized baselines. The scoring system, alerts, and recommendations have not been clinically validated and are not intended to replace professional medical assessment.

The application can generate health summaries for review, but it does not currently communicate with NASA, the Canadian Space Agency, or mission control systems. It also does not directly retrieve data from the external research resources listed above.

Future development could include wearable sensor integration, personalized health baselines, improved anomaly detection, and further analysis of publicly available spaceflight research datasets. Additional work could also explore AI-assisted pattern recognition and communication systems designed to account for the delays associated with deep-space missions.

## AI Assistance

AI tools, including ChatGPT and Claude, were used to assist with brainstorming, coding, debugging, and documentation. All outputs were reviewed and adapted by the team.

## Team

- **Bilal Talukder (Project Lead & Lead Software Developer):** Led overall project development, system architecture, front-end implementation, feature integration, dashboard development, application functionality, and GitHub coordination.
- **Ali Faour (Health Logic & Data Development):** Developed core health evaluation logic, indicator definitions, simulated astronaut datasets, and contributed to project planning and system design.
- **Lily Marcarian (Health Features & Validation):** Developed symptom analysis and additional health functionality, reviewed implementation details, and contributed to testing and verification.
- **Ramzi Hassoun (Debugging & Documentation):** Assisted with debugging, troubleshooting, and project documentation, including contributions to the README.
- **Anderson Truong (Debugging & Team Support):** Assisted with debugging, problem-solving, development feedback, and overall team collaboration.

## License

This project is licensed under the MIT License. 
See the [LICENSE](LICENSE) file for details.