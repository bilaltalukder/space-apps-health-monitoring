// seedData.js
// -----------------------------------------------------------------------------
// WHAT THIS FILE IS: 21 days of made-up readings for one demo astronaut.
// Days 1-8 are healthy. From day 9 sleep falls, mood slips, blood pressure and
// heart rate climb, and exercise drops. That is the story you show the judges.
//
// HOW TO USE IT: load it with a <script> tag after indicators.js (see the top of
// indicators.js). Then `seedData` is available everywhere. Read one value like:
//     seedData[11].sleep        // day 12's sleep hours (arrays start at 0)
//
// Each key matches an `id` in indicators.js, so you can loop over `indicators`
// and read `day[indicator.id]` to get the matching value.
//
// The saved check-ins from the form (localStorage) will be added after these.
// -----------------------------------------------------------------------------

const seedData = [
  // day, heartRate, systolic, diastolic, glucose, temperature, sleep, mood, exercise
  { day: 1,  heartRate: 60, systolic: 110, diastolic: 70, glucose: 86,  temperature: 36.6, sleep: 7.6, mood: 5, exercise: 70 },
  { day: 2,  heartRate: 62, systolic: 112, diastolic: 72, glucose: 88,  temperature: 36.6, sleep: 7.9, mood: 4, exercise: 65 },
  { day: 3,  heartRate: 59, systolic: 109, diastolic: 69, glucose: 84,  temperature: 36.5, sleep: 7.4, mood: 4, exercise: 72 },
  { day: 4,  heartRate: 61, systolic: 111, diastolic: 71, glucose: 87,  temperature: 36.7, sleep: 7.8, mood: 5, exercise: 68 },
  { day: 5,  heartRate: 63, systolic: 113, diastolic: 72, glucose: 90,  temperature: 36.6, sleep: 7.2, mood: 4, exercise: 60 },
  { day: 6,  heartRate: 60, systolic: 110, diastolic: 70, glucose: 85,  temperature: 36.5, sleep: 7.5, mood: 5, exercise: 75 },
  { day: 7,  heartRate: 62, systolic: 114, diastolic: 73, glucose: 89,  temperature: 36.7, sleep: 7.3, mood: 4, exercise: 66 },
  { day: 8,  heartRate: 64, systolic: 115, diastolic: 73, glucose: 91,  temperature: 36.6, sleep: 7.1, mood: 4, exercise: 62 },

  // The slide begins here.
  { day: 9,  heartRate: 65, systolic: 118, diastolic: 75, glucose: 92,  temperature: 36.7, sleep: 6.6, mood: 4, exercise: 58 },
  { day: 10, heartRate: 67, systolic: 121, diastolic: 77, glucose: 94,  temperature: 36.7, sleep: 5.9, mood: 3, exercise: 55 },
  { day: 11, heartRate: 69, systolic: 123, diastolic: 78, glucose: 96,  temperature: 36.8, sleep: 5.7, mood: 3, exercise: 50 },
  { day: 12, heartRate: 71, systolic: 126, diastolic: 80, glucose: 98,  temperature: 36.8, sleep: 5.5, mood: 2, exercise: 45 }, // 3 nights under 6 hours: trend alert here
  { day: 13, heartRate: 73, systolic: 129, diastolic: 82, glucose: 101, temperature: 36.8, sleep: 5.4, mood: 2, exercise: 40 },
  { day: 14, heartRate: 75, systolic: 132, diastolic: 84, glucose: 103, temperature: 36.9, sleep: 5.6, mood: 2, exercise: 35 }, // 3 days of mood 2: trend alert
  { day: 15, heartRate: 78, systolic: 135, diastolic: 86, glucose: 106, temperature: 37.0, sleep: 5.2, mood: 3, exercise: 30 },
  { day: 16, heartRate: 80, systolic: 137, diastolic: 87, glucose: 109, temperature: 37.1, sleep: 5.0, mood: 2, exercise: 28 },
  { day: 17, heartRate: 83, systolic: 139, diastolic: 89, glucose: 112, temperature: 37.4, sleep: 4.8, mood: 2, exercise: 25 },
  { day: 18, heartRate: 86, systolic: 142, diastolic: 90, glucose: 115, temperature: 37.3, sleep: 5.1, mood: 2, exercise: 22 },
  { day: 19, heartRate: 88, systolic: 144, diastolic: 92, glucose: 119, temperature: 37.2, sleep: 4.9, mood: 2, exercise: 20 },
  { day: 20, heartRate: 91, systolic: 146, diastolic: 94, glucose: 124, temperature: 37.1, sleep: 4.7, mood: 1, exercise: 18 },
  { day: 21, heartRate: 93, systolic: 148, diastolic: 95, glucose: 127, temperature: 37.0, sleep: 4.5, mood: 2, exercise: 15 },
];