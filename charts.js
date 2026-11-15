
// ==========================================
// MISSION HEALTH - TREND CHARTS
// ==========================================

let missionCharts = {};

// Draw the healthy range behind each chart's data.
const healthyRangePlugin = {
    id: "healthyRange",

    beforeDatasetsDraw(chart, args, options) {
        const bands = options.bands || [];
        const { ctx, chartArea, scales } = chart;

        if (!chartArea || !scales.y) return;

        const yScale = scales.y;

        ctx.save();
        ctx.beginPath();
        ctx.rect(
            chartArea.left,
            chartArea.top,
            chartArea.right - chartArea.left,
            chartArea.bottom - chartArea.top
        );
        ctx.clip();

        bands.forEach(([lower, upper]) => {
            const low = Math.max(lower, yScale.min);
            const high = Math.min(
                Number.isFinite(upper) ? upper : yScale.max,
                yScale.max
            );

            if (high <= low) return;

            const top = yScale.getPixelForValue(high);
            const bottom = yScale.getPixelForValue(low);

            ctx.fillStyle = "rgba(54, 214, 154, 0.13)";
            ctx.fillRect(
                chartArea.left,
                top,
                chartArea.right - chartArea.left,
                bottom - top
            );
        });

        ctx.restore();
    }
};


function renderMissionCharts(history) {

    if (typeof Chart === "undefined") {
        console.error("Chart.js has not loaded.");
        return;
    }

    if (typeof indicators === "undefined") {
        console.error("Indicator definitions have not loaded.");
        return;
    }

    // Keep only the latest 14 days.
    const recentHistory = history.slice(-14);

    const labels = recentHistory.map(
        entry => `Day ${entry.day}`
    );

    // Remove old charts before creating new ones.
    Object.values(missionCharts).forEach(chart => {
        chart.destroy();
    });

    missionCharts = {};

    // Create one chart for every indicator.
    indicators.forEach(indicator => {

        const canvas = document.getElementById(
            `${indicator.id}Chart`
        );

        if (!canvas) {
            console.warn(`Missing chart canvas: ${indicator.id}Chart`);
            return;
        }

        const values = recentHistory.map(entry => {
            const value = Number(entry[indicator.id]);
            return Number.isFinite(value) ? value : null;
        });

        const validValues = values.filter(
            value => value !== null
        );

        if (validValues.length === 0) return;

        // Include both readings and healthy-range boundaries
        // when calculating the vertical chart scale.
        const finiteBounds = indicator.green
            .flat()
            .filter(Number.isFinite);

        const allValues = [...validValues, ...finiteBounds];

        let minValue = Math.min(...allValues);
        let maxValue = Math.max(...allValues);

        // Give unlimited upper ranges, such as exercise,
        // enough space to appear on the chart.
        indicator.green.forEach(([lower, upper]) => {
            if (!Number.isFinite(upper)) {
                maxValue = Math.max(
                    maxValue,
                    lower + Math.max(Math.abs(lower) * 0.15, 1)
                );
            }
        });

        const range = Math.max(maxValue - minValue, 1);
        const padding = range * 0.08;

        const colors = {
            heartRate: "#55d9ed",
            systolic: "#ff647c",
            diastolic: "#55d9ed",
            glucose: "#f4c45d",
            temperature: "#ff9b71",
            sleep: "#a78bfa",
            mood: "#f4c45d",
            exercise: "#36d69a"
        };

        const lineColor = colors[indicator.id] || "#55d9ed";

        missionCharts[indicator.id] = new Chart(canvas, {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: `${indicator.name} (${indicator.unit})`,
                    data: values,
                    borderColor: lineColor,
                    backgroundColor: `${lineColor}22`,
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: lineColor,
                    tension: 0.3,
                    fill: true,
                    spanGaps: false
                }]
            },

            plugins: [healthyRangePlugin],

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        labels: {
                            color: "#edf4ff",
                            font: {
                                family: "Inter",
                                size: 11
                            }
                        }
                    },

                    tooltip: {
                        backgroundColor: "#111a2b",
                        titleColor: "#edf4ff",
                        bodyColor: "#edf4ff",
                        borderColor: "#26364e",
                        borderWidth: 1
                    },

                    healthyRange: {
                        bands: indicator.green
                    }
                },

                scales: {
                    x: {
                        ticks: {
                            color: "#91a2bb",
                            maxRotation: 0
                        },
                        grid: {
                            color: "rgba(145,162,187,0.08)"
                        }
                    },

                    y: {
                        min: Math.max(0, minValue - padding),
                        max: maxValue + padding,

                        ticks: {
                            color: "#91a2bb"
                        },

                        grid: {
                            color: "rgba(145,162,187,0.08)"
                        }
                    }
                }
            }
        });
    });
}
