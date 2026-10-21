param(
    [int]$Port = 3000,
    [switch]$NoBrowser
)

# Resoudre avec certitude le repertoire racine du projet
$scriptDir = $PSScriptRoot
if (-not $scriptDir) {
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}
if (-not $scriptDir) {
    $scriptDir = (Get-Location).Path
}

# Detection automatique d'un port disponible si 3000 est deja utilise
$listener = $null
$maxAttempts = 15
$currentPort = $Port

for ($i = 0; $i -lt $maxAttempts; $i++) {
    try {
        $candidateListener = New-Object System.Net.HttpListener
        $candidateListener.Prefixes.Add("http://localhost:$currentPort/")
        $candidateListener.Start()
        $listener = $candidateListener
        $Port = $currentPort
        break
    } catch {
        if ($candidateListener) {
            $candidateListener.Close()
        }
        $currentPort++
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Error "Erreur : Impossible d'assigner un port HTTP local entre $Port et $($Port + $maxAttempts)."
    exit 1
}

$url = "http://localhost:$Port/"

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  CV & PORTFOLIO EN LIGNE - DEDE KARINE ORNELLA BENISSANH  " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " [OK] Serveur local actif sur : $url" -ForegroundColor Green
Write-Host " [OK] Repertoire du site      : $scriptDir" -ForegroundColor DarkGray
Write-Host " [INFO] Appuyez sur Ctrl+C pour fermer le serveur." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

# Ouverture automatique et immediate du navigateur par defaut
if (-not $NoBrowser) {
    Write-Host "Ouverture automatique du navigateur sur $url ..." -ForegroundColor Cyan
    try {
        Start-Process $url
    } catch {
        try {
            cmd.exe /c start "" $url
        } catch {
            Write-Warning "Veuillez ouvrir manuellement votre navigateur sur $url"
        }
    }
}

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".png"   = "image/png"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".webp"  = "image/webp"
    ".pdf"   = "application/pdf"
    ".woff"  = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"   = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($path)) {
            $path = "index.html"
        }

        # Securite & normalisation du chemin
        $normalizedSubPath = [System.IO.Path]::GetFullPath((Join-Path $scriptDir $path))
        if (-not $normalizedSubPath.StartsWith($scriptDir, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("403 Acces refuse")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        $localFile = $normalizedSubPath

        if (Test-Path $localFile -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFile).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }

            # En-tetes pour developpement fluide
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")

            $bytes = [System.IO.File]::ReadAllBytes($localFile)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Page non trouvee")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.Close()
    }
} catch [System.Net.HttpListenerException] {
    # Arrêt normal du listener
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        $listener.Close()
    }
}
