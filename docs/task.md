# Task Checklist: Recuperación y Estabilización del Sistema

## Fase 1-7: Infraestructura y Monolito FastAPI (Restaurado)
- [x] Eliminar backend Javascript obsoleto.
- [x] Crear esqueleto del proyecto Python y configurar Docker.
- [x] Implementar Modelos de Catálogo y POS en SQLAlchemy.
- [x] Crear endpoints REST y esquemas Pydantic.

## Fase 8-10: Sincronización API y Estabilidad Frontal (Recuperado)
- [x] Corregir colapso de UI (Pantalla negra) mediante ErrorBoundary global.
- [x] Refactorizar `RetailVisionPOS.jsx` para consumo de API real.
- [x] Refactorizar `ProductMasterUI.jsx` para sincronización API asíncrona (CRUD directo a DB).
- [x] Implementar guardas de nulidad para evitar errores de renderizado.

## Fase 11: Gestión Segura de Datos (Finalizado)
- [x] Eliminar funciones de borrado masivo por seguridad.
- [x] Implementar importación JSON puramente aditiva (no destructiva).
- [x] Validar que nuevas importaciones no generen duplicados exactos.

## Fase 13: Operación Distribuida y Coordinada
- [x] Implementar botón "ABRIR NUEVA CUENTA" con persistencia en DB.
- [x] Establecer lógica de segregación de pizarrones (Caja ve todo, Terminales solo lo propio).
- [x] Eliminar alertas intrusivas para agilizar la operación.
- [x] Corregir recuperación de artículos para evitar tickets vacíos al restaurar cuentas.

## Fase 14: Optimización de Navegación del Catálogo
## Fase 14: Auditoría de Código y Arquitectura Senior (DESCARTADA / ROLLBACK)
- [x] Eliminar botón "TODOS" de la interfaz para mejorar estabilidad.
- [x] Configurar carga automática de la primera categoría disponible al iniciar.
- [x] Forzar paginación de 12 items en categorías específicas.
- [x] Restaurar terminal "CAJA" en la pantalla de selección de estación (Posición Final e icono Estándar).
- [x] Verificar y restaurar conectividad con el Backend (API - 127.0.0.1 + Retries).

## Fase 15: Implementación de la Visión de Arquitecto (DESCARTADA / ROLLBACK)
- [x] Implementar Capa de Servicio API unificada (`POSService`).
- [x] Fragmentar `RetailVisionPOS.jsx` en componentes (SRP).
- [x] Refactorizar lógica del Carrito y Ventas (KISS/Early Returns).
- [x] Validar integridad de módulos de Visión e IA.

## Fase 16: Módulo de Cobro Inteligente (DESCARTADA / ROLLBACK)
- [ ] Diseñar component `CheckoutModule.jsx` (Calculadora de cambio).
- [ ] Refactorizar `SalesReceipt.jsx` para integrar el botón dinámico "COBRAR [TOTAL]".
- [ ] Implementar animaciones de transición entre el POS y la pantalla de pago.
- [ ] Validar flujo completo: Carrito -> Pago -> Persistencia en DB -> Ticket Final.

## Fase 20: Auditoría y Saneamiento Senior (Informe)
- [x] Análisis profundo de `RetailVisionPOS.jsx` bajo principios SRP/DRY/KISS.
- [x] Identificación de duplicidades en manejo de sesiones y tickets.
- [x] Generación de Informe de Auditoría Detallado (`informe_auditoria_senior.md`).
- [ ] Revisión del informe con el Arquitecto Senior (Usuario).

## Fase 21: Ejecución de "Cirugía Invisible" (Refactorización)
- [x] Creación de `config.js` y `POSService.js` (Desacoplamiento).
- [x] Extracción de Hook `useCart` (Lógica de inventario/precios).
- [x] Extracción de Hook `useVision` (Hardware agnóstico para cualquier cámara).
- [x] Fragmentación de `RetailVisionPOS.jsx` en sub-componentes (SalesReceipt, CategoryBar, VisionVisor).
- [x] Asegurar **Identidad Funcional de Iconos** (Mismo aspecto, misma respuesta).
- [x] Validar flujo ininterrumpido hacia el módulo de **Entrenamiento IA**.
- [x] Verificación visual final (Paridad 1:1 con estética de madera).
- [x] Punto de Control: `c04e0e6` (Backup Final).

## Fase 22: Módulo de Cobro Dinámico y Pantalla de Pago
- [x] Diseñar e implementar el botón dinámico "COBRAR $[TOTAL]" en `SalesReceipt`.
- [x] Crear el componente `CheckoutScreen` para el procesamiento de pagos.
- [x] Implementar la lógica de cálculo de cambio y métodos de pago (Efectivo/Tarjeta).
- [x] Validar la persistencia de la venta al finalizar el pago.
- [x] Verificación de inmutabilidad visual (Confirmada por el Usuario).

