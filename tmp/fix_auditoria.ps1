$file = "C:\Users\servidor1\.gemini\antigravity\scratch\ERP-R-DE-RICO\apps\AuditoriaUI.jsx"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# 1. Añadir import de generateTicketHTML
$content = $content -replace "import React, \{ useState, useEffect \} from 'react';", "import React, { useState, useEffect } from 'react';`r`nimport { generateTicketHTML } from './pos/utils/ticketGenerator';"

# 2. Ordenar los tickets (hay dos ocurrencias de setTickets(Array.isArray(data) ? data : []))
$content = $content -replace "setTickets\(Array\.isArray\(data\) \? data : \[\]\);", "const arr = Array.isArray(data) ? data : [];`r`n            const sorted = arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));`r`n            setTickets(sorted);"

# 3. Función handlePrintTicket (agregar antes de handleSearch)
$printFunc = @"
    const handlePrintTicket = (ticketData) => {
        const html = generateTicketHTML(ticketData);
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 500);
    };

    const handleSearch = (e) => {
"@

$content = $content -replace "    const handleSearch = \(e\) => \{", $printFunc

# 4. Botón REIMPRIMIR TICKET
$btnCode = @"
                                </div>
                                <button 
                                    onClick={() => handlePrintTicket(selectedTicket)}
                                    className="w-full mt-6 bg-black hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_10px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_20px_rgba(234,88,12,0.4)] flex justify-center items-center gap-2"
                                >
                                    <span className="text-lg">🖨️</span> REIMPRIMIR TICKET
                                </button>
                            </div>
                        )}

                        {selectedCorte && (
"@

$content = $content -replace "                                </div\>`r`n                            </div\>`r`n                        \)}`r`n`r`n                        {selectedCorte && \(", $btnCode

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done!"
