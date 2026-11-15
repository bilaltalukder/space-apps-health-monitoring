
// ==========================================
// MISSION HEALTH - DASHBOARD APPLICATION
// ==========================================

// Check that all required files have loaded.
if (
    typeof indicators === "undefined" ||
    typeof seedData === "undefined" ||
    typeof getDayStatuses === "undefined" ||
    typeof getOverallScore === "undefined"
) {
    throw new Error("Mission Health: Required project files have not loaded.");
}

const dashboard = document.getElementById("dashboard");

// Use the latest day in our 21-day astronaut simulation.
const STORAGE_KEY = "missionHealthCheckins";

let savedCheckins = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

let history = [...seedData, ...savedCheckins];

let currentDay = history[history.length - 1];
let historyPage = 0;
const HISTORY_PAGE_SIZE = 10;

// ------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------

function getWorstMeasurementStatus(dayData) {
    const statuses = getDayStatuses(dayData);
    return worstStatus(Object.values(statuses));
}
function submitDailyCheckin(event) {
    event.preventDefault();

    const fields = [
        "heartRate",
        "systolic",
        "diastolic",
        "glucose",
        "temperature",
        "sleep",
        "mood",
        "exercise"
    ];

    const newCheckin = {
        day: currentDay.day + 1
    };

    for (const field of fields) {
        const input = document.getElementById(`checkin-${field}`);
        newCheckin[field] = Number(input.value);
    }

    if (newCheckin.systolic <= newCheckin.diastolic) {
        document.getElementById("checkin-message").textContent =
            "Please check your blood pressure values.";
        return;
    }

    history.push(newCheckin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(seedData.length)));

    currentDay = newCheckin;

    renderDashboard();
}

function formatReading(value) {
    return Number.isInteger(value) ? value : value.toFixed(1);
}

// ------------------------------------------
// RENDER HEALTH INDICATOR CARDS
// ------------------------------------------

function renderIndicatorCards() {
    return indicators.map(indicator => {
        const value = currentDay[indicator.id];
        const status = getStatus(indicator, value);

        return `
            <article
                class="indicator-card ${status}"
                data-indicator-id="${indicator.id}"
                role="button"
                tabindex="0"
                aria-label="View details for ${indicator.name}"
>
                <div class="card-top">
                    <h3>${indicator.name}</h3>
                    <span class="status-pill">
                        ${status.toUpperCase()}
                    </span>
                </div>

                <p class="reading">
                    ${formatReading(value)}
                    <span>${indicator.unit}</span>
                </p>
            </article>
        `;
    }).join("");
}

// ------------------------------------------
// RENDER TREND ALERTS
// ------------------------------------------

function renderTrendAlerts() {
    const existingAlerts = getTrendAlerts(history).map(alert => ({
        title: alert.indicatorId.toUpperCase(),
        message: alert.message
    }));

    const additionalAlerts = window.MissionHealthFeatures
        ? MissionHealthFeatures.detectTrendAlerts(history)
            .filter(alert => alert.id === "decliningMood")
            .map(alert => ({
                title: alert.title,
                message: alert.message
            }))
        : [];

    const alerts = [...existingAlerts, ...additionalAlerts];

    if (alerts.length === 0) {
        return `
            <div class="alert-item green">
                No active trend alerts detected.
            </div>
        `;
    }

    return alerts.map(alert => `
        <div class="alert-item yellow">
            <strong>${alert.title}</strong>
            <p>${alert.message}</p>
        </div>
    `).join("");
}

// ------------------------------------------
// RENDER CHECK-IN HISTORY
// ------------------------------------------

