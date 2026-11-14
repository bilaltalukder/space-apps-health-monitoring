/*
 * indicators.js
 * NASA Space Apps Challenge - Astronaut Health Monitor
 *
 * SOURCES:
 * NASA Human Research Program
 * NASA Spaceflight Hazards
 * NASA Exercise Research
 * NASA Human Health and Performance Research
 * American Heart Association
 * CDC
 * FDA
 *
 * IMPORTANT:
 * NASA research supports the spaceflight explanations.
 * Numeric vital-sign bands are general clinical or
 * prototype screening ranges, NOT NASA-certified limits.
 *
 * Range rule:
 * min <= value < max
 *
 * Anything outside green and yellow is RED.
 * Infinity means no upper boundary.
 *
 * Red does not automatically mean a medical emergency.
 * Some red readings require urgent care; others require
 * reviewing the measurement or mission schedule.
 */

const hazards = {
  radiation: "Space radiation",
  isolation: "Isolation and confinement",
  distance: "Distance from Earth",
  gravity: "Gravity fields",
  closedEnvironment: "Hostile closed environments",
};

const indicators = [
  {
    id: "heartRate",
    name: "Resting heart rate",
    unit: "bpm",
    bodyPart: "heart",
    hazards: ["gravity", "isolation"],

    green: [[50, 91]],
    yellow: [[40, 50], [91, 111]],

    referenceType: "Prototype screening bands",
    nasaCertified: false,

    howToMeasure:
      "Sit quietly for 5 minutes. Measure resting pulse using a wrist or chest sensor. Do not use heart rate recorded during exercise.",

    why:
      "NASA research shows that microgravity causes cardiovascular deconditioning and fluid redistribution. Changes in resting heart rate may reflect stress, dehydration, recovery, or cardiovascular adaptation.",

    guidance: {
      green:
        "Resting heart rate is within the prototype monitoring range. Continue monitoring cardiovascular health.",

      yellow:
        "Rest and repeat the measurement. Review hydration, stress, sleep, and recent physical activity. A low resting heart rate may be normal in trained individuals.",

      red:
        "Stop strenuous activity and repeat the reading after resting. Contact the crew medical officer for persistent unexplained abnormalities. Chest pain, fainting, or severe breathing difficulty requires urgent assessment.",
    },

    source:
      "https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/",

    clinicalSource:
      "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates",
  },

  {
    id: "systolic",
    name: "Blood pressure (top number)",
    unit: "mmHg",
    bodyPart: "heart",
    hazards: ["gravity", "closedEnvironment"],

    green: [[90, 120]],
    yellow: [[80, 90], [120, 140]],

    referenceType: "General clinical and prototype screening",
    nasaCertified: false,

    howToMeasure:
      "Rest for 5 minutes before measuring. Use a validated blood pressure cuff at heart level. Record both systolic and diastolic values.",

    why:
      "NASA identifies fluid shifts and cardiovascular deconditioning as important effects of altered gravity. Blood pressure monitoring helps evaluate cardiovascular adaptation.",

    guidance: {
      green:
        "Systolic blood pressure is within the general reference range. Review the diastolic reading as well.",

      yellow:
        "Rest and repeat the reading. Monitor for dizziness, headache, fatigue, or unusual changes.",

      red:
        "Repeat the measurement and notify the crew medical officer for evaluation. Systolic pressure of 180 mmHg or higher requires prompt assessment; concerning symptoms require emergency evaluation.",
    },

    source:
      "https://www.nasa.gov/hrp/hazards/",

    clinicalSource:
      "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings",
  },

  {
    id: "diastolic",
    name: "Blood pressure (bottom number)",
    unit: "mmHg",
    bodyPart: "heart",
    hazards: ["gravity", "closedEnvironment"],

    green: [[60, 80]],
    yellow: [[50, 60], [80, 90]],

    referenceType: "General clinical and prototype screening",
    nasaCertified: false,

    howToMeasure:
      "Record the bottom number from the same blood pressure measurement used for systolic pressure.",

    why:
      "Microgravity affects fluid distribution and vascular regulation. Diastolic pressure provides additional information about cardiovascular health.",

    guidance: {
      green:
        "Diastolic pressure is within the general reference range.",

      yellow:
        "Rest and repeat the reading. Compare with previous blood pressure measurements.",

      red:
        "Contact the crew medical officer for evaluation. Diastolic pressure of 120 mmHg or higher requires prompt assessment, especially when symptoms are present.",
    },

    source:
      "https://www.nasa.gov/hrp/hazards/",

    clinicalSource:
      "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings",
  },

  {
    id: "glucose",
    name: "Blood glucose (fasting)",
    unit: "mg/dL",
    bodyPart: "whole body",
    hazards: ["closedEnvironment", "isolation"],

    green: [[70, 100]],
    yellow: [[54, 70], [100, 126]],

    referenceType: "General fasting clinical reference",
    nasaCertified: false,

    howToMeasure:
      "Measure blood glucose after an appropriate fasting period, generally at least 8 hours. Use an approved glucose meter.",

    why:
      "Spaceflight-related stress, changes in physical activity, nutrition, and sleep may affect metabolic regulation. Blood glucose monitoring can help identify abnormal metabolic responses.",

    guidance: {
      green:
        "Fasting blood glucose is within the general reference range.",

      yellow:
        "Review nutrition, recent activity, and the measurement. Blood glucose below 70 mg/dL requires prompt attention according to the medical protocol.",

      red:
        "Glucose below 54 mg/dL requires immediate treatment under the medical protocol. Persistent or markedly elevated glucose also requires medical assessment.",
    },

    source:
      "https://www.nasa.gov/humans-in-space/the-human-body-in-space/",

    clinicalSource:
      "https://www.cdc.gov/diabetes/diabetes-testing/index.html",
  },

  {
    id: "temperature",
    name: "Body temperature",
    unit: "°C",
    bodyPart: "whole body",
    hazards: ["closedEnvironment"],

    green: [[36.1, 37.5]],
    yellow: [[35.5, 36.1], [37.5, 38]],

    referenceType: "Approximate oral temperature screening",
    nasaCertified: false,

    howToMeasure:
      "Use a validated oral thermometer at a consistent time. Avoid taking measurements immediately after exercise or consuming hot drinks.",

    why:
      "NASA research identifies altered immune responses and environmental conditions as important spaceflight health risks. Temperature changes may indicate infection or thermoregulation problems.",

    guidance: {
      green:
        "Body temperature is within the approximate reference range.",

      yellow:
        "Rest, hydrate as appropriate, and repeat the reading. Monitor for chills, fatigue, headache, or other symptoms.",

      red:
        "Contact the crew medical officer for evaluation. Fever or unusually low temperature may indicate a medical concern. Temperature below 35°C requires urgent assessment.",
    },

    source:
      "https://www.nasa.gov/hrp/hazard-hostile-closed-environments/",

    clinicalSource:
      "https://medlineplus.gov/ency/article/001982.htm",
  },

  {
    id: "sleep",
    name: "Sleep",
    unit: "hours",
    bodyPart: "head",
    hazards: ["isolation", "closedEnvironment"],

    green: [[7, 10]],
    yellow: [[6, 7], [10, 11]],

    referenceType: "General adult sleep recommendation",
    nasaCertified: false,

    howToMeasure:
      "Record total sleep duration using a sleep diary or wearable sensor. Monitor sleep quality and fatigue alongside duration.",

    why:
      "NASA identifies sleep loss, circadian disruption, workload, noise, and spacecraft lighting as factors affecting astronaut health and performance.",

    guidance: {
      green:
        "Sleep duration is within the general adult recommended range. Continue maintaining a consistent sleep schedule.",

      yellow:
        "Review sleep quality, noise, lighting, caffeine use, and mission scheduling. Monitor fatigue and alertness.",

      red:
        "Repeated insufficient sleep may reduce concentration and operational performance. Report persistent sleep problems or unusual fatigue to the crew medical officer.",
    },

    source:
      "https://www.nasa.gov/hrp/hazard-isolation-and-confinement/",

    clinicalSource:
      "https://www.cdc.gov/sleep/about/index.html",
  },

  {
    id: "mood",
    name: "Mood",
    unit: "1 to 5",
    bodyPart: "head",
    hazards: ["isolation", "distance"],

    green: [[4, 6]],
    yellow: [[2, 4]],

    referenceType: "Project-designed mood check-in",
    nasaCertified: false,

    howToMeasure:
      "Rate your current mood from 1 to 5. 1 means very low, 3 means neutral, and 5 means very good. Record changes over time.",

    why:
      "NASA identifies isolation, confinement, distance from Earth, and demanding mission schedules as risks to behavioral health and team performance.",

    guidance: {
      green:
        "Mood is positive. Continue maintaining social connections, rest, and healthy routines.",

      yellow:
        "Check for stress, fatigue, poor sleep, or social difficulties. Consider talking with a crewmate or behavioral health specialist.",

      red:
        "Contact behavioral health support or the crew medical officer. Immediate safety concerns require urgent assistance.",
    },

    source:
      "https://www.nasa.gov/hrp/hazard-isolation-and-confinement/",
  },

  {
    id: "exercise",
    name: "Exercise",
    unit: "minutes per day",
    bodyPart: "muscles and bones",
    hazards: ["gravity"],

    green: [[120, Infinity]],
    yellow: [[60, 120]],

    referenceType: "NASA ISS exercise benchmark with prototype alert bands",
    nasaCertified: false,

    howToMeasure:
      "Log daily exercise duration, including treadmill, cycling, and resistive exercise. Record exercise type and intensity.",

    why:
      "NASA research shows that microgravity causes muscle atrophy, bone loss, and cardiovascular deconditioning. ISS astronauts average approximately two hours of daily exercise to help counteract these effects.",

    guidance: {
      green:
        "Exercise duration meets the approximate two-hour ISS benchmark. Review exercise type, intensity, and recovery as well.",

      yellow:
        "Exercise duration is below the approximate ISS benchmark. Review the assigned workout schedule and any operational or medical reasons for the difference.",

      red:
        "Exercise duration is substantially below the benchmark. Review the mission exercise plan and report barriers to the crew medical officer or exercise specialist. A missed session alone is not a medical emergency.",
    },

    source:
      "https://www.nasa.gov/missions/station/iss-research/astronaut-exercise/",
  },
];