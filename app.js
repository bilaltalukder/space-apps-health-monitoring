
// ==========================================
// MISSION HEALTH - DASHBOARD APPLICATION
// ==========================================

// Temporary simulated astronaut readings
const demoReadings = {
    heartRate: 72,
    bloodPressure: 118,
    glucose: 92,
    temperature: 36.8,
    sleep: 7.5,
    mood: 5,
    exercise: 120
};

// Find the dashboard section in our HTML
const dashboard = document.getElementById("dashboard");

// Display the astronaut's health readings
function renderDashboard() {

    const cards = Object.entries(demoReadings).map(([key, value]) => {

        const indicator = indicators[key];
        const status = getStatus(key, value);

        return `
            <article class="indicator-card ${status}">
                <div class="card-top">
                    <h3>${indicator.name}</h3>
                    <span class="status-pill">${status.toUpperCase()}</span>
                </div>

                <p class="reading">
                    ${value}
                    <span>${indicator.unit}</span>
                </p>
            </article>
        `;
    }).join("");

    dashboard.innerHTML = `
        <div class="dashboard-heading">
            <div>
                <p class="eyebrow">FLIGHT STATUS / SIMULATION</p>
                <h2>Mission Overview</h2>
                <p>Live health telemetry for astronaut Alex Morgan</p>
            </div>

            <div class="mission-status">
                <span class="status-dot"></span>
                SYSTEM ONLINE
            </div>
        </div>

        <div class="summary-grid">
            ${cards}
        </div>
    `;
}

// Run the dashboard
renderDashboard();
