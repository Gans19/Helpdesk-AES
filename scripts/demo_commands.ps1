Write-Host "=== HelpDesk Lite Demo ===" -ForegroundColor Cyan
Write-Host "Using backend package.json scripts to migrate and seed the database." -ForegroundColor Gray

Push-Location ..\backend

Write-Host "`n-> Installing dependencies (skipping if already installed)..." -ForegroundColor Yellow
npm install | Out-Null

Write-Host "-> Running migrations..." -ForegroundColor Yellow
npm run migrate

Write-Host "-> Seeding database..." -ForegroundColor Yellow
npm run seed

Pop-Location

Write-Host "`nAll done! Start the backend with 'npm --prefix backend run dev' and the frontend with 'npm --prefix frontend run dev'." -ForegroundColor Green

