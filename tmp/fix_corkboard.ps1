$file = "C:\Users\servidor1\.gemini\antigravity\scratch\ERP-R-DE-RICO\apps\pos\RetailVisionPOS.jsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$old1 = "if (showCorkboard) {`r`n            posService.getOpenTickets()"
$new1 = "if (!showCorkboard) return;`r`n`r`n        const fetchOpenAccounts = () => {`r`n            posService.getOpenTickets()"
$content = $content.Replace($old1, $new1)

$old2 = "            }).catch(console.error);`r`n        }`r`n    }, [showCorkboard]);"
$new2 = "            }).catch(console.error);`r`n        };`r`n`r`n        fetchOpenAccounts();`r`n        const interval = setInterval(fetchOpenAccounts, 5000);`r`n        return () => clearInterval(interval);`r`n    }, [showCorkboard]);"
$content = $content.Replace($old2, $new2)

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done"
