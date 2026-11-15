# space apps health monitoring
NASA Space Apps Challenge 2026 – Astronaut Health Monitoring Software


# Mission Health

**A self-assessment dashboard that helps astronauts track their health on long missions.**

Built for the NASA Space Apps Challenge 2026 (Nov 14-15), challenge: *Create Health Monitoring Software for Astronauts on Space Missions*.

- **Live demo:** PASTE-YOUR-LIVE-LINK-HERE
- **Demo video:** PASTE-YOUR-VIDEO-LINK-HERE
- **Team:** PASTE-TEAM-NAME-HERE (six members)

> **Prototype for education. Not medical advice.** Mission Health does not diagnose or treat anything. The ranges and guidance are simplified examples and have not been clinically validated.

![Screenshot of the Mission Health dashboard](screenshot.png)
<!-- Take a screenshot of your dashboard, save it as screenshot.png in this folder, and it will show here. -->

---

## The problem

On long missions to the Moon and Mars, astronauts are exposed to space radiation, isolation and confinement, distance from Earth, altered gravity, and hostile closed environments. NASA's Human Research Program calls these the five hazards of human spaceflight. They can lead to immune changes, bone and muscle loss, cardiovascular problems and behavioral health issues.

With communication delays of up to about 20 minutes each way on a Mars mission, astronauts will need to spot changes in their own health and act on them before help from the ground can respond.

## What Mission Health does

Mission Health turns daily health readings into a color-coded status, trend warnings and plain-language next steps.

<!-- Delete any line below that you did not finish before submitting. -->

- **Daily readings** for eight indicators: resting heart rate, blood pressure (top and bottom numbers), fasting blood glucose, body temperature, sleep, mood and exercise.
- **Green, yellow and red status** for each indicator, so a problem is visible at a glance.
- **Mission Health score** from 0 to 100 that summarizes the day.
- **Trend alerts** that catch slow changes before any single reading turns critical, for example sleep under 6 hours for 3 nights in a row, or mood rated 2 or lower for 3 days in a row.
- **Guidance for each indicator:** how to measure it, why spaceflight affects it, what to do, and when to contact the flight surgeon.
- **Demo astronaut** with 21 days of simulated readings, so you can watch the app catch a problem as it develops.

## How the health rules work

Each indicator has a green range and a yellow range. Anything outside both is red. A value counts as inside a range when `min <= value < max`, so ranges meet with no gaps.

The exercise target is a placeholder and should be replaced with an official NASA figure. The overall score starts at 100 and subtracts 5 for each yellow indicator and 12 for each red one.

## How to run it

There is nothing to install.

1. Download or clone this repository.
2. Open the folder in [VS Code](https://code.visualstudio.com/) and install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

You can also double-click `index.html` to open it in any modern browser.

To check the health logic, open the page, press F12, click the **Console** tab and type `runRulesSelfTest()`. Every line should start with `OK`.

## Project structure

| File | What it does |
| --- | --- |
| `index.html` | The page layout |
| `style.css` | Colors and styling |
| `app.js` | Draws the page and handles clicks and the check-in form |
| `indicators.js` | The health indicators, their ranges and their guidance text |
| `rules.js` | Decides green, yellow or red, calculates the score and finds trend alerts |
| `seedData.js` | 21 days of simulated readings for the demo astronaut |

The scripts load in this order: `indicators.js`, `seedData.js`, `rules.js`, `app.js`.

## Technology

Plain HTML, CSS and JavaScript, with no framework and no server. Everything runs in the browser, so the app needs no internet connection once loaded.

<!-- If you used Chart.js for the trend charts, keep this line: -->
- [Chart.js](https://www.chartjs.org/) for trend charts

## Data and sources

All readings in the demo are **simulated**. No real person's health data is used.

Background on spaceflight hazards comes from:

- [NASA Human Research Program: Five Hazards of Human Spaceflight](https://www.nasa.gov/hrp/hazards)
- [Overview of spaceflight hazards and health risks, PubMed Central (PMC7645687)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7645687)

The reference ranges are general adult values chosen as a starting point. Each indicator's `source` field in `indicators.js` is where its citation belongs.

## Use of AI tools

We used Claude (by Anthropic) to help plan the project, structure the code, and draft the starter files and this README. The team reviewed, tested and adapted the output.
<!-- Edit this paragraph to describe exactly how your team used AI. Space Apps asks teams to disclose it. -->

## Limitations and next steps

- Ranges and guidance have not been reviewed by a medical professional and are not tuned to an individual astronaut's baseline.
- Readings are typed in by hand. A real system would connect to wearable sensors and onboard medical devices.
- Possible next steps: a deep-space mode that handles communication delays by queuing messages to the ground, personal baselines instead of fixed ranges, a clickable body figure linked to the five hazards, and streaks and badges to encourage daily check-ins.

## Team

<!-- Add one line per person: name, role. -->
- NAME, role
- NAME, role
- NAME, role
- NAME, role
- NAME, role
- NAME, role

## License

PASTE-A-LICENSE-HERE (for example MIT).