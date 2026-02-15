param(
  [Parameter(Mandatory = $true)]
  [string]$Token,

  [string]$ApiBaseUrl = "https://api.zood.ai/api/v1/"
)

$ErrorActionPreference = "Stop"

function Ensure-TrailingSlash {
  param([string]$Url)
  if ($Url.EndsWith("/")) { return $Url }
  return "$Url/"
}

function Resolve-IdFromResponse {
  param($Response)
  if ($null -eq $Response) { return $null }
  if ($Response.id) { return $Response.id }
  if ($Response.data -and $Response.data.id) { return $Response.data.id }
  if ($Response.data -and $Response.data.data -and $Response.data.data.id) { return $Response.data.data.id }
  return $null
}

function Invoke-ApiJson {
  param(
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers,
    $Body
  )

  $jsonBody = $Body | ConvertTo-Json -Depth 15
  return Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -Body $jsonBody
}

$baseUrl = Ensure-TrailingSlash -Url $ApiBaseUrl
$headers = @{
  "Authorization" = "Bearer $Token"
  "Content-Type"  = "application/json"
  "Accept"        = "application/json"
}

# Simple tiny PNG data URLs (different colors) for demo seeding.
$imgBlue  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAgMBAQEAO48AAAAASUVORK5CYII="
$imgGreen = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAwMBAXxYf4sAAAAASUVORK5CYII="
$imgRed   = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AABQMBgWWM9L8AAAAASUVORK5CYII="
$imgGray  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP4DwQACfsD/a5gr2gAAAAASUVORK5CYII="

$categories = @(
  @{ name = "Beverages"; name_localized = "Beverages"; image = $imgBlue  },
  @{ name = "Desserts";  name_localized = "Desserts";  image = $imgGreen },
  @{ name = "Electronics"; name_localized = "Electronics"; image = $imgRed }
)

$createdCategoryIds = @{}
Write-Host "Seeding categories..." -ForegroundColor Cyan

foreach ($cat in $categories) {
  $response = Invoke-ApiJson `
    -Method "POST" `
    -Url ($baseUrl + "menu/categories") `
    -Headers $headers `
    -Body $cat

  $catId = Resolve-IdFromResponse -Response $response
  if (-not $catId) {
    Write-Host "Could not resolve ID for category: $($cat.name)" -ForegroundColor Yellow
    continue
  }

  $createdCategoryIds[$cat.name_localized] = $catId
  Write-Host "Created category: $($cat.name) (ID: $catId)" -ForegroundColor Green
}

if ($createdCategoryIds.Count -eq 0) {
  throw "No categories were created. Check token permissions or API response format."
}

function New-Sku {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers
  )

  try {
    $skuRes = Invoke-ApiJson `
      -Method "POST" `
      -Url ($BaseUrl + "manage/generate_sku") `
      -Headers $Headers `
      -Body @{ model = "products" }

    $rawSku = $null
    if ($skuRes.data) { $rawSku = $skuRes.data }
    if ($skuRes.data -and $skuRes.data.data) { $rawSku = $skuRes.data.data }
    if ($skuRes.data -and $skuRes.data.sku) { $rawSku = $skuRes.data.sku }
    if ($skuRes.sku) { $rawSku = $skuRes.sku }

    if ($rawSku) { return "sk-$rawSku" }
  } catch {
    # Fallback below
  }

  return "sk-" + ([Guid]::NewGuid().ToString("N").Substring(0, 10))
}

$products = @(
  @{
    name            = "Mineral Water 330ml"
    name_localized  = "Mineral Water 330ml"
    description     = "Small bottled water."
    price           = "2.50"
    quantity        = "120"
    category_key    = "Beverages"
    image           = $imgBlue
  },
  @{
    name            = "Chocolate Cake Slice"
    name_localized  = "Chocolate Cake Slice"
    description     = "Fresh cake slice."
    price           = "9.00"
    quantity        = "40"
    category_key    = "Desserts"
    image           = $imgGreen
  },
  @{
    name            = "Wireless Earbuds"
    name_localized  = "Wireless Earbuds"
    description     = "Bluetooth earbuds for daily use."
    price           = "149.00"
    quantity        = "25"
    category_key    = "Electronics"
    image           = $imgRed
  },
  @{
    name            = "Fast Charger 20W"
    name_localized  = "Fast Charger 20W"
    description     = "Fast USB-C charger."
    price           = "59.00"
    quantity        = "35"
    category_key    = "Electronics"
    image           = $imgGray
  }
)

Write-Host "`nSeeding products..." -ForegroundColor Cyan

foreach ($prod in $products) {
  $catId = $createdCategoryIds[$prod.category_key]
  if (-not $catId) {
    Write-Host "Skipping product '$($prod.name)' because category key '$($prod.category_key)' is missing." -ForegroundColor Yellow
    continue
  }

  $payload = @{
    name             = $prod.name
    name_localized   = $prod.name_localized
    description      = $prod.description
    price            = $prod.price
    sku              = New-Sku -BaseUrl $baseUrl -Headers $headers
    quantity         = $prod.quantity
    category_id      = [string]$catId
    image            = $prod.image
    is_stock_product = $true
    costing_method   = 2
    cost             = 0
    pricing_method   = 1
    selling_method   = 1
  }

  $response = Invoke-ApiJson `
    -Method "POST" `
    -Url ($baseUrl + "menu/products") `
    -Headers $headers `
    -Body $payload

  $prodId = Resolve-IdFromResponse -Response $response
  if ($prodId) {
    Write-Host "Created product: $($prod.name) (ID: $prodId)" -ForegroundColor Green
  } else {
    Write-Host "Created product: $($prod.name) (ID not returned)" -ForegroundColor Yellow
  }
}

Write-Host "`nDone: categories and products seeded with images." -ForegroundColor Cyan
