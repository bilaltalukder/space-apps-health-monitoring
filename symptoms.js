
/*
  MISSION HEALTH — SYMPTOM DETECTION
  NASA Space Apps Challenge

  Detects symptoms in astronaut daily notes.
  Connects symptoms to health indicators and body regions.

  This is a prototype screening tool, not a diagnosis.
*/

const SYMPTOM_LIBRARY = [
  {
    id: "headache",
    name: "Headache",
    keywords: ["headache", "head hurts", "head pain", "migraine"],
    bodyParts: ["head"],
    indicators: ["systolic", "diastolic", "sleep"],
    severity: "yellow",
    advice: "Review blood pressure and sleep. Report persistent or worsening headaches to the flight medical team."
  },
  {
    id: "eyePain",
    name: "Eye pain or vision changes",
    keywords: [
      "eye pain", "eyes hurt", "eye hurts",
      "blurry vision", "blurred vision",
      "vision changes", "double vision"
    ],
    bodyParts: ["head", "eyes"],
    indicators: ["systolic", "diastolic"],
    severity: "yellow",
    advice: "Report new eye pain or vision changes to the flight medical team. Spaceflight can affect vision, but the cause cannot be determined from these measurements."
  },
  {
    id: "chestPain",
    name: "Chest pain",
    keywords: [
      "chest pain", "chest hurts",
      "chest tightness", "chest pressure"
    ],
    bodyParts: ["heart", "chest"],
    indicators: ["heartRate", "systolic", "diastolic"],
    severity: "red",
    advice: "Potentially urgent symptom. Stop activity and contact the flight medical team immediately, regardless of the measured heart rate or blood pressure."
  },
  {
    id: "palpitations",
    name: "Heart palpitations",
    keywords: [
      "palpitations", "heart racing",
      "heart pounding", "irregular heartbeat",
      "heart fluttering"
    ],
    bodyParts: ["heart", "chest"],
    indicators: ["heartRate"],
    severity: "yellow",
    advice: "Review heart rate and report new or recurring palpitations. Seek urgent medical guidance if accompanied by chest pain, fainting, or breathing difficulty."
  },
  {
    id: "dizziness",
    name: "Dizziness",
    keywords: [
      "dizzy", "dizziness",
      "lightheaded", "light headed",
      "feeling faint"
    ],
    bodyParts: ["head", "heart"],
    indicators: ["heartRate", "systolic", "diastolic", "glucose"],
    severity: "yellow",
    advice: "Pause activity, avoid falls, review relevant readings, and report persistent or worsening dizziness."
  },
  {
    id: "fainting",
    name: "Fainting",
    keywords: [
      "fainted", "fainting",
      "passed out", "lost consciousness"
    ],
    bodyParts: ["head", "heart"],
    indicators: ["heartRate", "systolic", "diastolic", "glucose"],
    severity: "red",
    advice: "Potentially urgent symptom. Contact the flight medical team immediately."
  },
  {
    id: "breathing",
    name: "Breathing difficulty",
    keywords: [
      "shortness of breath", "difficulty breathing",
      "trouble breathing", "can't breathe",
      "cannot breathe", "breathless"
    ],
    bodyParts: ["chest", "heart"],
    indicators: ["heartRate"],
    severity: "red",
    advice: "Potentially urgent symptom. Stop activity and contact the flight medical team immediately."
  },
  {
    id: "fatigue",
    name: "Fatigue",
    keywords: [
      "fatigue", "exhausted",
      "very tired", "low energy",
      "extreme tiredness"
    ],
    bodyParts: ["wholeBody", "head"],
    indicators: ["sleep", "glucose", "exercise"],
    severity: "yellow",
    advice: "Review sleep, nutrition, workload, and recent activity. Report persistent or unusual fatigue."
  },
  {
    id: "sleepProblems",
    name: "Sleep difficulties",
    keywords: [
      "insomnia", "can't sleep",
      "cannot sleep", "trouble sleeping",
      "difficulty sleeping", "poor sleep"
    ],
    bodyParts: ["head", "wholeBody"],
    indicators: ["sleep", "mood"],
    severity: "yellow",
    advice: "Review sleep duration and schedule. Report repeated sleep problems to the flight medical team."
  },
  {
    id: "muscleWeakness",
    name: "Muscle weakness",
    keywords: [
      "muscle weakness", "weak muscles",
      "muscles feel weak", "muscle pain",
      "muscle soreness"
    ],
    bodyParts: ["muscles", "wholeBody"],
    indicators: ["exercise"],
    severity: "yellow",
    advice: "Review exercise and recovery. Report new, severe, or persistent weakness."
  },
  {
    id: "jointPain",
    name: "Joint or bone pain",
    keywords: [
      "joint pain", "joints hurt",
      "bone pain", "bones hurt",
      "back pain"
    ],
    bodyParts: ["bones", "muscles"],
    indicators: ["exercise"],
    severity: "yellow",
    advice: "Review recent exercise and movement. Report persistent or worsening pain."
  },
  {
    id: "nausea",
    name: "Nausea",
    keywords: [
      "nausea", "nauseous",
      "feel sick", "vomiting",
      "throwing up"
    ],
    bodyParts: ["abdomen", "wholeBody"],
    indicators: ["glucose", "temperature"],
    severity: "yellow",
    advice: "Review associated symptoms and available measurements. Report persistent vomiting or worsening symptoms."
  },
  {
    id: "fever",
    name: "Fever or chills",
    keywords: [
      "fever", "feverish",
      "chills", "shivering"
    ],
    bodyParts: ["wholeBody"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Measure body temperature and report possible illness to the flight medical team."
  },
  {
    id: "lowMood",
    name: "Low mood or anxiety",
    keywords: [
      "feeling sad", "depressed",
      "feeling anxious", "anxiety",
      "low mood", "feeling stressed",
      "overwhelmed"
    ],
    bodyParts: ["head"],
    indicators: ["mood", "sleep"],
    severity: "yellow",
    advice: "Review mood and sleep trends. Consider support from the mission behavioral-health team."
  }
];

const SYMPTOM_SEVERITY_ORDER = {
  green: 0,
  yellow: 1,
  red: 2
};

// Normalize text so punctuation and capitalization
// do not interfere with matching.
function normalizeSymptomText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Avoid matching "pain" inside unrelated words.
// Also avoid simple negations such as "no headache".
function symptomKeywordPresent(text, keyword) {
  const normalized = normalizeSymptomText(text);
  const phrase = normalizeSymptomText(keyword);

  if (!phrase) return false;

  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(
    "(^|\\s)" + escaped + "(?=\\s|$)",
    "g"
  );

  let match;

  while ((match = regex.exec(normalized)) !== null) {
    const before = normalized
      .slice(0, match.index)
      .trim()
      .split(/\s+/)
      .slice(-4)
      .join(" ");

    const negated = /(?:^|\s)(?:no|not|without|deny|denies|denied)(?:\s+\w+){0,2}$/.test(before);

    if (!negated) return true;
  }

  return false;
}

// Main function: analyze daily check-in notes.
function analyzeSymptoms(notes) {
  const matches = [];

  for (const symptom of SYMPTOM_LIBRARY) {
    const found = symptom.keywords.some(keyword =>
      symptomKeywordPresent(notes, keyword)
    );

    if (found) {
      matches.push({
        id: symptom.id,
        name: symptom.name,
        severity: symptom.severity,
        bodyParts: [...symptom.bodyParts],
        indicators: [...symptom.indicators],
        advice: symptom.advice
      });
    }
  }

  const affectedBodyParts = [
    ...new Set(matches.flatMap(item => item.bodyParts))
  ];

  const relatedIndicators = [
    ...new Set(matches.flatMap(item => item.indicators))
  ];

  let overallSeverity = "green";

  for (const symptom of matches) {
    if (
      SYMPTOM_SEVERITY_ORDER[symptom.severity] >
      SYMPTOM_SEVERITY_ORDER[overallSeverity]
    ) {
      overallSeverity = symptom.severity;
    }
  }

  return {
    hasSymptoms: matches.length > 0,
    severity: overallSeverity,
    symptoms: matches,
    affectedBodyParts,
    relatedIndicators,
    requiresMedicalContact: overallSeverity === "red",
    disclaimer:
      "Educational prototype only. Symptom matching does not diagnose or exclude a medical condition."
  };
}

// Combine symptom alerts with measurement alerts.
// A concerning symptom must not be hidden by normal readings.
function combineHealthStatus(measurementStatus, symptomStatus) {
  const measurement =
    SYMPTOM_SEVERITY_ORDER[measurementStatus] === undefined
      ? "green"
      : measurementStatus;

  const symptom =
    SYMPTOM_SEVERITY_ORDER[symptomStatus] === undefined
      ? "green"
      : symptomStatus;

  return SYMPTOM_SEVERITY_ORDER[measurement] >=
    SYMPTOM_SEVERITY_ORDER[symptom]
    ? measurement
    : symptom;
}

// Export functions for browser scripts.
// This does not change existing rules.js.
if (typeof window !== "undefined") {
  window.MissionSymptoms = {
    analyzeSymptoms,
    combineHealthStatus,
    SYMPTOM_LIBRARY
  };
}
