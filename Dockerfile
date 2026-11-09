# NOQOOD marketing website. A separate image and a separate service from the ERP. Prepared only: NOT deployed.
# Node 24 provides the built-in SQLite module (node:sqlite) used by this site.
FROM node:24-bookworm-slim
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
# The build only needs a throw-away database and secret; real values come from the service's environment at run time.
RUN WEBSITE_DB=/tmp/build.db SESSION_SECRET=build-only-secret-not-used-at-runtime-000000 npx tsx scripts/migrate.ts \
 && WEBSITE_DB=/tmp/build.db SESSION_SECRET=build-only-secret-not-used-at-runtime-000000 npm run build
# The website database (content and CRM leads) lives on its OWN volume, mounted at /data. Never share the ERP volume.
ENV WEBSITE_DB=/data/noqood-website.db PORT=3100
EXPOSE 3100
CMD ["sh", "-c", "npx tsx scripts/migrate.ts && npx next start -p ${PORT}"]
