# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copiamos los archivos de dependencias e instalamos.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiamos el resto del código fuente.
COPY . .

# Ejecutamos el script de build de Astro para generar los archivos estáticos y el servidor.
RUN npm run build

# --- Etapa 2: Servidor de Producción (Optimizado para Astro SSR) ---
FROM node:20-alpine AS serve-stage

WORKDIR /app

# Copiamos solo los archivos necesarios de la etapa de construcción
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/package.json ./package.json
COPY --from=build-stage /app/node_modules ./node_modules

# Astro SSR por defecto escucha en el puerto 4321
EXPOSE 8080

# Comando para iniciar el servidor de Astro en el puerto 8080
CMD ["sh", "-c", "PORT=8080 node dist/server/entry.mjs"]
