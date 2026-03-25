$ErrorActionPreference = "Continue"
Write-Host "Iniciando importacion..."
$jsonContent = Get-Content -Raw -Encoding UTF8 "importar_productos_AQUI.json"
$data = $jsonContent | ConvertFrom-Json

$baseUrl = "http://127.0.0.1:3001/api/v1/catalog"

$cats = @{}

# Fetch existing categories if any
try {
    $existing = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Get
    foreach ($c in $existing) {
        $cats[$c.name] = $c.id
    }
} catch {
    Write-Host "No se pudieron obtener categorias previas"
}

foreach ($p in $data) {
    $catName = $p.category
    if ($null -ne $catName -and -not $cats.ContainsKey($catName)) {
        try {
            $body = @{ name = $catName; vision_enabled = $true } | ConvertTo-Json
            $res = Invoke-RestMethod -Uri "$baseUrl/categories" -Method Post -Body $body -ContentType "application/json"
            $cats[$catName] = $res.id
            Write-Host "Categoria creada: $catName -> $($res.id)"
        } catch {
            Write-Host "Error creando categoria $catName"
        }
    }
}

$count = 0
foreach ($p in $data) {
    if ($null -eq $p.category) { continue }
    $catId = $cats[$p.category]
    if ($null -eq $catId) { continue }
    
    $price = [double]$p.price
    $bodyObj = @{
        sku = [string]$p.sku
        name = $p.name
        price = $price
        category_id = $catId
        barcode = [string]$p.sku
        active = $true
    }
    $body = $bodyObj | ConvertTo-Json
    try {
        $res = Invoke-RestMethod -Uri "$baseUrl/products" -Method Post -Body $body -ContentType "application/json"
        $count++
    } catch {
        # Silent ignore for duplicates
    }
}
Write-Host "Completado. $count productos insertados."
