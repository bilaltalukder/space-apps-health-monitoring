
/*
  MISSION HEALTH
  Steps 8, 9, and 10

  Indicator details, trend alerts, and body-map connections.
  Educational prototype — not medical advice.
*/

(function () {
    "use strict";

    // ==========================================
    // STEP 10 - BODY MAP CONNECTIONS
    // ==========================================

    const INDICATOR_REGIONS = {
        heartRate: ["heart", "chest"],
        systolic: ["heart", "chest"],
        diastolic: ["heart", "chest"],
        glucose: ["abdomen", "wholeBody"],
        temperature: ["wholeBody"],
        sleep: ["head", "wholeBody"],
        mood: ["head"],
        exercise: ["muscles", "bones"]
    };

    const REGION_INDICATORS = {
        head: ["sleep", "mood", "systolic", "diastolic"],
        eyes: ["systolic", "diastolic"],
        heart: ["heartRate", "systolic", "diastolic"],
        chest: ["heartRate", "systolic", "diastolic"],
        abdomen: ["glucose"],
        muscles: ["exercise"],
        bones: ["exercise"],
        wholeBody: [
            "temperature",
            "sleep",
            "glucose",
            "exercise",
            "mood"
        ]
    };


    // ==========================================
    // STEP 8 - INDICATOR DETAILS
    // Uses existing indicators.js definitions.
    // ==========================================

    function getIndicatorDetails(id) {

        if (
            typeof indicators === "undefined" ||
            !Array.isArray(indicators)
        ) {
            console.error("Mission Health: indicators.js not loaded.");
            return null;
        }

        const indicator = indicators.find(item => item.id === id);

        if (!indicator) return null;

        return {
            ...indicator,
            disclaimer: "Educational prototype. Not medical advice."
        };
    }


    function createIndicatorDetail(id) {

        const data = getIndicatorDetails(id);

        if (!data) return null;

        const panel = document.createElement("section");
        panel.className = "mission-indicator-detail";

        const heading = document.createElement("h2");
        heading.textContent = data.name;
        panel.appendChild(heading);

        const description = document.createElement("p");
        description.textContent = data.description || "";
        panel.appendChild(description);

        const sections = [
            ["Why does this matter in space?", data.why],
            ["How do you measure it?", data.howToMeasure]
        ];

        sections.forEach(([title, content]) => {

            if (!content) return;

            const h3 = document.createElement("h3");
            h3.textContent = title;

            const p = document.createElement("p");
            p.textContent = content;

            panel.append(h3, p);
        });

        // Display prototype reference ranges.

        const rangesHeading = document.createElement("h3");
        rangesHeading.textContent = "Monitoring ranges";
        panel.appendChild(rangesHeading);

        const ranges = document.createElement("p");

        ranges.textContent =
            "Green: " + JSON.stringify(data.green || []) +
            " | Yellow: " + JSON.stringify(data.yellow || []);

        panel.appendChild(ranges);

        // Display recommended guidance.

        if (data.guidance) {

            const guidanceHeading = document.createElement("h3");
            guidanceHeading.textContent = "Recommended guidance";
            panel.appendChild(guidanceHeading);

            ["green", "yellow", "red"].forEach(level => {

                if (!data.guidance[level]) return;

                const h4 = document.createElement("h4");
                h4.textContent =
                    level.charAt(0).toUpperCase() + level.slice(1);

                const p = document.createElement("p");
                p.textContent = data.guidance[level];

                panel.append(h4, p);
            });
        }

        // Display reference information.

        [
            ["NASA research source", data.source],
            ["Clinical reference", data.clinicalSource]
        ].forEach(([label, url]) => {

            if (!url) return;

            const link = document.createElement("a");
            link.href = url;
            link.textContent = label;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            panel.appendChild(link);
        });

        const disclaimer = document.createElement("p");
        disclaimer.className = "medical-disclaimer";
        disclaimer.textContent = data.disclaimer;

        panel.appendChild(disclaimer);

        return panel;
    }


    // ==========================================
    // STEP 9 - TREND ALERT DETECTION
    // ==========================================

    function getReading(day, id) {

        const value = day?.readings?.[id] ?? day?.[id];

        const number = Number(value);

        return value == null ||
            value === "" ||
            !Number.isFinite(number)
            ? null
            : number;
    }


    function detectTrendAlerts(history) {

        if (!Array.isArray(history)) return [];

        const alerts = [];

        // Three consecutive days of insufficient sleep.

        const sleep = history
            .slice(-3)
            .map(day => getReading(day, "sleep"));

        if (
            sleep.length === 3 &&
            sleep.every(value => value !== null && value < 6)
        ) {
            alerts.push({
                id: "poorSleep",
                severity: "yellow",
                title: "Repeated insufficient sleep",
                message:
                    "Sleep has been below 6 hours for three consecutive recorded days.",
                indicators: ["sleep"],
                bodyParts: ["head", "wholeBody"]
            });
        }

        // Three consecutive declining mood readings.

        const mood = history
            .slice(-3)
            .map(day => getReading(day, "mood"));

        if (
            mood.length === 3 &&
            mood.every(value => value !== null) &&
            mood[0] > mood[1] &&
            mood[1] > mood[2]
        ) {
            alerts.push({
                id: "decliningMood",
                severity: "yellow",
                title: "Declining mood trend",
                message:
                    "Mood ratings have decreased across three consecutive recorded days.",
                indicators: ["mood"],
                bodyParts: ["head"]
            });
        }

        return alerts;
    }


    // Display detected alerts inside a supplied container.

    function renderTrendAlerts(container, history) {

        if (!container) return [];

        const alerts = detectTrendAlerts(history);

        container.innerHTML = "";

        alerts.forEach(alert => {

            const card = document.createElement("div");
            card.className = "trend-alert";

            const heading = document.createElement("h3");
            heading.textContent = alert.title;

            const message = document.createElement("p");
            message.textContent = alert.message;

            card.append(heading, message);
            container.appendChild(card);
        });

        if (alerts.length === 0) {

            const message = document.createElement("p");
            message.textContent = "No active trend alerts detected.";

            container.appendChild(message);
        }

        return alerts;
    }


    // ==========================================
    // STEP 10 - BODY MAP LOOKUP FUNCTIONS
    // ==========================================

    function getIndicatorsForRegion(region) {
        return [...(REGION_INDICATORS[region] || [])];
    }


    function getRegionsForIndicator(id) {
        return [...(INDICATOR_REGIONS[id] || [])];
    }


    // ==========================================
    // PUBLIC APPLICATION INTERFACE
    // ==========================================

    window.MissionHealthFeatures = {

        getIndicatorDetails,
        createIndicatorDetail,
        getReading,

        detectTrendAlerts,
        renderTrendAlerts,

        getIndicatorsForRegion,
        getRegionsForIndicator

    };

})();