function renderCheckinHistory() {
    const totalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);

    const start = historyPage * HISTORY_PAGE_SIZE;
    const pageHistory = history
        .slice()
        .reverse()
        .slice(start, start + HISTORY_PAGE_SIZE);

    const entries = pageHistory.map(day => {
        const score = getOverallScore(day);
        const status = getWorstMeasurementStatus(day);

        return `
            <details class="history-card">
                <summary class="history-card-header">
                    <h3>Simulation Day ${day.day}</h3>

                    <span class="status-pill status-${status}">
                        ${status.toUpperCase()}
                    </span>

                    <span class="history-expand-hint">
                        View details +
                    </span>
                </summary>

                <div class="history-card-details">
                    <p>Mission Health Score: <strong>${score}/100</strong></p>

                    <p>
                        Heart Rate: ${formatReading(day.heartRate)} bpm |
                        Blood Pressure: ${day.systolic}/${day.diastolic} mmHg
                    </p>

                    <p>
                        Glucose: ${formatReading(day.glucose)} mg/dL |
                        Temperature: ${formatReading(day.temperature)} °C
                    </p>

                    <p>
                        Sleep: ${formatReading(day.sleep)} hours |
                        Mood: ${day.mood}/5 |
                        Exercise: ${day.exercise} minutes
                    </p>
                </div>
            </details>
        `;
    }).join("");

    return `
        ${entries}

        <div class="history-pagination">
            <p>
                Showing ${history.length - start - pageHistory.length + 1}
                –${history.length - start} of ${history.length} days
            </p>

            <button id="history-previous" ${historyPage === 0 ? "disabled" : ""}>
                PREVIOUS
            </button>

            <span>Page ${historyPage + 1} of ${totalPages}</span>

            <button id="history-next" ${historyPage >= totalPages - 1 ? "disabled" : ""}>
                NEXT
            </button>
        </div>
    `;
}

// ------------------------------------------
// SYMPTOM CHECK-IN
// ------------------------------------------

function analyzeDailySymptoms() {
    const notesInput = document.getElementById("symptom-notes");
    const resultsContainer = document.getElementById("symptom-results");

    const notes = notesInput.value.trim();

    if (!notes) {
        resultsContainer.innerHTML = `
            <p>Please enter some symptoms or daily notes first.</p>
        `;
        return;
    }

    const result = window.MissionSymptoms.analyzeSymptoms(notes);

    const combinedStatus = window.MissionSymptoms.combineHealthStatus(
        getWorstMeasurementStatus(currentDay),
        result.severity
    );

    if (!result.hasSymptoms) {
        resultsContainer.innerHTML = `
            <div class="symptom-result green">
                <h3>No recognized symptoms detected</h3>
                <p>
                    No matching symptoms were found in these notes.
                    This does not rule out a health concern.
                </p>
            </div>
        `;
        return;
    }

    const symptomCards = result.symptoms.map(symptom => `
        <div class="symptom-result ${symptom.severity}">
            <h3>${symptom.name}</h3>
            <p>${symptom.advice}</p>
            <p>
                <strong>Related indicators:</strong>
                ${symptom.indicators.join(", ")}
            </p>
        </div>
    `).join("");

    resultsContainer.innerHTML = `
        <div class="symptom-summary ${result.severity}">
            <h3>
                ${result.symptoms.length} symptom(s) detected
            </h3>
            <p>
                Symptom severity: ${result.severity.toUpperCase()}
            </p>
            <p>
                Combined health status: ${combinedStatus.toUpperCase()}
            </p>
            <p>
                <strong>Affected body regions:</strong>
                ${result.affectedBodyParts.join(", ")}
            </p>
        </div>

        ${symptomCards}

        ${result.requiresMedicalContact ? `
            <div class="symptom-result red">
                <strong>Medical contact recommended immediately.</strong>
                <p>Contact the flight medical team.</p>
            </div>
        ` : ""}

        <p class="disclaimer">${result.disclaimer}</p>
    `;
}


