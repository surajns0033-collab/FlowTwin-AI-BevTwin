#!/usr/bin/env bash
# FlowTwin AI - Google Cloud Run Deployment Script
set -e

PROJECT_ID="${1:-$(gcloud config get-value project)}"
REGION="us-central1"
SERVICE_NAME="flowtwin-ai"
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"

echo "=========================================="
echo "Deploying FlowTwin AI to Google Cloud Run"
echo "Project: ${PROJECT_ID}"
echo "Region:  ${REGION}"
echo "Image:   ${IMAGE_TAG}"
echo "=========================================="

if [ -z "$PROJECT_ID" ]; then
    echo "Error: No Google Cloud Project ID detected. Set via: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "1. Enabling required Google Cloud APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com \
    firestore.googleapis.com \
    storage.googleapis.com \
    aiplatform.googleapis.com

echo "2. Submitting build to Google Cloud Build..."
gcloud builds submit --tag "${IMAGE_TAG}" .

echo "3. Deploying container to Google Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
    --image "${IMAGE_TAG}" \
    --platform managed \
    --region "${REGION}" \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --min-instances 1 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT="${PROJECT_ID}",GEMINI_MODEL=gemini-3.8-flash

echo "4. Seeding Firestore Collections..."
python cloud/firestore_sync.py

echo "Deployment completed successfully! Service URL:"
gcloud run services describe "${SERVICE_NAME}" --platform managed --region "${REGION}" --format="value(status.url)"
