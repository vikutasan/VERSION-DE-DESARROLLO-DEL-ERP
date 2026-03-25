$file = "C:\Users\servidor1\.gemini\antigravity\scratch\ERP-R-DE-RICO\apps\AuditoriaUI.jsx"
$lines = Get-Content $file -Encoding UTF8
for ($i=0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "REIMPRIMIR TICKET") {
        $lines[$i] = '                                    <span className="text-lg">🖨️</span> REIMPRIMIR TICKET'
    }
}
[System.IO.File]::WriteAllLines($file, $lines, [System.Text.Encoding]::UTF8)
Write-Host "Done fixing UI button line."
