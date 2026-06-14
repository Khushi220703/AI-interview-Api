// controllers/insights.js
import Interview from "../schema/interview.js";

export const getUserInsights = async (req, res) => {
  try {
    const userId = req.body._id;
    const interviews = await Interview.find({ userId, status: "completed" }).sort({ completedAt: 1 });

    if (!interviews.length) {
      return res.status(200).json({ success: true, message: "No completed interviews yet", data: {} });
    }

    // --- Streak Calculation ---
    const streak = calculateStreak(interviews);

    // --- Monthly Histogram (last 6 months) ---
    const monthlyData = getMonthlyData(interviews);

    // --- Skill Maturity (aggregate per topic) ---
    const skillMaturity = getSkillMaturity(interviews);

    // --- Strong / Weak Areas (across all interviews) ---
    const { strongAreas, weakAreas } = getAreasSummary(interviews);

    // --- Recent Performance Trend ---
    const recentTrend = interviews.slice(-5).map((iv) => ({
      date: iv.completedAt,
      score: iv.evaluation.overallScore,
      topic: iv.topic,
      role: iv.role,
    }));

    // --- Topics to Study (most frequent from weak areas) ---
    const studyPlan = getStudyPlan(interviews);

    res.status(200).json({
      success: true,
      data: {
        totalInterviews: interviews.length,
        averageScore: Math.round(interviews.reduce((s, iv) => s + iv.evaluation.overallScore, 0) / interviews.length),
        streak,
        monthlyData,
        skillMaturity,
        strongAreas,
        weakAreas,
        recentTrend,
        studyPlan,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Helpers ---

function calculateStreak(interviews) {
  const dates = [...new Set(interviews.map((iv) => iv.completedAt.toDateString()))].reverse();
  let streak = 0;
  let current = new Date();

  for (const dateStr of dates) {
    const diff = Math.floor((current - new Date(dateStr)) / (1000 * 60 * 60 * 24));
    if (diff <= 1) { streak++; current = new Date(dateStr); }
    else break;
  }
  return streak;
}

function getMonthlyData(interviews) {
  const map = {};
  interviews.forEach((iv) => {
    const key = `${iv.completedAt.getFullYear()}-${String(iv.completedAt.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { count: 0, totalScore: 0 };
    map[key].count++;
    map[key].totalScore += iv.evaluation.overallScore;
  });

  return Object.entries(map).slice(-6).map(([month, val]) => ({
    month,
    interviewCount: val.count,
    averageScore: Math.round(val.totalScore / val.count),
  }));
}

function getSkillMaturity(interviews) {
  const map = {};
  interviews.forEach((iv) => {
    const t = iv.topic;
    if (!map[t]) map[t] = { scores: [], count: 0 };
    map[t].scores.push(iv.evaluation.overallScore);
    map[t].count++;
  });

  return Object.entries(map).map(([topic, val]) => {
    const avg = Math.round(val.scores.reduce((a, b) => a + b, 0) / val.scores.length);
    return {
      topic,
      averageScore: avg,
      interviewCount: val.count,
      maturityLevel: avg >= 80 ? "Expert" : avg >= 60 ? "Intermediate" : "Beginner",
    };
  });
}

function getAreasSummary(interviews) {
  const strongMap = {}, weakMap = {};
  interviews.forEach((iv) => {
    iv.evaluation.strongAreas?.forEach((a) => { strongMap[a] = (strongMap[a] || 0) + 1; });
    iv.evaluation.weakAreas?.forEach((a) => { weakMap[a] = (weakMap[a] || 0) + 1; });
  });

  const sort = (map) => Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([area]) => area);
  return { strongAreas: sort(strongMap), weakAreas: sort(weakMap) };
}

function getStudyPlan(interviews) {
  const map = {};
  interviews.forEach((iv) => {
    iv.evaluation.topicsToStudy?.forEach((t) => { map[t] = (map[t] || 0) + 1; });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([topic, freq]) => ({ topic, frequency: freq }));
}