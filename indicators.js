// indicators.js
// -----------------------------------------------------------------------------
// WHAT THIS FILE IS: the "facts" of the app. One entry per health indicator,
// with its healthy ranges and the text that explains it to an astronaut.
//
// HOW TO USE IT: no import/export needed. In index.html, load this file with a
// <script> tag BEFORE rules.js and app.js:
//     <script src="indicators.js"></script>
//     <script src="seedData.js"></script>
//     <script src="rules.js"></script>
//     <script src="app.js"></script>
// After that, the variables `hazards` and `indicators` can be used anywhere.
//
// RANGE RULE: a value is inside a band if   min <= value < max
//             (min is included, max is NOT included).
// Anything that is not in a green band or a yellow band is RED.
// `Infinity` means "no upper limit".
//
// WARNING FOR THE CONTENT PERSON: these are general adult reference ranges to
// get started. Check each one against a NASA or clinical source, then write the
// source into the `source` field. The guidance text is also a first draft.
// This is a prototype for education, not medical advice.
// -----------------------------------------------------------------------------

// The five spaceflight hazards from NASA's Human Research Program.
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
    yellow: [[91, 111], [40, 50]],
    howToMeasure:
      "Sit still for 5 minutes. Count your pulse for 30 seconds and multiply by 2, or read it from your wrist or chest sensor.",
    why:
      "Time in low gravity can decondition the heart, and stress can raise resting heart rate.",
    guidance: {
      green: "Your resting heart rate is in a healthy range. Keep up exercise and sleep.",
      yellow:
        "Rest, drink water and measure again in 30 minutes. If it stays out of range for two days, tell the crew medical officer.",
      red:
        "Stop strenuous activity and measure again after 10 minutes of rest. If it is still out of range, contact the flight surgeon.",
    },
    source: "TODO: add source",
  },
  {
    id: "systolic",
    name: "Blood pressure (top number)",
    unit: "mmHg",
    bodyPart: "heart",
    hazards: ["gravity", "closedEnvironment"],
    green: [[90, 120]],
    yellow: [[120, 140], [80, 90]],
    howToMeasure:
      "Sit with your back supported and the cuff at heart level. Rest 5 minutes first, then measure. The top number is the systolic pressure.",
    why:
      "Fluids shift toward the head in low gravity and the cardiovascular system adapts, which can change blood pressure.",
    guidance: {
      green: "Your systolic pressure is in a healthy range.",
      yellow:
        "Rest, reduce salt intake if you can, and measure again later today. Log the trend and tell the crew medical officer if it keeps rising.",
      red:
        "Rest and measure again after 10 minutes. If it is still out of range, or you feel dizzy or have chest pain, contact the flight surgeon now.",
    },
    source: "TODO: add source",
  },
  {
    id: "diastolic",
    name: "Blood pressure (bottom number)",
    unit: "mmHg",
    bodyPart: "heart",
    hazards: ["gravity", "closedEnvironment"],
    green: [[60, 80]],
    yellow: [[80, 90], [50, 60]],
    howToMeasure:
      "Measured in the same reading as the top number. The bottom number is the diastolic pressure.",
    why: "Same reasons as the top number. Both numbers together give the full picture.",
    guidance: {
      green: "Your diastolic pressure is in a healthy range.",
      yellow:
        "Rest and measure again later today. Tell the crew medical officer if it stays out of range.",
      red:
        "Rest and measure again after 10 minutes. If it is still out of range, contact the flight surgeon.",
    },
    source: "TODO: add source",
  },
  {
    id: "glucose",
    name: "Blood glucose (fasting)",
    unit: "mg/dL",
    bodyPart: "whole body",
    hazards: ["closedEnvironment", "isolation"],
    green: [[70, 100]],
    yellow: [[100, 126], [54, 70]],
    howToMeasure:
      "Measure before eating, usually in the morning. Wash and dry your hands, then use a finger-prick meter.",
    why:
      "Diet changes, stress hormones and less physical activity can all affect blood sugar on long missions.",
    guidance: {
      green: "Your fasting blood sugar is in a healthy range.",
      yellow:
        "Check what you ate and how active you were. Measure again tomorrow and tell the crew medical officer if it stays out of range.",
      red:
        "Measure again to confirm. If it is still out of range, contact the flight surgeon.",
    },
    source: "TODO: add source",
  },
  {
    id: "temperature",
    name: "Body temperature",
    unit: "°C",
    bodyPart: "whole body",
    hazards: ["closedEnvironment", "radiation"],
    green: [[36.1, 37.3]],
    yellow: [[37.3, 38.1], [35.5, 36.1]],
    howToMeasure:
      "Use an oral or ear thermometer at the same time each day, not right after exercise or a hot drink.",
    why:
      "Spaceflight changes the immune system, so a raised temperature can be an early sign of infection.",
    guidance: {
      green: "Your temperature is normal.",
      yellow:
        "Rest, drink fluids and measure again in a few hours. Tell the crew medical officer if you feel unwell.",
      red:
        "Contact the flight surgeon. A high fever in a closed habitat needs attention quickly.",
    },
    source: "TODO: add source",
  },
  {
    id: "sleep",
    name: "Sleep",
    unit: "hours",
    bodyPart: "head",
    hazards: ["isolation", "closedEnvironment"],
    green: [[7, Infinity]],
    yellow: [[6, 7]],
    howToMeasure:
      "Log the hours you slept from a wearable, or write down when you went to bed and woke up.",
    why:
      "Noise, light, schedules and stress disturb the body clock in space, and poor sleep affects mood and performance.",
    guidance: {
      green: "You are getting enough sleep. Keep your routine.",
      yellow:
        "Protect your sleep time tonight: dim the lights, cut noise and avoid caffeine late in the day.",
      red:
        "Several short nights affect safety and mood. Tell the crew medical officer and ask for schedule changes.",
    },
    source: "TODO: add source",
  },
  {
    id: "mood",
    name: "Mood",
    unit: "1 to 5",
    bodyPart: "head",
    hazards: ["isolation", "distance"],
    green: [[4, 6]],
    yellow: [[2, 4]],
    howToMeasure:
      "Rate how you feel today: 1 is very low, 3 is okay, 5 is very good. It takes ten seconds.",
    why:
      "Isolation, confinement and distance from home can affect mental health on long missions.",
    guidance: {
      green: "Your mood is good. Stay in touch with crewmates and family.",
      yellow:
        "Talk with a crewmate, schedule a call home, or do something you enjoy. Check in again tomorrow.",
      red:
        "Please reach out to the flight surgeon or behavioral health support. You do not have to handle this alone.",
    },
    source: "TODO: add source",
  },
  {
    id: "exercise",
    name: "Exercise",
    unit: "minutes per day",
    bodyPart: "muscles and bones",
    hazards: ["gravity"],
    green: [[60, Infinity]],
    yellow: [[30, 60]],
    howToMeasure: "Log the total minutes of your workout sessions each day.",
    why:
      "In low gravity, bones and muscles weaken without regular exercise, so exercise is a key countermeasure.",
    guidance: {
      green: "You are meeting your exercise target. Keep it up.",
      yellow:
        "Add a short session today. Even 15 extra minutes helps protect bones and muscles.",
      red:
        "Skipping exercise for several days increases bone and muscle loss. Plan your next session now and tell the crew medical officer if something is stopping you.",
    },
    // The 60 minute target is a PLACEHOLDER. Replace it with a NASA figure.
    source: "TODO: add source and real target",
  },
];