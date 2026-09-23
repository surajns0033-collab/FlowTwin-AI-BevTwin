# FlowTwin AI - Google Cloud Run PowerShell Deployment Script
param (
    [string]$ProjectId = ""
)

if (-not $ProjectId) {
    $ProjectId = (& "C:\Users\SURAJ\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" config get-value project 2>$null)
}

if (-not $ProjectId) {
    Write-Warning "No GCP Project ID provided. Usage: .\deploy.ps1 -ProjectId your-gcp-project-id"
    return
}

$Region = "us-central1"
$ServiceName = "flowtwin-ai"
$ImageTag = "gcr.io/$ProjectId/${ServiceName}:latest"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Deploying FlowTwin AI to Google Cloud Run" -ForegroundColor Green
Write-Host "Project: $ProjectId"
Write-Host "Region:  $Region"
Write-Host "Image:   $ImageTag"
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "1. Enabling required Google Cloud APIs..." -ForegroundColor Yellow
& "C:\Users\SURAJ\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    containerregistry.googleapis.com `
    firestore.googleapis.com `
    storage.googleapis.com `
    aiplatform.googleapis.com

Write-Host "2. Submitting build to Google Cloud Build..." -ForegroundColor Yellow
& "C:\Users\SURAJ\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" builds submit --tag $ImageTag .

Write-Host "3. Deploying to Google Cloud Run..." -ForegroundColor Yellow
& "C:\Users\SURAJ\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" run deploy $ServiceName `
    --image $ImageTag `
    --platform managed `
    --region $Region `
    --allow-unauthenticated `
    --memory 2Gi `
    --cpu 2 `
    --min-instances 1 `
    --max-instances 10 `
    --set-env-vars NODE_ENV=production,GOOGLE_CLOUD_PROJECT=$ProjectId,GEMINI_MODEL=gemini-3.8-flash

Write-Host "4. Seeding Firestore Collections..." -ForegroundColor Yellow
python cloud/firestore_sync.py

Write-Host "Deployment completed!" -ForegroundColor Green
& "C:\Users\SURAJ\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" run services describe $ServiceName --platform managed --region $Region --format="value(status.url)"
