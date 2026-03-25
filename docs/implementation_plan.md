# Implementación de Módulo de Cobro Dinámico

Este plan detalla la transformación del indicador de total estático en un botón de acción dinámico y la creación de una pantalla dedicada para el procesamiento de pagos, manteniendo la integridad visual del POS.

## User Review Required

> [!IMPORTANT]
> Se sustituirán los botones actuales de "Efectivo" y "Tarjeta" en el ticket por el nuevo botón unificado "COBRAR". Los métodos de pago se seleccionarán dentro de la nueva pantalla de cobro.

## Proposed Changes

### [Frontend - POS]

---

#### [MODIFY] [SalesReceipt.jsx](file:///c:/Users/Pollo/Downloads/ERP R DE RICO/apps/pos/components/SalesReceipt.jsx)
- Reemplazar la sección de "Total a Pagar" por un botón de gran tamaño con estilo premium.
- El botón mostrará dinámicamente el texto `COBRAR $[TOTAL]`.
- Ocultar/Remover los botones rápidos de Efectivo/Tarjeta para limpiar la interfaz y centralizar el flujo.

#### [MODIFY] [CheckoutScreen.jsx](file:///c:/Users/Pollo/Downloads/ERP R DE RICO/apps/pos/components/CheckoutScreen.jsx)
- Implementar estado de `payments` para rastrear múltiples abonos.
- Añadir lógica de "Saldo Pendiente" para permitir pagos parciales.
- Incorporar sub-selectores para Tarjeta (Débito, Crédito, QR).
- El botón de "Finalizar" se activará solo cuando el saldo sea cero o menor.

#### [MODIFY] [RetailVisionPOS.jsx](file:///c:/Users/Pollo/Downloads/ERP R DE RICO/apps/pos/RetailVisionPOS.jsx)
- Adaptar la función de persistencia para recibir el desglose de métodos de pago (necesario para reportes de cierre de caja).
- Implementar componente oculto de Impresión con estilos `@media print` optimizados.

### [Optimización de Impresión]

---

#### [NEW] [TicketTemplate.jsx](file:///c:/Users/Pollo/Downloads/ERP R DE RICO/apps/pos/components/TicketTemplate.jsx)
- Diseñar estructura HTML mínima para impresión térmica.
- Configurar CSS para ahorrar papel: fuentes pequeñas, márgenes nulos, interlineado compacto.
- Formato de línea única por producto: `[Cant] [Nombre Producto] $[Subtotal]`.

#### [MODIFY] [Flujo de Impresión Opcional]
- **RetailVisionPOS.jsx**: Separar la creación del ticket (`handleTicketAction`) de la limpieza del UI. Crear método `handlePrintTicket` independiente.
- **CheckoutScreen.jsx**: Introducir el botón "LIQUIDAR CUENTA", que al ser exitoso bloquea el cobro y revela un nuevo botón "IMPRIMIR TICKET".
- **Selección de Impresora**: Se aprovecha el diálogo nativo del navegador que `window.print()` detona para que el operario pueda elegir la impresora.

#### [NEW] [Flujo: Cantidades Masivas (UX Invisible)]
- **SalesReceipt.jsx**: Hacer que el texto de cantidad de la lista de productos del ticket (ej. `1x`) sea un botón interactivo.
- **Interacción**: Al dar "tap" en ese `1x`, el sistema mostrará un cuadro de diálogo (Prompt) o un Mini-Teclado Numérico.
- **useCart.js**: Implementar un método `updateQuantity(productId, newQuantity)` para que al ingresar "50", el carrito se actualice instantáneamente sin añadir nuevos items ni dar 50 taps.
- **Resultado**: Cero botones nuevos en la pantalla principal. Funcionalidad descubrible y profesional.

#### [NEW] [Flujo: Impresión Silenciosa (Kiosk Print)]
- **Problema de Seguridad Web**: Los navegadores (Chrome, Edge) jamás permiten imprimir sin diálogo de confirmación por seguridad térmica nativa (HTML5).
- **RetailVisionPOS.jsx**: Modificar `handlePrintTicket` para usar un `iframe` oculto en vez de `window.open`. Esto evita flashes de ventanas emergentes.
- **Configuración de Hardware**: El usuario debe configurar su navegador POS con la bandera del sistema operativo `--kiosk-printing` para que el navegador confíe en el ERP y mande los datos directo al spooler.

#### [NEW] [Optimización Visual de Tarjetas de Producto]
- **Objetivo**: Maximizar la visualización de la imagen, el nombre y el precio del producto sin alterar la estructura ni el resto del layout de la suite de cobro.
- **RetailVisionPOS.jsx (`ProductCard`)**:
  - **Imagen**: Reducir el padding interno de la tarjeta (de `p-6` a `p-3` o `p-4`) y aumentar la caja de la imagen (de `w-24 h-24` a `w-32 h-32` o similar) permitiendo que abarque más área.
  - **Nombre**: Subir el tamaño de la tipografía (de `text-[10px]` a `text-xs` o `text-sm`), usar `leading-tight` para mejor lectura.
  - **Precio**: Convertirlo en una "etiqueta" (capsule) de alto contraste. Ej: un fondo verde vivo con letra oscura, o fondo oscuro con letra verde neón brillante (`bg-[#c1d72e] text-black rounded-full px-3 py-1`).

## Verification Plan

### Automated Tests
- Verificar via Browser que el botón "COBRAR" se actualiza al añadir productos.
- Validar que al hacer clic se abre el overlay de pago.
- Probar el cálculo de cambio con diferentes montos.

### Manual Verification
- Confirmar que la estética del nuevo botón y la pantalla de cobro "WOW" al usuario (vibrante, premium).
- Asegurar que no hay regresiones en la funcionalidad de "Abrir Nueva Cuenta".
