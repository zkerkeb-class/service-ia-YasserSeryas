// services/perplexityService.js

const { OpenAI } = require("openai");
require("dotenv").config();

// Configuration du client Perplexity
const perplexityClient = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
});

/**
 * Récupère les événements tendance basés sur la localisation et les préférences de l'utilisateur
 * @param {string} userLocation - La localisation de l'utilisateur
 * @param {Array} userPreferences - Les préférences de l'utilisateur
 * @returns {Promise<string>} - Les recommandations d'événements
 */
const getTrendingEventsAndIdeas = async (userLocation, userPreferences) => {
  try {
    const completion = await perplexityClient.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: `
              Vous êtes un assistant expert en recommandation d'événements culturels, sportifs et de divertissement.
              Votre mission est double :
              1. Proposer uniquement des événements populaires et tendance, à venir dans les prochaines semaines.
                 Limitez vos réponses à un maximum de 5 suggestions pertinentes, avec pour chacun :
                 - Le nom de l'événement
                 - Une courte description
                 - La date
                 - Le lieu
                 - Pourquoi il est tendance actuellement
              2. Proposer des idées originales d'événements à créer ou organiser, inspirées des tendances actuelles et adaptées aux centres d'intérêt de l'utilisateur.
                 Limitez vos réponses à un maximum de 3 idées, avec pour chacune :
                 - Une description concise
                 - Pourquoi cette idée est pertinente ou tendance
                 - Des conseils pour la mise en œuvre
  
              Présentez le tout de manière claire, attrayante et facile à parcourir.
            `.trim(),
        },
        {
          role: "user",
          content: `
              Quels sont les événements les plus en vogue à ${
                userLocation || "Paris"
              } en ce moment ?
              J'aimerais découvrir des idées originales à organiser ou à vivre, en lien avec mes centres d'intérêt : ${
                userPreferences?.join(", ") ||
                "la musique, le sport et les arts"
              }.
              Je cherche des idées inspirantes pour les prochaines semaines.
            `.trim(),
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements tendance:",
      error
    );
    throw new Error(
      "Impossible de récupérer les événements tendance pour le moment"
    );
  }
};

/**
 * Génère des suggestions personnalisées basées sur l'historique des événements consultés
 * @param {Array} eventHistory - L'historique des événements consultés par l'utilisateur
 * @returns {Promise<string>} - Les suggestions personnalisées
 */
const getPersonalizedSuggestions = async (eventHistory) => {
  try {
    const historyText =
      eventHistory
        ?.map(
          (event) => `${event.name} (${event.category}) à ${event.location}`
        )
        .join(", ") || "aucun historique disponible";

    const completion = await perplexityClient.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "Vous êtes un assistant spécialisé dans la recommandation d'événements. Basez vos suggestions sur l'historique de l'utilisateur. Proposez des événements variés mais cohérents avec ses goûts. Limitez-vous à 3 suggestions précises et pertinentes.",
        },
        {
          role: "user",
          content: `Basé sur mon historique d'événements consultés: ${historyText}, pouvez-vous me suggérer d'autres événements que je pourrais aimer? Je cherche des idées nouvelles mais qui correspondent à mes goûts.`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(
      "Erreur lors de la génération de suggestions personnalisées:",
      error
    );
    throw new Error(
      "Impossible de générer des suggestions personnalisées pour le moment"
    );
  }
};

/**
 * Répond aux questions spécifiques sur les événements
 * @param {string} userQuestion - La question de l'utilisateur
 * @returns {Promise<string>} - La réponse à la question
 */
const answerEventQuestion = async (userQuestion) => {
  try {
    const completion = await perplexityClient.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "Vous êtes un assistant spécialisé dans les événements et la billetterie. Répondez de manière concise et informative aux questions des utilisateurs concernant les événements, les tendances, ou les recommandations.",
        },
        {
          role: "user",
          content: userQuestion,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de la réponse à la question:", error);
    throw new Error("Impossible de répondre à votre question pour le moment");
  }
};

module.exports = {
  getTrendingEvents,
  getPersonalizedSuggestions,
  answerEventQuestion,
};