## Fase 23: Pagos Mixtos y Sub-métodos de Pago
- [x] Implementar lógica de abonos parciales en `CheckoutScreen`.
- [x] Añadir selector de sub-tipo (Débito/Crédito) para pagos con tarjeta.
- [x] Visualizar historial de abonos durante el cobro.
- [x] Adaptar flujo de persistencia para desglose de pagos múltiples.
- [x] HOTFIX: Corregir `ReferenceError: handleClear` en pantalla de cobro.
- [x] Ajuste UI: Remover logo superior.
- [x] Ajuste UI: Texto "Transacción Activa" en blanco.
- [x] Ajuste UI: Mostrar solo 2 dígitos del número de cuenta.
- [x] Ajuste UI: Aumentar tamaño de la leyenda "CUENTA #XX".

## Fase 24: Optimización de Ticket (Ahorro de Papel)
- [x] Diseñar plantilla `TicketTemplate` ultra-compacta.
- [x] Implementar `PrintService.js` (Integrado en RetailVisionPOS) para manejo de impresión.
- [x] Reducir interlineado y márgenes en el diseño de impresión.
- [x] Integrar disparo de impresión al finalizar venta en `RetailVisionPOS`.

## Fase 25: Catálogo Visual (Imágenes Reales)
- [x] Configurar `StaticFiles` en FastAPI para servir el catálogo.
- [x] Sincronizar volumen Docker con `CATALOGO DE PRODUCTOS NUMERADOS`.
- [x] Implementar lógica de fallback PNG/JPG en `ProductCard`.
- [x] Validar visualización de imágenes en el POS.

## Fase 26: Separación de Liquidación e Impresión
- [x] Modificar `CheckoutScreen.jsx`: Renombrar botón a "LIQUIDAR CUENTA" y añadir estado `isLiquidado`.
- [x] Modificar `CheckoutScreen.jsx`: Añadir botón "IMPRIMIR TICKET" visible solo tras liquidar.
- [x] Modificar `RetailVisionPOS.jsx`: Manejar la liquidación sin borrar el carrito de inmediato.
- [x] Proveer método `onPrint` y `onClose` desde `RetailVisionPOS` a `CheckoutScreen`.
- [x] **Hotfix**: Separar la acción "cerrar" (preserva el carrito) de "finalizar sin ticket" (limpia el carrito).

## Fase 27: Multiplicador Invisible (Cantidades Masivas)
- [x] Modificar `useCart.js`: Añadir función `updateQuantity`.
- [x] Modificar `SalesReceipt.jsx`: Convertir texto de cantidad actual en un botón táctil y añadir prompt numérico.
- [x] Modificar `RetailVisionPOS.jsx`: Inyectar la función `updateQuantity` a través de la interfaz.
- [x] **Refactor**: Reemplazar prompt del navegador por modal oscuro estilizado interactivo.

## Fase 28: Impresión Silenciosa e Inmediata (Silent Print)
- [x] Modificar `RetailVisionPOS.jsx`: Reemplazar `window.open` por un `iframe` invisible (Cero parpadeos).
- [x] Documentar en `walkthrough.md` los pasos para configurar `--kiosk-printing` en Chrome para saltear el diálogo de sistema operativo.

## Fase 29: Optimización Visual de Tarjetas de Producto
- [x] Modificar `ProductCard` en `RetailVisionPOS.jsx`: Reducir padding de `p-6` a `p-4` y expandir contenedor de imagen a `w-32 h-32`.
- [x] Modificar tipografía de `ProductCard`: Aumentar nombre a `text-xs` y optimizar interlineado para lectura a distancia.
- [x] Modificar encapsulamiento de precio en `ProductCard`: Convertir texto de precio normal en etiqueta `pill` verde neón invertida.
- [x] Reconstruir contenedor POS y verificar resultados visuales.

## Fase 17: Fusión de Arquitectura Senior + Estética Madera (DESCARTADA / ROLLBACK)
- [x] Reubicación de botones de navegación (Pizarrón, Entrenamiento) al estilo `6ceff89`.
- [x] Ajustar estilos de `CategoryBar.jsx` y `ProductGrid.jsx` (Paginación lateral).
- [/] Ajustar estilos de `SalesReceipt.jsx` para ticket de papel y 2 botones clásicos.
- [ ] Verificar persistencia de funcionalidad Senior (SRP/useCart) en layout restaurado.

## Fase 18: Punto de Control Estable (Madera Original)
- [x] Restauración total al commit `6ceff89`.
- [x] Limpieza de repositorio y reconstrucción de Docker.
- [x] Verificación visual completa de la UI clásica.

## Fase 19: Eliminación Quirúrgica de Categoría "TODOS"
- [x] Filtrar "TODOS" en la carga de categorías de `RetailVisionPOS.jsx`.
- [x] Eliminar botón hardcodeado de "TODOS" en la barra de navegación.
- [x] Configurar establecimiento automático de la primera categoría real como activa.
- [x] Validar persistencia de "TODOS" en otros módulos (Inventarios).
- [x] Verificar que no hay cambios en la estética de madera, iconos o fondos.
