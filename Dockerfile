# ---------- STAGE 1 : BUILD ----------
FROM node:22-alpine AS builder

# Dossier de travail
WORKDIR /app

# pnpm via corepack
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.18.3 --activate

# Copier uniquement les fichiers de dépendances pour profiter du cache Docker
COPY package.json pnpm-lock.yaml* ./

# Installer les dépendances (sans modifier le lockfile)
RUN pnpm install --frozen-lockfile

# Copier le reste du projet
COPY . .

# Désactiver la télémétrie Nuxt
ENV NUXT_TELEMETRY_DISABLED=1

# Build Nuxt (SSR)
RUN pnpm build

# ---------- STAGE 2 : RUNTIME ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1

# Port utilisé par Nitro/Nuxt
ENV PORT=3000
ENV NITRO_PORT=3000
EXPOSE 3000

# Copier seulement le build final
COPY --from=builder /app/.output ./.output

# Lancer le serveur Nitro
CMD ["node", ".output/server/index.mjs"]
