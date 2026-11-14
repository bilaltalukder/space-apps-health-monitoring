// rules.js
// -----------------------------------------------------------------------------
// WHAT THIS FILE IS: the "brain" of the app. It reads the ranges in indicators.js
// and decides green / yellow / red, a health score, and trend alerts.
// It does NOT draw anything. app.js will call these functions to fill the page.
//
// HOW TO USE IT: load it in index.html AFTER indicators.js and seedData.js and
// BEFORE app.js (see the top of indicators.js). Then these functions work anywhere.
//
// TO TEST WITHOUT ANY HTML: open your page with Live Server, press F12, click the
// "Console" tab, and type:  runRulesSelfTest()
// -----------------------------------------------------------------------------

// Is `value` inside any of the [min, max] pairs in `bands`?  (min included, max NOT)
function inBand(value, bands) {
  for (let i = 0; i < bands.length; i++) {
    const min = bands[i][0];
    const max = bands[i][1];
    if (value >= min && value < max) {
      return true;
    }
  }
  return false;
}

// The key function. Gives back "green", "yellow", "red" or "unknown".
//   getStatus(indicators[0], 72)  ->  "green"   (resting heart rate of 72)
function getStatus(indicator, value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "unknown";
  }
  if (inBand(value, indicator.green)) {
    return "green";
  }
  if (inBand(value, indicator.yellow)) {
    return "yellow";
  }
  return "red";
}

// Statuses for every indicator on one day.
//   getDayStatuses(seedData[11])  ->  { heartRate: "green", systolic: "yellow", ... }
function getDayStatuses(dayData) {
  const result = {};
  for (let i = 0; i < indicators.length; i++) {
    const indicator = indicators[i];
    result[indicator.id] = getStatus(indicator, dayData[indicator.id]);
  }
  return result;
}

// Used for the two blood pressure numbers, which share one card:
// the card shows the worse of its two statuses.
//   worstStatus(["green", "yellow"])  ->  "yellow"
function worstStatus(statusList) {
  if (statusList.indexOf("red") !== -1) return "red";
  if (statusList.indexOf("yellow") !== -1) return "yellow";
  if (statusList.indexOf("green") !== -1) return "green";
  return "unknown";
}

// Overall "Mission Health" score from 0 to 100.
// Start at 100, take off 5 for each yellow and 12 for each red.
// These numbers are a simple choice. Change them if you like.
function getOverallScore(dayData) {
  const statuses = getDayStatuses(dayData);
  let score = 100;
  for (const id in statuses) {
    if (statuses[id] === "yellow") score -= 5;
    if (statuses[id] === "red") score -= 12;
  }
  if (score < 0) score = 0;
  return score;
}

// Do the last `n` entries in `history` ALL pass `test` for this key?
// history = an array of day objects, oldest first, newest last.
function lastNMatch(history, key, n, test) {
  if (history.length < n) return false;
  const recent = history.slice(-n);
  return recent.every(function (day) {
    return test(day[key]);
  });
}

// Trend alerts: warnings that look at several days, not just today.
// Give it the days up to and including today, e.g. seedData.slice(0, 12)
// for "today is day 12". Returns a list of { indicatorId, message }.
function getTrendAlerts(history) {
  const alerts = [];

  // Three nights in a row with less than 6 hours of sleep.
  if (lastNMatch(history, "sleep", 3, function (v) { return v < 6; })) {
    alerts.push({
      indicatorId: "sleep",
      message: "Sleep has been under 6 hours for 3 nights in a row.",
    });
  }

  // Three days in a row with a mood rating of 2 or lower.
  if (lastNMatch(history, "mood", 3, function (v) { return v <= 2; })) {
    alerts.push({
      indicatorId: "mood",
      message: "Mood has been rated 2 or lower for 3 days in a row.",
    });
  }

  // Add more trend rules here, one block each. Ideas:
  //  - exercise under 30 minutes for 3 days in a row
  //  - resting heart rate in the yellow or red range for 3 days in a row

  return alerts;
}

// Quick check you can run from the browser console. Every line should say OK.
function runRulesSelfTest() {
  function check(label, actual, expected) {
    console.log(actual === expected ? "OK   " : "FAIL ", label, "->", actual);
  }
  const hr = indicators.find(function (i) { return i.id === "heartRate"; });
  check("heart rate 72 is green", getStatus(hr, 72), "green");
  check("heart rate 100 is yellow", getStatus(hr, 100), "yellow");
  check("heart rate 130 is red", getStatus(hr, 130), "red");
  check("heart rate missing is unknown", getStatus(hr, undefined), "unknown");
  check("day 1 score is 100", getOverallScore(seedData[0]), 100);
  check("day 5 has no alerts", getTrendAlerts(seedData.slice(0, 5)).length, 0);
  check("day 12 has 1 alert (sleep)", getTrendAlerts(seedData.slice(0, 12)).length, 1);
  check("day 14 has 2 alerts (sleep + mood)", getTrendAlerts(seedData.slice(0, 14)).length, 2);
}