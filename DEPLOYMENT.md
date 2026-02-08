# 🚀 DEPLOYMENT — GCP Cloud Run + Supabase + GitHub Actions

---

## Infrastructure Overview

```
GitHub Repo
    │
    ├── Push to main → GitHub Actions CI/CD
    │                      │
    │                      ├── Build Docker image
    │                      ├── Push to GCP Artifact Registry
    │                      └── Deploy to Cloud Run
    │
    └── Supabase (managed)
         ├── PostgreSQL database
         ├── Realtime (future)
         └── REST API (auto-generated)
```

---

## 1. Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `lego-quest`
3. Region: Choose closest to your location
4. Generate a strong database password → save it

### Get Credentials
From Project Settings → API:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (for migrations only, never expose)

### Run Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push

# Seed data (monsters, abilities, default config)
supabase db seed
```

### Configure RLS
Since this is single-user, enable RLS with permissive policies:
```sql
-- Run in Supabase SQL editor
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON game_config FOR ALL USING (true) WITH CHECK (true);
-- Repeat for all tables
```

---

## 2. GCP Setup

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed
- A GCP project created

### Enable APIs
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### Create Artifact Registry
```bash
gcloud artifacts repositories create lego-quest \
  --repository-format=docker \
  --location=us-central1 \
  --description="LEGO QUEST Docker images"
```

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8080

CMD ["node", "server.js"]
```

### Next.js Config for Standalone

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### Deploy Manually (First Time)
```bash
# Build and push image
gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT/lego-quest/app:latest

# Deploy to Cloud Run
gcloud run deploy lego-quest \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT/lego-quest/app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co" \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx" \
  --set-env-vars "ANTHROPIC_API_KEY=sk-ant-xxx" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --concurrency 80
```

### Custom Domain (Optional)
```bash
gcloud run domain-mappings create \
  --service lego-quest \
  --domain quest.yourdomain.com \
  --region us-central1
```

---

## 3. GitHub Repository Setup

### Create Repo
```bash
gh repo create lego-quest --private --clone
cd lego-quest
```

### Branch Strategy
- `main` — production, auto-deploys to Cloud Run
- `dev` — development branch, PR to main
- Feature branches off `dev`

### Secrets (GitHub → Settings → Secrets)

| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_SA_KEY` | Service account JSON key (base64 encoded) |
| `GCP_REGION` | `us-central1` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ANTHROPIC_API_KEY` | Claude API key |

### GCP Service Account
```bash
# Create service account
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Actions Deploy"

# Grant permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT \
  --member="serviceAccount:github-deploy@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT \
  --member="serviceAccount:github-deploy@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT \
  --member="serviceAccount:github-deploy@YOUR_PROJECT.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-deploy@YOUR_PROJECT.iam.gserviceaccount.com

# Base64 encode for GitHub secret
cat key.json | base64 > key_b64.txt
# Copy contents of key_b64.txt to GCP_SA_KEY secret
```

---

## 4. GitHub Actions Workflows

### CI — Lint & Type Check

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, dev]
  push:
    branches: [dev]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

### Deploy — GCP Cloud Run

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: ${{ secrets.GCP_REGION }}
  SERVICE: lego-quest
  IMAGE: us-central1-docker.pkg.dev/${{ secrets.GCP_PROJECT_ID }}/lego-quest/app

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - uses: google-github-actions/setup-gcloud@v2

      - run: gcloud auth configure-docker us-central1-docker.pkg.dev

      - name: Build and push
        run: |
          docker build -t $IMAGE:${{ github.sha }} -t $IMAGE:latest .
          docker push $IMAGE:${{ github.sha }}
          docker push $IMAGE:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE \
            --image $IMAGE:${{ github.sha }} \
            --platform managed \
            --region $REGION \
            --allow-unauthenticated \
            --set-env-vars "\
              NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }},\
              NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }},\
              ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }}" \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 2
```

---

## 5. Local Development

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/lego-quest.git
cd lego-quest

# Install dependencies
npm install

# Set up local env
cp .env.example .env.local
# Edit .env.local with your Supabase and Anthropic credentials

# Option A: Use remote Supabase
npm run dev

# Option B: Use local Supabase (recommended for dev)
npx supabase start        # Starts local Supabase (Docker required)
npx supabase db push       # Apply migrations
npx supabase db seed       # Seed data
npm run dev

# Access on iPad (same WiFi)
# Find your local IP: ifconfig | grep inet
# Open Safari on iPad: http://192.168.x.x:3000
```

---

## 6. PWA Configuration

For "Add to Home Screen" on iPad:

```json
// public/manifest.json
{
  "name": "LEGO QUEST",
  "short_name": "LEGO QUEST",
  "description": "Digital GM Toolkit for LEGO QUEST tabletop RPG",
  "start_url": "/",
  "display": "standalone",
  "orientation": "landscape",
  "background_color": "#1a1a2e",
  "theme_color": "#e94560",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Add to `layout.tsx`:
```tsx
export const metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LEGO QUEST',
  },
};
```

---

## Cost Estimates

| Service | Free Tier | Expected Monthly Cost |
|---------|-----------|----------------------|
| Supabase | 500MB DB, 1GB transfer | $0 (free tier) |
| GCP Cloud Run | 2M requests, 360K vCPU-sec | $0–5 (very low traffic) |
| Claude API | Pay per token | ~$1–3/month (2–4 sessions) |
| GitHub | Unlimited private repos | $0 |
| **Total** | | **~$1–5/month** |
