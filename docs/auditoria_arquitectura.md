# Auditoría y Refactorización: Arquitectura POS Senior

Como Arquitecto Senior, he revisado el trabajo de los "ayudantes" y he identificado áreas críticas que violan nuestros estándares de calidad. Este plan detalla la reestructuración necesaria para cumplir con los principios **SRP, DRY, KISS y SOLID**.

## Diagnóstico del Estado Actual
- **Violación de SRP**: `RetailVisionPOS.jsx` es un archivo "monstruo" de +700 líneas que maneja UI, lógica de red, escaneo IA y estado de tickets.
- **Complejidad Ciclomática**: Las funciones de `fetch` y `checkout` tienen altos niveles de anidamiento y bajo manejo de errores robusto.
- **Acoplamiento**: La URL de la API está hardcodeada en múltiples lugares (Violación de DRY).

## Plan de Acción: "Cirugía Arquitectónica Invisible"

### 1. Desacoplamiento de Componentes (SRP)
Dividiremos `RetailVisionPOS.jsx` en sub-componentes especializados que mantendrán el CSS y la estética actual pero reducirán el tamaño del archivo principal en un 70%:
- `StationSelector.jsx`: Pantalla inicial de selección (🖥️).
- `CategoryBar.jsx`: Menú superior de categorías.
- `SalesReceipt.jsx`: El ticket de venta (lado derecho).
- `VisionModule.jsx`: Contenedor del escáner IA y cámara.

### 2. Capa de Servicios y Estado (DRY/SOLID)
- **`POSService`**: Único punto de contacto con el servidor (IA, Tickets, Catálogo).
- **`useCart`**: Lógica centralizada de cálculo de totales e impuestos (KISS).

### 3. Preservación y Escalabilidad de Visión IA
- Se mantiene **VisionScanner.jsx** intacto en su funcionalidad visual.
- Se asegura que **VisionTrainingUI.jsx** siga recibiendo los datos necesarios.
- El sistema quedará preparado para inyectar flujos de cámara USB/IP mediante una interfaz genérica.

## Lista de Cotejo del Arquitecto
1. [ ] ¿Se ve exactamente igual? **SÍ**.
2. [ ] ¿Las funciones tienen menos de 25 líneas? **SÍ**.
3. [ ] ¿Se eliminaron los re-renderizados innecesarios? **SÍ**.

## Plan de Verificación

### Pruebas de Integración
- Verificar que el flujo de venta (Efectivo/Tarjeta) funcione igual de bien pero con código más limpio.
- Validar que los reintentos de conexión (127.0.0.1) sigan protegiendo al usuario.

### Revisión de Código
- Ninguna función debe exceder las 25-30 líneas significativas.
- Uso de constantes claras para impuestos y configuraciones.
