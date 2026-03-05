# Deploy GitHub Pages — Grupo Camarmo Apresentacao
# Roda no PowerShell: .\deploy-pages.ps1

Set-Location "C:\Users\Alex Campos\ghl-camarmo"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DEPLOY: grupocamarmo.triadeflow.ai" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Commit novos arquivos
Write-Host "[1/4] Commitando index.html + CNAME..." -ForegroundColor Yellow
git add index.html CNAME apresentacao-v1.html
git commit -m "feat: add GitHub Pages deploy (index.html + CNAME)

- index.html para servir via GitHub Pages
- CNAME para custom domain grupocamarmo.triadeflow.ai
- Logos Triadeflow + Camarmo no hero
- Canais de comunicacao (WhatsApp + Instagram)

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# 2. Push para GitHub
Write-Host "[2/4] Pushing para GitHub..." -ForegroundColor Yellow
git push origin master

# 3. Ativar GitHub Pages via gh CLI
Write-Host "[3/4] Ativando GitHub Pages..." -ForegroundColor Yellow
gh api repos/triadeflow-ia/ghl-camarmo/pages -X POST -f "source[branch]=master" -f "source[path]=/" 2>$null
if ($LASTEXITCODE -ne 0) {
    # Pode ja estar ativo, tenta update
    gh api repos/triadeflow-ia/ghl-camarmo/pages -X PUT -f "source[branch]=master" -f "source[path]=/" -f "cname=grupocamarmo.triadeflow.ai" 2>$null
}

# 4. Configurar custom domain
Write-Host "[4/4] Configurando custom domain..." -ForegroundColor Yellow
gh api repos/triadeflow-ia/ghl-camarmo/pages -X PUT -f "cname=grupocamarmo.triadeflow.ai" 2>$null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  GITHUB PAGES ATIVADO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  URL padrao: https://triadeflow-ia.github.io/ghl-camarmo/" -ForegroundColor White
Write-Host "  Custom URL: https://grupocamarmo.triadeflow.ai" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  PASSO MANUAL NECESSARIO:" -ForegroundColor Yellow
Write-Host "  Adicionar CNAME no Cloudflare DNS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Type:    CNAME" -ForegroundColor White
Write-Host "  Name:    grupocamarmo" -ForegroundColor White
Write-Host "  Target:  triadeflow-ia.github.io" -ForegroundColor White
Write-Host "  Proxy:   DNS only (cinza, NAO laranja)" -ForegroundColor Red
Write-Host ""
Write-Host "  Cloudflare > triadeflow.ai > DNS > Add Record" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
