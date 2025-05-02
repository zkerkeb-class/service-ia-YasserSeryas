// server.js ou app.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importation des routes
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/recommendations", recommendationRoutes);

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.json({ message: "API de recommandation d'événements opérationnelle" });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Erreur serveur interne",
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
