export const generateTicketHTML = (ticketData) => {
    let dateObj = new Date();
    if (ticketData.created_at) {
        dateObj = new Date(String(ticketData.created_at).endsWith('Z') ? ticketData.created_at : ticketData.created_at + 'Z');
    }
    const printDate = dateObj.toLocaleDateString();
    const printTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const items = ticketData.items || [];
    const payments = ticketData.payment_details || [];
    
    let totalQty = 0; // Calculador de total artículos

    // Obtener nombres e IDs de todas las fuentes posibles
    const capturedBy = ticketData.captured_by_name || ticketData.captured_by?.name || 'SISTEMA';
    const cashedBy = ticketData.cashed_by_name || ticketData.cashed_by?.name || 'SISTEMA/AUTO';
    
    let itemsHtml = '';
    items.forEach(item => {
        const name = item.product?.name || item.name || 'Articulo';
        const qty = item.quantity || 1;
        totalQty += qty; 
        const price = item.unit_price || item.price || 0;
        itemsHtml += `
            <tr>
                <td style="width: 28px; font-weight: bold;">${qty}x</td>
                <td>
                    <div style="font-weight: bold; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${name}</div>
                    <div style="font-size: 12pt; font-weight: 900; color: #000;">$${price.toFixed(2)} c/u</div>
                </td>
                <td style="text-align: right; font-weight: bold; white-space: nowrap;">$${(price * qty).toFixed(2)}</td>
            </tr>
        `;
    });

    let paymentsHtml = '';
    payments.forEach(p => {
        if (p.method === 'EFECTIVO' && p.received != null) {
            const received = p.received || 0;
            const abonado = p.amount || 0;
            const cambio = p.cambio || 0;
            paymentsHtml += `
                <div style="margin-bottom: 2px;">
                    <div style="font-weight: bold;">${p.method}</div>
                    <div style="display: flex; justify-content: space-between; padding-left: 8px; font-size: 12pt;">
                        <span>Recibido:</span>
                        <span>$${received.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-left: 8px; font-size: 12pt;">
                        <span>Abonado:</span>
                        <span>$${abonado.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-left: 8px; font-size: 12pt;">
                        <span>Cambio:</span>
                        <span>$${cambio.toFixed(2)}</span>
                    </div>
                </div>
            `;
        } else {
            paymentsHtml += `
                <div style="display: flex; justify-content: space-between;">
                    <span>${p.method}</span>
                    <span>$${(p.amount || 0).toFixed(2)}</span>
                </div>
            `;
        }
    });

    return `
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                @page { size: 80mm auto; margin: 0; }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html, body {
                    font-family: 'Courier New', Courier, monospace;
                    width: 76mm;
                    padding: 0mm 1mm;
                    font-size: 14pt;
                    line-height: 1.35;
                    color: #000;
                    background: #fff;
                }
                .line { border-top: 1px dashed #000; margin: 4px 0; }
                .row { display: flex; justify-content: space-between; align-items: center; }
                .col { display: flex; flex-direction: column; }
                .bold { font-weight: bold; }
                .upper { text-transform: uppercase; }
                .center { text-align: center; }
                .small { font-size: 11pt; }
                .xsmall { font-size: 10pt; font-style: italic; }
                table { width: 100%; border-collapse: collapse; font-size: 13pt; }
                td { padding: 3px 0; vertical-align: top; }
                .audit { font-size: 11pt; text-transform: uppercase; margin-top: 6px; padding-top: 4px; border-top: 1px dashed #000; }
            </style>
        </head>
        <body>
            <!-- ENCABEZADO: logo grande con pixel rendering nativo + nombre -->
            <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 2px; margin-bottom: 4px;">
                <img src="/assets/logo.png" alt="Logo" style="width: 50px; height: 50px; object-fit: contain; image-rendering: pixelated; flex-shrink: 0;" />
                <div class="bold upper" style="font-size: 18pt; letter-spacing: 1px; line-height: 1;">R DE RICO</div>
            </div>

            <!-- Fecha, Hora y Número de cuenta al CENTRO  -->
            <div class="col bold center" style="font-size: 12pt; margin-bottom: 4px; align-items: center;">
                <div>CTA: ${ticketData.account_num || '---'}</div>
                <div style="font-weight: normal; margin-top: 2px;">${printDate} ${printTime}</div>
            </div>

            <div class="line"></div>

            <table style="margin: 4px 0;">
                <tbody>${itemsHtml}</tbody>
            </table>

            <div class="line"></div>

            <div class="row bold" style="font-size: 11pt; margin: 4px 0;">
                <span>TOTAL DE ARTICULOS:</span>
                <span>${totalQty}</span>
            </div>

            <div class="line"></div>

            <div class="row bold" style="font-size: 16pt; margin: 4px 0;">
                <span>TOTAL</span>
                <span>$${(ticketData.total || 0).toFixed(2)}</span>
            </div>

            <div style="margin: 4px 0; font-size: 12pt;">
                ${paymentsHtml}
            </div>

            <div class="audit">
                <div class="row bold"><span>CAPTURÓ:</span><span>${capturedBy}</span></div>
                <div class="row bold"><span>COBRÓ:</span><span>${cashedBy}</span></div>
                <div class="row xsmall"><span>Terminal:</span><span>${ticketData.terminal_id || 'T1'}</span></div>
            </div>

            <div class="center xsmall" style="margin-top: 6px; padding-top: 3px; border-top: 1px solid #ccc;">
                *** Disfrute su pan ***
            </div>
        </body>
        </html>
    `;
};
