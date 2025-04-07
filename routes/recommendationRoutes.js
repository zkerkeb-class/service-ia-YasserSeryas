// routes/recommendationRoutes.js

const express = require("express");
const router = express.Router();
const perplexityService = require("../services/perplexityService");

/**
 * Route pour obtenir les événements tendance
 * GET /api/recommendations/trending
 */
router.get("/trending", async (req, res) => {
  try {
    const { location, preferences } = req.query;
    const userPreferences = preferences ? preferences.split(",") : [];

    const trendingEvents = await perplexityService.getTrendingEvents(
      location,
      userPreferences
    );

    res.json({ success: true, data: trendingEvents });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Erreur lors de la récupération des événements tendance",
    });
  }
});

/**
 * Route pour obtenir des suggestions personnalisées
 * POST /api/recommendations/personalized
 */
router.post("/personalized", async (req, res) => {
  try {
    const { eventHistory } = req.body;

    if (!eventHistory || !Array.isArray(eventHistory)) {
      return res.status(400).json({
        success: false,
        error: "L'historique des événements est requis et doit être un tableau",
      });
    }

    const personalizedSuggestions =
      await perplexityService.getPersonalizedSuggestions(eventHistory);

    res.json({ success: true, data: personalizedSuggestions });
  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Erreur lors de la génération de suggestions personnalisées",
    });
  }
});

/**
 * Route pour répondre aux questions sur les événements
 * POST /api/recommendations/ask
 */
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "La question est requise",
      });
    }

    const answer = await perplexityService.answerEventQuestion(question);

    res.json({ success: true, data: answer });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Erreur lors de la réponse à la question",
    });
  }
});

module.exports = router;