function generateGroundReport() {
    const statuses = getDayStatuses(currentDay);

    const flaggedIndicators = indicators.filter(indicator =>
        statuses[indicator.id] === "yellow" ||
        statuses[indicator.id] === "red"
    );

    const trendAlerts = getTrendAlerts(history);

    const reportLines = [
        "MISSION HEALTH REPORT",
        "NASA SPACE APPS - ASTRONAUT HEALTH MONITOR",
        "------------------------------------------",
        "Astronaut: Alex Morgan",
        `Simulation Day: ${currentDay.day} of ${history.length}`,
        `Mission Health Score: ${getOverallScore(currentDay)}/100`,
        `Overall Status: ${getWorstMeasurementStatus(currentDay).toUpperCase()}`,
        "",
        "FLAGGED HEALTH INDICATORS",
        "------------------------------------------"
    ];

    if (flaggedIndicators.length === 0) {
        reportLines.push("No yellow or red indicators detected.");
    } else {
        flaggedIndicators.forEach(indicator => {
            const value = currentDay[indicator.id];
            const status = statuses[indicator.id].toUpperCase();

            reportLines.push(
                `${indicator.name}: ${formatReading(value)} ${indicator.unit} — ${status}`
            );
        });
    }

    reportLines.push(
        "",
        "TREND ALERTS",
        "------------------------------------------"
    );

    if (trendAlerts.length === 0) {
        reportLines.push("No active trend alerts.");
    } else {
        trendAlerts.forEach(alert => {
            reportLines.push(`- ${alert.message}`);
        });
    }

    reportLines.push(
        "",
        "Educational prototype only. Not medical advice.",
        "This report contains simulated astronaut data."
    );

    const report = reportLines.join("\n");

    const output = document.getElementById("ground-report-output");
    output.innerHTML = "";

    const reportDisplay = document.createElement("pre");
    reportDisplay.textContent = report;

    const copyButton = document.createElement("button");
    copyButton.textContent = "COPY REPORT";

    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(report);
            copyButton.textContent = "COPIED!";
        } catch (error) {
            copyButton.textContent = "COPY FAILED";
        }
    });

    output.appendChild(reportDisplay);
    output.appendChild(copyButton);
}


function renderCheckinForm() {
    return `
        <section class="daily-checkin-section">
            <p class="eyebrow">DAILY CREW REPORT</p>
            <h2>Daily Health Check-in</h2>
            <p>Enter the astronaut's latest health measurements.</p>

            <form id="daily-checkin-form">
                <div class="checkin-grid">

                    <div class="checkin-field">
                        <label for="checkin-heartRate">Resting Heart Rate (bpm)</label>
                        <input id="checkin-heartRate" type="number" min="1" max="250" step="1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-systolic">Systolic Blood Pressure (mmHg)</label>
                        <input id="checkin-systolic" type="number" min="1" max="300" step="1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-diastolic">Diastolic Blood Pressure (mmHg)</label>
                        <input id="checkin-diastolic" type="number" min="1" max="200" step="1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-glucose">Fasting Blood Glucose (mg/dL)</label>
                        <input id="checkin-glucose" type="number" min="1" max="600" step="1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-temperature">Body Temperature (°C)</label>
                        <input id="checkin-temperature" type="number" min="25" max="45" step="0.1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-sleep">Sleep (hours)</label>
                        <input id="checkin-sleep" type="number" min="0" max="24" step="0.1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-mood">Mood (1–5)</label>
                        <input id="checkin-mood" type="number" min="1" max="5" step="1" required>
                    </div>

                    <div class="checkin-field">
                        <label for="checkin-exercise">Exercise (minutes)</label>
                        <input id="checkin-exercise" type="number" min="0" max="1440" step="1" required>
                    </div>

                </div>

                <button type="submit" class="checkin-submit">
                    SUBMIT CHECK-IN
                </button>

                <div id="checkin-message" aria-live="polite"></div>
            </form>
        </section>
    `;
}

// ------------------------------------------
// MAIN DASHBOARD
// ------------------------------------------

