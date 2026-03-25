$file = "C:\Users\servidor1\.gemini\antigravity\scratch\ERP-R-DE-RICO\apps\AuditoriaUI.jsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)
$content = [regex]::Replace($content, '<span className="text-lg">.*?</span> REIMPRIMIR TICKET', '<span className="text-lg">🖨️</span> REIMPRIMIR TICKET')
[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done"
