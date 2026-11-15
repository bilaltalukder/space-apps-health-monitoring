
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
    keywords: [
      "headache", "head hurts", "my head hurts",
      "head pain", "pain in my head", "migraine",
      "pounding head", "throbbing head"
    ],
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
      "my eyes hurt", "blurry vision", "blurred vision",
      "vision changes", "double vision",
      "can't see clearly", "cannot see clearly"
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
      "chest pain", "chest hurts", "my chest hurts",
      "pain in my chest", "chest tightness",
      "chest pressure", "tight chest"
    ],
    bodyParts: ["heart", "chest"],
    indicators: ["heartRate", "systolic", "diastolic"],
    severity: "red",
    advice: "Potentially urgent symptom. Stop activity and contact the flight medical team immediately, regardless of measured heart rate or blood pressure."
  },
  {
    id: "palpitations",
    name: "Heart palpitations",
    keywords: [
      "palpitations", "heart racing",
      "heart pounding", "irregular heartbeat",
      "heart fluttering", "heart skipping beats",
      "heart beating fast"
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
      "dizzy", "dizziness", "lightheaded",
      "light headed", "feeling faint",
      "feel faint", "room spinning",
      "vertigo", "feeling unsteady"
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
      "fainted", "fainting", "passed out",
      "lost consciousness", "blacked out",
      "blackout"
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
      "cannot breathe", "hard to breathe",
      "hard time breathing", "breathless",
      "can't catch my breath",
      "cannot catch my breath",
      "struggling to breathe",
      "wheezing"
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
      "fatigue", "exhausted", "very tired",
      "really tired", "extremely tired",
      "low energy", "no energy",
      "extreme tiredness", "worn out",
      "feeling drained", "feel drained"
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
      "insomnia", "can't sleep", "cannot sleep",
      "trouble sleeping", "difficulty sleeping",
      "poor sleep", "sleep problems",
      "kept waking up", "woke up repeatedly",
      "restless sleep", "unable to sleep"
    ],
    bodyParts: ["head", "wholeBody"],
    indicators: ["sleep", "mood"],
    severity: "yellow",
    advice: "Review sleep duration and schedule. Report repeated sleep problems to the flight medical team."
  },
  {
    id: "musclePain",
    name: "Muscle pain or soreness",
    keywords: [
      "muscle pain", "muscles hurt", "my muscles hurt",
      "muscle hurts", "my muscle hurts",
      "sore muscles", "muscles are sore",
      "muscle soreness", "aching muscles",
      "muscles ache", "muscle aches",
      "muscle cramps", "muscle cramp",
      "muscles feel sore", "body aches",
      "legs hurt", "leg pain",
      "arms hurt", "arm pain",
      "calf pain", "calves hurt"
    ],
    bodyParts: ["muscles", "wholeBody"],
    indicators: ["exercise"],
    severity: "yellow",
    advice: "Review recent exercise and recovery. Report severe, new, or persistent muscle pain."
  },
  {
    id: "muscleWeakness",
    name: "Muscle weakness",
    keywords: [
      "muscle weakness", "weak muscles",
      "muscles feel weak", "muscles are weak",
      "feeling weak", "feel weak",
      "weakness in my legs", "weakness in my arms",
      "legs feel weak", "arms feel weak"
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
      "my joints hurt", "joint aches",
      "bone pain", "bones hurt",
      "back pain", "back hurts",
      "my back hurts", "backache",
      "lower back pain", "upper back pain",
      "knee pain", "knees hurt",
      "shoulder pain", "shoulders hurt",
      "stiff joints", "joint stiffness",
      "ankle pain", "hip pain",
      "neck pain", "neck hurts"
    ],
    bodyParts: ["bones", "muscles"],
    indicators: ["exercise"],
    severity: "yellow",
    advice: "Review recent exercise and movement. Report persistent or worsening pain."
  },
  {
    id: "stomachPain",
    name: "Stomach or abdominal pain",
    keywords: [
      "stomach ache", "stomachache",
      "stomach hurts", "my stomach hurts",
      "stomach pain", "pain in my stomach",
      "belly ache", "belly pain",
      "my belly hurts", "abdominal pain",
      "tummy ache", "tummy hurts",
      "stomach cramps", "abdominal cramps",
      "cramping stomach", "cramps in my stomach",
      "indigestion", "bloating",
      "bloated"
    ],
    bodyParts: ["abdomen"],
    indicators: ["glucose", "temperature"],
    severity: "yellow",
    advice: "Monitor the discomfort and any associated symptoms. Report persistent, severe, or worsening abdominal pain to the flight medical team."
  },
  {
    id: "nausea",
    name: "Nausea or vomiting",
    keywords: [
      "nausea", "nauseous", "feel sick",
      "feeling sick", "feel like throwing up",
      "feel like vomiting", "vomiting",
      "threw up", "throwing up",
      "been sick", "upset stomach",
      "queasy"
    ],
    bodyParts: ["abdomen", "wholeBody"],
    indicators: ["glucose", "temperature"],
    severity: "yellow",
    advice: "Review associated symptoms and available measurements. Report persistent vomiting or worsening symptoms."
  },
  {
    id: "diarrhea",
    name: "Diarrhea or digestive changes",
    keywords: [
      "diarrhea", "diarrhoea",
      "loose stools", "watery stools",
      "frequent bowel movements",
      "stomach bug"
    ],
    bodyParts: ["abdomen"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Monitor symptoms and hydration. Report persistent diarrhea, severe abdominal pain, or signs of dehydration."
  },
  {
    id: "constipation",
    name: "Constipation",
    keywords: [
      "constipation", "constipated",
      "can't poop", "cannot poop",
      "difficulty passing stool",
      "hard stools"
    ],
    bodyParts: ["abdomen"],
    indicators: ["exercise"],
    severity: "yellow",
    advice: "Review hydration, nutrition, and activity. Report persistent or worsening symptoms."
  },
  {
    id: "fever",
    name: "Fever or chills",
    keywords: [
      "fever", "feverish", "high temperature",
      "chills", "shivering", "body feels hot",
      "feeling cold", "cold sweats",
      "sweating excessively"
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
      "feeling sad", "feel sad", "depressed",
      "feeling anxious", "feel anxious",
      "anxiety", "low mood",
      "feeling stressed", "feel stressed",
      "overwhelmed", "feeling lonely",
      "feel lonely", "irritable",
      "feeling down", "feel down"
    ],
    bodyParts: ["head"],
    indicators: ["mood", "sleep"],
    severity: "yellow",
    advice: "Review mood and sleep trends. Consider support from the mission behavioral-health team."
  },
  {
    id: "soreThroat",
    name: "Sore throat",
    keywords: [
      "sore throat", "throat hurts",
      "my throat hurts", "painful throat",
      "scratchy throat", "throat pain"
    ],
    bodyParts: ["head"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Monitor for additional signs of illness and report persistent or worsening throat pain."
  },
  {
    id: "cough",
    name: "Cough",
    keywords: [
      "cough", "coughing",
      "dry cough", "wet cough",
      "persistent cough"
    ],
    bodyParts: ["chest"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Monitor the cough and any associated breathing difficulties or fever. Report persistent or worsening symptoms."
  },
  {
    id: "congestion",
    name: "Nasal congestion",
    keywords: [
      "stuffy nose", "blocked nose",
      "runny nose", "nasal congestion",
      "congested", "sneezing"
    ],
    bodyParts: ["head"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Monitor symptoms and report persistent or worsening congestion, particularly if accompanied by other signs of illness."
  }

  ,
  {
    id: "motionSickness",
    name: "Space motion sickness",
    keywords: [
      "motion sickness", "motion sick",
      "feeling motion sick", "feel seasick",
      "feel dizzy from movement",
      "space sickness"
    ],
    bodyParts: ["head", "abdomen"],
    indicators: ["heartRate"],
    severity: "yellow",
    advice: "Record the symptoms and report persistent or worsening motion sickness to the flight medical team."
  },
  {
    id: "disorientation",
    name: "Spatial disorientation",
    keywords: [
      "disoriented", "spatial disorientation",
      "confused about direction",
      "can't tell which way is up",
      "cannot tell which way is up",
      "orientation problems"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Pause complex activities and report new or persistent disorientation to the flight medical team."
  },
  {
    id: "balanceProblems",
    name: "Balance difficulties",
    keywords: [
      "balance problems", "losing my balance",
      "losing balance", "unsteady",
      "feeling unsteady", "trouble balancing",
      "difficulty balancing"
    ],
    bodyParts: ["head", "wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Avoid activities where loss of balance could cause injury and report persistent symptoms."
  },
  {
    id: "coordination",
    name: "Coordination difficulties",
    keywords: [
      "poor coordination", "trouble coordinating",
      "difficulty coordinating movements",
      "clumsy", "dropping things",
      "trouble controlling movements",
      "hand eye coordination problems"
    ],
    bodyParts: ["wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Record changes in coordination and report new or worsening difficulties to the flight medical team."
  },
  {
    id: "nasalCongestion",
    name: "Nasal or sinus congestion",
    keywords: [
      "stuffy nose", "blocked sinuses",
      "sinus pressure", "sinus congestion",
      "nasal congestion", "nose feels blocked",
      "congested nose"
    ],
    bodyParts: ["head"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Monitor congestion and associated symptoms. Report persistent or worsening discomfort."
  },
  {
    id: "facialFullness",
    name: "Facial fullness or swelling",
    keywords: [
      "facial fullness", "face feels swollen",
      "puffy face", "swollen face",
      "face feels puffy", "facial swelling",
      "pressure in my face"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Record facial swelling or pressure and report new or worsening symptoms to the flight medical team."
  },
  {
    id: "earPressure",
    name: "Ear pressure or blockage",
    keywords: [
      "ear pressure", "ears feel blocked",
      "blocked ears", "plugged ears",
      "pressure in my ears", "ears popping",
      "fullness in ears"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Monitor ear pressure and report persistent discomfort or changes in hearing."
  },
  {
    id: "earPain",
    name: "Ear pain",
    keywords: [
      "earache", "ear pain", "ears hurt",
      "my ear hurts", "pain in my ear",
      "pain inside my ear"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Report persistent ear pain or any associated hearing changes to the flight medical team."
  },
  {
    id: "nosebleed",
    name: "Nosebleed",
    keywords: [
      "nosebleed", "nose bleed",
      "bloody nose", "nose is bleeding",
      "blood coming from my nose",
      "bleeding from my nose"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Report nosebleeds to the flight medical team, especially if bleeding is persistent or recurrent."
  },
  {
    id: "skinRash",
    name: "Skin rash",
    keywords: [
      "skin rash", "rash", "red patches",
      "red spots on skin", "skin is breaking out",
      "spots on my skin", "hives"
    ],
    bodyParts: ["wholeBody"],
    indicators: ["temperature"],
    severity: "yellow",
    advice: "Record the location and appearance of the rash. Report spreading or worsening skin changes."
  },
  {
    id: "skinIrritation",
    name: "Skin irritation or itching",
    keywords: [
      "itchy skin", "skin itching",
      "irritated skin", "skin irritation",
      "skin feels itchy", "itching all over",
      "dry itchy skin"
    ],
    bodyParts: ["wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Monitor the affected area and report persistent irritation, particularly if a rash develops."
  },
  {
    id: "abrasions",
    name: "Minor cuts or abrasions",
    keywords: [
      "abrasion", "scrape", "scraped skin",
      "small cut", "minor cut",
      "cut my finger", "cut my hand",
      "skin abrasion", "scratched skin"
    ],
    bodyParts: ["wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Clean and monitor minor injuries according to mission medical procedures. Report signs of infection or worsening injury."
  },
  {
    id: "coldSores",
    name: "Cold sores",
    keywords: [
      "cold sore", "cold sores",
      "fever blister", "fever blisters",
      "lip blister", "blisters on my lips"
    ],
    bodyParts: ["head"],
    indicators: [],
    severity: "yellow",
    advice: "Record new or recurring cold sores and report them to the flight medical team."
  },
  {
    id: "urinaryRetention",
    name: "Difficulty urinating",
    keywords: [
      "urinary retention", "difficulty urinating",
      "trouble urinating", "can't pee",
      "cannot pee", "unable to urinate",
      "hard to urinate", "can't empty bladder"
    ],
    bodyParts: ["wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Report difficulty urinating promptly to the flight medical team. Inability to urinate requires urgent medical assessment."
  },
  {
    id: "frequentUrination",
    name: "Frequent urination",
    keywords: [
      "frequent urination", "urinating frequently",
      "peeing frequently", "peeing a lot",
      "urinating a lot", "need to pee often",
      "going to the bathroom frequently"
    ],
    bodyParts: ["wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Record changes in urination frequency and report persistent changes to the flight medical team."
  },
  {
    id: "dehydration",
    name: "Possible dehydration symptoms",
    keywords: [
      "very thirsty", "extremely thirsty",
      "dry mouth", "mouth feels dry",
      "feeling dehydrated", "feel dehydrated",
      "unusually thirsty"
    ],
    bodyParts: ["wholeBody"],
    indicators: ["heartRate"],
    severity: "yellow",
    advice: "Review fluid intake and report persistent thirst or other possible dehydration symptoms. This symptom alone cannot confirm dehydration."
  },
  {
    id: "dryEyes",
    name: "Dry or irritated eyes",
    keywords: [
      "dry eyes", "eyes feel dry",
      "gritty eyes", "irritated eyes",
      "burning eyes", "eyes are burning",
      "itchy eyes"
    ],
    bodyParts: ["eyes", "head"],
    indicators: [],
    severity: "yellow",
    advice: "Monitor eye discomfort and report persistent irritation, pain, or vision changes."
  },
  {
    id: "tingling",
    name: "Tingling or numbness",
    keywords: [
      "tingling", "pins and needles",
      "numbness", "numb fingers",
      "numb hands", "numb feet",
      "hands feel numb", "feet feel numb",
      "tingling fingers", "tingling hands"
    ],
    bodyParts: ["muscles", "wholeBody"],
    indicators: [],
    severity: "yellow",
    advice: "Record where the tingling or numbness occurs and report new or persistent symptoms. Sudden weakness or one-sided numbness requires urgent medical assessment."
  },
  {
    id: "appetiteLoss",
    name: "Loss of appetite",
    keywords: [
      "loss of appetite", "no appetite",
      "not hungry", "don't feel hungry",
      "do not feel hungry", "appetite loss",
      "not interested in food"
    ],
    bodyParts: ["abdomen", "wholeBody"],
    indicators: ["glucose"],
    severity: "yellow",
    advice: "Monitor food intake and report persistent appetite changes, particularly if accompanied by nausea or weight changes."
  },
  {
    id: "concentration",
    name: "Difficulty concentrating",
    keywords: [
      "difficulty concentrating", "can't concentrate",
      "cannot concentrate", "trouble focusing",
      "can't focus", "cannot focus",
      "brain fog", "poor concentration",
      "hard to concentrate", "mental fog"
    ],
    bodyParts: ["head"],
    indicators: ["sleep", "mood"],
    severity: "yellow",
    advice: "Review sleep and workload. Report persistent concentration difficulties or sudden changes in mental clarity."
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

// Check whether a keyword exists as a complete phrase.
// Avoid matching symptoms that are explicitly denied.
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

    const negated = /(?:^|\s)(?:no|not|without|deny|denies|denied|don't|dont|doesn't|doesnt|never)(?:\s+\w+){0,2}$/.test(before);

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
if (typeof window !== "undefined") {
  window.MissionSymptoms = {
    analyzeSymptoms,
    combineHealthStatus,
    SYMPTOM_LIBRARY
  };
}
