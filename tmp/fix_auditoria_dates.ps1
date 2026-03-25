$file = "C:\Users\servidor1\.gemini\antigravity\scratch\ERP-R-DE-RICO\apps\AuditoriaUI.jsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Fix sorting datetimes
$content = $content.Replace("const sorted = arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));", "const sorted = arr.sort((a, b) => new Date(b.created_at + 'Z') - new Date(a.created_at + 'Z'));")

# Fix inline datetimes
$content = $content.Replace("new Date(t.created_at).toLocaleString()", "new Date(t.created_at + 'Z').toLocaleString()")
$content = $content.Replace("new Date(c.closed_at).toLocaleString()", "new Date(c.closed_at + 'Z').toLocaleString()")
$content = $content.Replace("new Date(selectedTicket.created_at).toLocaleString()", "new Date(selectedTicket.created_at + 'Z').toLocaleString()")
$content = $content.Replace("new Date(selectedCorte.closed_at).toLocaleString()", "new Date(selectedCorte.closed_at + 'Z').toLocaleString()")

# Fix button emoji
$content = $content.Replace("<span className=`"text-lg`">ðŸ–¨ï¸ </span> REIMPRIMIR TICKET", "<span className=`"text-lg`">🖨️</span> REIMPRIMIR TICKET")

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done fixing AuditoriaUI dates and icon"
