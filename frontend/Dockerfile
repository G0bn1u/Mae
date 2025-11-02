# ---- Étape 1 : build ----
FROM node:20 AS build

WORKDIR /app

# Définit la variable pour React (elle pointera vers le même domaine que le site)
ARG REACT_APP_BACKEND_URL=/api
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# Copier uniquement ce qu'il faut pour installer les dépendances
COPY package.json ./
# COPY package-lock.json ./   # décommente si tu as un lockfile

# Installer les dépendances sans blocage
RUN npm install --force && \
    npm install ajv@8.17.1 ajv-keywords@5.1.0 --force

# Copier le reste du projet
COPY . .

# Build de production
RUN npm run build

# ---- Étape 2 : nginx ----
FROM nginx:alpine

# Copier la configuration nginx (celle qu’on vient d’ajouter)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build React
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]