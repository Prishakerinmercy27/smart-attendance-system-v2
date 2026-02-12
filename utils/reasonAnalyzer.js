/**
 * Rule-based NLP Mini-AI Classifier
 * Analyzes leave request reasons → assigns category + priority
 * 
 * Categories: Medical, Emergency, Personal, Academic, Suspicious
 * Priority: High, Normal, Low
 */

function analyzeReason(reason) {
  // Normalize text
  const text = reason.toLowerCase().trim();

  // Keyword-based categories
  const categories = {
    Medical: [
      "fever", "cold", "cough", "doctor", "hospital", "sick", "illness", 
      "medicine", "surgery", "diagnosed", "treatment", "checkup", "dental",
      "headache", "flu", "injury", "health", "medical", "consultation"
    ],
    Emergency: [
      "accident", "critical", "death", "died", "emergency", "injured", 
      "injury", "urgent", "crisis", "severe", "grave", "life-threatening"
    ],
    Personal: [
      "family", "function", "wedding", "ceremony", "relative", "parent",
      "sibling", "cousin", "uncle", "aunt", "grandfather", "grandmother",
      "personal", "home", "domestic", "household"
    ],
    Academic: [
      "exam", "examination", "test", "competition", "olympiad", "project",
      "assignment", "seminar", "conference", "workshop", "internship",
      "academic", "study", "research", "presentation"
    ],
    Suspicious: [
      "trip", "movie", "outing", "tired", "bored", "vacation", "holiday",
      "rest", "relax", "leisure", "party", "shopping", "friend", "picnic",
      "hangout", "fun", "enjoy", "game", "concert", "event"
    ]
  };

  // Score each category
  let bestMatch = "Personal";
  let maxScore = 0;
  const scores = {};

  for (let category in categories) {
    let score = categories[category].filter(
      word => text.includes(word)
    ).length;

    scores[category] = score;

    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  // Determine priority based on category
  let priority = "Normal";

  if (bestMatch === "Medical" || bestMatch === "Emergency") {
    priority = "High";
  } else if (bestMatch === "Academic") {
    priority = "Normal";
  } else if (bestMatch === "Suspicious") {
    priority = "Low";
  }

  return {
    category: bestMatch,
    priority: priority,
    score: maxScore,
    categoryScores: scores,
    confidence: (maxScore / Math.max(5, text.split(" ").length)) * 100
  };
}

module.exports = analyzeReason;