function renderDashboard() {
    const score = getOverallScore(currentDay);
    const measurementStatus = getWorstMeasurementStatus(currentDay);

    dashboard.innerHTML = `
        <div class="dashboard-heading">
            <div>
                <p class="eyebrow">FLIGHT STATUS / SIMULATION</p>
                <h2>Mission Overview</h2>
                <p>Live health telemetry for astronaut Alex Morgan</p>
                <p>Simulation Day ${currentDay.day} of ${history.length}</p>
            </div>

            <div class="mission-status">
                <span class="status-dot"></span>
                SYSTEM ONLINE
            </div>
        </div>

        <section class="health-score">
            <p class="eyebrow">MISSION HEALTH SCORE</p>
            <h2>${score}<span>/100</span></h2>
            <p>
                Measurement status:
                <strong>${measurementStatus.toUpperCase()}</strong>
            </p>
            <p>
                Prototype score based on indicator readings.
                It is not a medical assessment.
            </p>
                </section>

        <section class="ground-report-section">
            <p class="eyebrow">MISSION COMMUNICATIONS</p>
            <h2>Share with Ground</h2>
            <p>
                Generate a health status report for the ground medical team.
            </p>

            <button id="generate-ground-report">
                GENERATE REPORT
            </button>

            <div id="ground-report-output" aria-live="polite"></div>
        </section>

        <section class="indicators-section">
            <p class="eyebrow">ASTRONAUT BIOMETRICS</p>
            <h2>Health Indicators</h2>
            <div class="summary-grid">
                ${renderIndicatorCards()}
            </div>

            <div id="indicator-detail-container"></div>
        </section>

        <section class="trends-section">
            <p class="eyebrow">PATTERN DETECTION</p>
            <h2>Trend Alerts</h2>
            <div class="alerts-list">
                ${renderTrendAlerts()}
            </div>
        </section>

                <section class="history-section">
            <p class="eyebrow">MISSION RECORDS</p>
            <h2>Check-in History</h2>
            <p>Review previous astronaut health check-ins.</p>

            <div id="checkin-history-list">
            ${renderCheckinHistory()}
            </div>
        </section>

                
          
        <section class="body-map-section">
            <p class="eyebrow">CREW HEALTH OVERVIEW</p>
            <h2>Astronaut Body Map</h2>
            <p>
                Select a body region to explore its connected
                health indicators.
            </p>

            <div class="body-map-layout">

                <div class="body-map body-map-figure">

                    <svg viewBox="0 0 300 560"
                         xmlns="http://www.w3.org/2000/svg"
                         class="astronaut-silhouette"
                         role="img"
                         aria-label="Front view of an astronaut wearing a detailed spacesuit">

                        <defs>
                            <linearGradient id="suit" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#f4f7fb"/>
                                <stop offset="50%" stop-color="#aab9cc"/>
                                <stop offset="100%" stop-color="#657b96"/>
                            </linearGradient>

                            <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stop-color="#55d9ed"/>
                                <stop offset="45%" stop-color="#183b59"/>
                                <stop offset="100%" stop-color="#101827"/>
                            </linearGradient>
                        </defs>

                        <!-- Helmet -->
                        <circle cx="150" cy="65" r="49"
                                fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Visor -->
                        <ellipse cx="150" cy="65" rx="37" ry="34"
                                 fill="url(#visor)" stroke="#d8e7f5" stroke-width="3"/>

                        <path d="M123 53 Q145 30 170 48"
                              fill="none" stroke="#ffffff" stroke-width="3" opacity=".45"/>

                        <!-- Neck ring -->
                        <rect x="119" y="108" width="62" height="19" rx="7"
                              fill="#667d97" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Backpack -->
                        <rect x="75" y="145" width="150" height="170" rx="22"
                              fill="#536b85" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Torso -->
                        <path d="M105 128 Q150 115 195 128
                                 L215 280 Q150 300 85 280 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Chest control panel -->
                        <rect x="119" y="155" width="62" height="65" rx="9"
                              fill="#263b58" stroke="#55d9ed" stroke-width="3"/>

                        <circle cx="139" cy="175" r="7" fill="#55d9ed"/>
                        <circle cx="161" cy="175" r="7" fill="#f4c45d"/>
                        <rect x="131" y="192" width="38" height="5" rx="2" fill="#a9eaf2"/>

                        <!-- Shoulder joints -->
                        <circle cx="101" cy="145" r="19"
                                fill="#d4deea" stroke="#55d9ed" stroke-width="3"/>
                        <circle cx="199" cy="145" r="19"
                                fill="#d4deea" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Arms -->
                        <path d="M91 153 L67 174 L42 290 L65 300
                                 L101 220 L117 166 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <path d="M209 153 L233 174 L258 290 L235 300
                                 L199 220 L183 166 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Arm joints -->
                        <rect x="49" y="225" width="25" height="22" rx="6"
                              fill="#607891" stroke="#55d9ed" stroke-width="2"/>
                        <rect x="226" y="225" width="25" height="22" rx="6"
                              fill="#607891" stroke="#55d9ed" stroke-width="2"/>

                        <!-- Gloves -->
                        <path d="M42 285 Q27 290 31 313 L61 318 L70 297 Z"
                              fill="#dce5ef" stroke="#55d9ed" stroke-width="3"/>
                        <path d="M258 285 Q273 290 269 313 L239 318 L230 297 Z"
                              fill="#dce5ef" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Waist ring -->
                        <path d="M87 275 Q150 295 213 275
                                 L210 315 Q150 333 90 315 Z"
                              fill="#71859d" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Lower torso -->
                        <path d="M94 315 L206 315 L195 350 L105 350 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Left leg -->
                        <path d="M105 345 L145 350 L137 490
                                 L101 490 L88 365 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Right leg -->
                        <path d="M155 350 L195 345 L212 365
                                 L199 490 L163 490 Z"
                              fill="url(#suit)" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Knee joints -->
                        <rect x="99" y="410" width="40" height="20" rx="7"
                              fill="#647c95" stroke="#55d9ed" stroke-width="2"/>
                        <rect x="161" y="410" width="40" height="20" rx="7"
                              fill="#647c95" stroke="#55d9ed" stroke-width="2"/>

                        <!-- Boots -->
                        <path d="M101 480 L137 480 L143 520 L85 520 Z"
                              fill="#647c95" stroke="#55d9ed" stroke-width="3"/>
                        <path d="M163 480 L199 480 L215 520 L157 520 Z"
                              fill="#647c95" stroke="#55d9ed" stroke-width="3"/>

                        <!-- Health region highlights -->
                        <circle cx="150" cy="190" r="27"
                                fill="#55d9ed" opacity=".16"/>
                        <ellipse cx="150" cy="270" rx="32" ry="20"
                                 fill="#f4c45d" opacity=".22"/>

                    </svg>

                    <button class="body-region body-region-head"
                            data-region="head">Head</button>

                    <button class="body-region body-region-chest"
                            data-region="chest">Chest</button>

                    <button class="body-region body-region-abdomen"
                            data-region="abdomen">Abdomen</button>

                    <button class="body-region body-region-muscles"
                            data-region="muscles">Muscles</button>

                    <button class="body-region body-region-bones"
                            data-region="bones">Bones</button>

                </div>

                <div id="body-map-details">
                    <p>Select a region to see connected indicators.</p>
                </div>

            </div>
        </section>


        ${renderCheckinForm()}

        <section class="symptoms-section">
            <p class="eyebrow">CREW HEALTH CHECK-IN</p>
            <h2>Symptom Detection</h2>
            <p>
                Describe how the astronaut is feeling.
                The system will identify recognized symptoms
                and connect them to relevant health indicators.
            </p>

            <textarea
                id="symptom-notes"
                rows="4"
                placeholder="Example: I've been feeling dizzy and have had a headache..."
            ></textarea>

            <button id="analyze-symptoms">
                Analyze Symptoms
            </button>

            <div id="symptom-results" aria-live="polite"></div>
        </section>

        <p class="disclaimer">
            Educational prototype only. Not medical advice.
            Simulated readings do not represent real astronaut data.
        </p>

        <section class="trends-section">
    <div class="dashboard-heading">
        <div>
            <p class="eyebrow">MISSION HEALTH ANALYTICS</p>
            <h2>Health Trends</h2>
            <p>Track changes across the last 14 days of your mission.</p>
        </div>
    </div>

    <div class="charts-grid">
        <div class="chart-card">
            <h3>Heart Rate</h3>
            <div class="chart-container"><canvas id="heartRateChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Systolic Blood Pressure</h3>
            <div class="chart-container"><canvas id="systolicChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Diastolic Blood Pressure</h3>
            <div class="chart-container"><canvas id="diastolicChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Blood Glucose</h3>
            <div class="chart-container"><canvas id="glucoseChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Body Temperature</h3>
            <div class="chart-container"><canvas id="temperatureChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Sleep</h3>
            <div class="chart-container"><canvas id="sleepChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Mood</h3>
            <div class="chart-container"><canvas id="moodChart"></canvas></div>
        </div>

        <div class="chart-card">
            <h3>Exercise</h3>
            <div class="chart-container"><canvas id="exerciseChart"></canvas></div>
        </div>
    </div>
    </section>

    `;

// Allow users to open detailed information for each indicator.
document.querySelectorAll("[data-indicator-id]").forEach(card => {
    card.addEventListener("click", () => {
        const id = card.dataset.indicatorId;
        const container = document.getElementById("indicator-detail-container");

        const detail = MissionHealthFeatures.createIndicatorDetail(id);

        if (!detail || !container) return;

        container.innerHTML = "";
        container.appendChild(detail);

        container.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
});

// Generate Ground Report button
const generateReportButton = document.getElementById("generate-ground-report");

generateReportButton.addEventListener("click", generateGroundReport);

// Check-in history pagination
const previousHistoryButton = document.getElementById("history-previous");
const nextHistoryButton = document.getElementById("history-next");

previousHistoryButton.addEventListener("click", () => {
    if (historyPage > 0) {
        historyPage--;
        renderDashboard();
    }
});

nextHistoryButton.addEventListener("click", () => {
    const totalPages = Math.ceil(history.length / HISTORY_PAGE_SIZE);

    if (historyPage < totalPages - 1) {
        historyPage++;
        renderDashboard();
    }
});

// Connect body-map regions to their health indicators.
document.querySelectorAll(".body-region").forEach(button => {
    button.addEventListener("click", () => {
        const region = button.dataset.region;
        const container = document.getElementById("body-map-details");

        document.querySelectorAll(".body-region").forEach(item => {
    item.classList.remove("active");
      });

button.classList.add("active"); 

        const indicatorIds =
            MissionHealthFeatures.getIndicatorsForRegion(region);

        container.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent =
            region.charAt(0).toUpperCase() + region.slice(1);

        container.appendChild(heading);

        indicatorIds.forEach(id => {
            const indicator = indicators.find(item => item.id === id);

            if (!indicator) return;

            const value = MissionHealthFeatures.getReading(currentDay, id);
            const status = getStatus(indicator, value);

            const item = document.createElement("p");

            const displayValue =
            value === undefined || value === null
            ? "No reading"
            : `${value} ${indicator.unit}`;

item.textContent =
    `${indicator.name}: ${displayValue} — ${status.toUpperCase()}`;

container.appendChild(item);
        });
    });
});

    // Render the eight health trend charts.
    renderMissionCharts(history);

    document
        .getElementById("analyze-symptoms")
        .addEventListener("click", analyzeDailySymptoms);

    document
    .getElementById("daily-checkin-form")
    .addEventListener("submit", submitDailyCheckin);
}

// ------------------------------------------
// START APPLICATION
// ------------------------------------------

if (!window.MissionSymptoms) {
    throw new Error("Mission Health: symptoms.js has not loaded.");
}

renderDashboard();
