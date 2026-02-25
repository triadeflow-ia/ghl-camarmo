# Setup repo GHL Camarmo — rodar do PowerShell
$SRC = "C:\Users\Alex Campos"
$DEST = "C:\Users\Alex Campos\ghl-camarmo"

# Criar pastas
New-Item -ItemType Directory -Force -Path "$DEST\scripts"
New-Item -ItemType Directory -Force -Path "$DEST\outputs"

# Copiar status files e docs
Copy-Item "$SRC\ghl-camargo-status-v1.md" "$DEST\" -Force
if (Test-Path "$SRC\ghl-workflows-camargo.md") { Copy-Item "$SRC\ghl-workflows-camargo.md" "$DEST\" -Force }

# Copiar scripts
$scripts = @("ghl-phase2.js", "ghl-fix.js", "ghl-create-users.js", "ghl-round-robin.js", "ghl-cleanup.js")
foreach ($s in $scripts) {
    if (Test-Path "$SRC\$s") { Copy-Item "$SRC\$s" "$DEST\scripts\" -Force; Write-Host "  Copiado: $s" }
    else { Write-Host "  Nao encontrado: $s" }
}

# Copiar outputs
$outputs = @("ghl-phase2-output.json", "ghl-fix-output.json", "ghl-create-users-output.json", "ghl-round-robin-output.json", "ghl-cleanup-output.json")
foreach ($o in $outputs) {
    if (Test-Path "$SRC\$o") { Copy-Item "$SRC\$o" "$DEST\outputs\" -Force; Write-Host "  Copiado: $o" }
    else { Write-Host "  Nao encontrado: $o" }
}

# Git init + commit
Set-Location $DEST
git init
git add -A
git commit -m "feat: GHL Grupo Camarmo CRM V1 completo

- 44 custom fields, 26 tags, 5 pipelines
- 8 workflows publicados e testados
- 5 usuarios criados + Round Robin configurado
- Acoes Create Opportunity configuradas
- Status file, specs e scripts de implementacao

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

# Criar repo no GitHub e push
gh repo create triadeflow-ia/ghl-camarmo --private --source=. --push

Write-Host ""
Write-Host "========================================"
Write-Host "  REPO CRIADO E PUSH COMPLETO!"
Write-Host "  https://github.com/triadeflow-ia/ghl-camarmo"
Write-Host "========================================"
