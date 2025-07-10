# Utiliser l'image officielle Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production

# Copier le reste des fichiers de l'application
COPY . .

# Créer un utilisateur non-root pour des raisons de sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer la propriété des fichiers
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port sur lequel l'application va tourner
EXPOSE 5003

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=5003

# Commande pour démarrer l'application
CMD ["npm", "start"]
