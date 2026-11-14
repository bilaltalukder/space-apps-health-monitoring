
// ==========================================
// MISSION HEALTH - HEALTH STATUS ENGINE
// Prototype screening rules, not medical advice
// ==========================================

const indicators = {
    heartRate: {
        name: "Resting Heart Rate",
        unit: "bpm",
        evaluate(value) {
            if (value >= 50 && value <= 90) return "green";
            if ((value >= 40 && value < 50) ||
                (value > 90 && value <= 110)) return "yellow";
            return "red";
        }
    },

    bloodPressure: {
        name: "Systolic Blood Pressure",
        unit: "mmHg",
        evaluate(value) {
            if (value < 120) return "green";
            if (value < 140) return "yellow";
            return "red";
        }
    },

    glucose: {
        name: "Fasting Blood Glucose",
        unit: "mg/dL",
        evaluate(value) {
            if (value >= 70 && value <= 99) return "green";
            if ((value >= 54 && value < 70) ||
                (value >= 100 && value <= 125)) return "yellow";
            return "red";
        }
    },

    temperature: {
        name: "Body Temperature",
        unit: "°C",
        evaluate(value) {
            if (value >= 36.1 && value <= 37.2) return "green";
            if ((value >= 35.5 && value < 36.1) ||
                (value > 37.2 && value <= 38)) return "yellow";
            return "red";
        }
    },

    sleep: {
        name: "Sleep",
        unit: "hours",
        evaluate(value) {
            if (value >= 7) return "green";
            if (value >= 6) return "yellow";
            return "red";
        }
    },

    mood: {
        name: "Mood",
        unit: "/5",
        evaluate(value) {
            if (value >= 4) return "green";
            if (value === 3) return "yellow";
            return "red";
        }
    },

    exercise: {
        name: "Daily Exercise",
        unit: "minutes",
        target: 120,
        evaluate(value) {
            if (value >= 120) return "green";
            if (value >= 84) return "yellow";
            return "red";
        }
    }
};

// Evaluate one indicator
function getStatus(indicator, value) {
    const rule = indicators[indicator];

    if (!rule || typeof value !== "number" || !Number.isFinite(value)) {
        return "unknown";
    }

    return rule.evaluate(value);
}
