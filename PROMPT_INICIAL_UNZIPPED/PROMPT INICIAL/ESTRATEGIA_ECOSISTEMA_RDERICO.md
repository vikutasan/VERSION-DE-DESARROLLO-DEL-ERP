# 🌐 ESTRUCTURA MAESTRA: ECOSISTEMA DIGITAL EVOLUTIVO R DE RICO

Este documento es el **Cerebro Central** del proyecto. Define no solo el "qué", sino el "cómo" y el "para qué" de cada línea de código, asegurando que el ERP crezca de manera coherente con la visión del Socio Fundador.

---

## 🏗️ 1. CONTEXTO EMPRESARIAL (EL ECOSISTEMA)
**R de Rico** es un híbrido complejo: Retail, Manufactura, Logística y Hospitalidad. El sistema debe controlar desde la harina en la bodega hasta el pastel entregado a domicilio.

## 🧱 2. ARQUITECTURA TÉCNICA Y RESILIENCIA
Estructura diseñada para la **continuidad total del negocio**:

### 🚀 Monolito Modular (Estrategia de Desarrollo)
- **Definición:** Código fuertemente separado por dominios (Ventas, Inventario, IA) pero ejecutado en un solo contenedor inicial.
- **Beneficio vs. Alternativa:** A diferencia de los *Microservicios puros* (que retrasarían meses el inicio por complejidad de red), el Monolito Modular permite salir a producción hoy con la misma calidad de código, permitiendo extraer servicios solo cuando la carga lo exija.

### 🔌 Edge Computing & Doble Resiliencia
- **Local-First:** Cada sucursal tiene un servidor central.
- **PWA / IndexedDB:** Las tablets guardan datos localmente si el WiFi parpadea.
- **Beneficio vs. Alternativa:** Comparado con sistemas *100% Cloud* (que mueren si falla el internet) o *LAN simple* (que mueren si falla el WiFi local), esta arquitectura garantiza que la venta nunca se detenga.

### 🔄 Sincronización Profesional (Motores CRDT/PowerSync)
- **Definición:** Sincronización bidireccional automática entre sucursales y corporativo.
- **Beneficio vs. Alternativa:** Supera a la *sincronización manual* (propensa a conflictos y pérdida de datos). Los CRDTs garantizan que los datos siempre coincidan matemáticamente, ahorrando meses de depuración de errores de red.

## 🧩 3. HOJA DE RUTA MODULAR (EVOLUTIVA)

### Módulo A: Punto de Venta (POS) & Visión IA
- **IA Local (OpenCV/Python):** Reconocimiento ultra-rápido (< 1s) vía cámara USB.
- **Beneficio vs. Alternativa:** El procesamiento local es drásticamente más rápido y estable que las *APIs en el navegador*, eliminando filas en horas pico.

### Módulo B: Logística y Pedidos Especiales
- **Web App de Pastelería:** Conexión directa cliente-fábrica.

### Módulo C: Mermas e Inventario (Event Sourcing)
- **Definición:** El inventario es un libro contable inmutable de cada movimiento.
- **Beneficio vs. Alternativa:** Un simple campo `stock` es fácil de hackear o perder. El *Event Sourcing* permite auditorías forenses de cada gramo de insumo, siendo el único camino real hacia **"Merma Cero"**.

### Módulo D: Reparto y Rutas (Conectividad WAN)
- **Cloudflare Tunnel:** Conexión segura para repartidores en la calle (4G/5G).
- **Beneficio vs. Alternativa:** Más ágil y estable que una *VPN tradicional*, permitiendo acceso seguro sin agotar la batería de los dispositivos móviles.

### Módulo E: Entrenamiento de IA
- **Distribución:** Etiquetado en sucursal -> Entrenamiento en Corporativo.
- **Beneficio vs. Alternativa:** Evita que los servidores de sucursal se calienten o ralenticen, delegando el cálculo pesado al hardware especializado del corporativo.

### Módulo F: Inteligencia de Negocios (BI)
- **Data Warehouse Corporativo:** Datos listos para Power BI/Tableau.
- **Beneficio vs. Alternativa:** Enfocarse en *datos limpios* es mejor que crear *gráficas internas limitadas*, permitiendo al administrador usar herramientas de clase mundial para tomar decisiones.

## 🛡️ 4. MANIFIESTO DE CALIDAD TÉCNICA (PRINCIPIOS IMPERIALES)
- **SRP (Responsabilidad Única):** Un archivo = Una misión.
- **DRY (Don't Repeat Yourself):** Prohibido el código basura duplicado.
- **KISS:** Código autodocumentado y legible en menos de 30 segundos.
- **Resiliencia:** El sistema debe persistir en local y avisar: *"Guardado localmente, pendiente de sincronizar"*.

## 🏢 5. INFRAESTRUCTURA FÍSICA (TERMINALES)
- **Servidor Híbrido Islado:** La PC del servidor (T6) corre los servicios en Docker de fondo, protegiendo la red si la interfaz de venta se congela.
- **Terminal CAJA:** Punto de cobro con impresora térmica de 80mm.
- **Red LAN:** Terminales 2 a 5 para ventas y consulta.

---

> *"Diseñamos para hoy, pero construimos para que mañana el sistema sea más inteligente que ayer."*
