# Guía Operativa: Configuración de Impresión Silenciosa (Cero Clics)

## La Problemática
Anteriormente, al dar clic en **"Imprimir Ticket"**, el sistema mostraba una ventana emergente obligatoria del navegador (Chrome o Edge) pidiendo confirmar la acción y seleccionar la impresora. Esto obligaba al cajero a realizar múltiples clics innecesarios ("Imprimir" -> "Confirmar Impresión") por cada cliente, ralentizando severamente la velocidad de cobro en horas pico.

Esto ocurre porque los navegadores de internet tienen bloqueada, por cuestiones de seguridad mundial, la capacidad de imprimir automáticamente sin el consentimiento explícito del usuario.

## La Solución a Nivel Sistema
Nuestro equipo de arquitectura ha implementado un mecanismo de **"Iframe Fantasma"** (Impresión Silenciosa) dentro del ERP R de Rico. Ahora, cuando el cajero presiona imprimir, el ticket se genera en un plano invisible, evitando que la pantalla parpadee o que el sistema cambie de pestaña. 

Sin embargo, para que el navegador confíe en el ERP y deje pasar la impresión directo al papel sin preguntar nada, **es obligatorio realizar una configuración física en la computadora de la caja**.

---

## Pasos para Configurar la Impresión Automática

Esta configuración se realiza en el icono de acceso directo de Google Chrome (o Microsoft Edge) que usan los cajeros para entrar al Punto de Venta.

1. **Predeterminar la Impresora:**
   Asegúrese de que la impresora térmica (ej. 80mm Series) esté encendida, instalada y configurada como la **Impresora Predeterminada** en los ajustes de Windows.

2. **Modificar el Acceso Directo:**
   Vaya al escritorio de Windows y busque el icono del navegador (Chrome o Edge) que usa para abrir el sistema. Dé **clic derecho** sobre él y seleccione **Propiedades**.

3. **Inyectar la Bandera de Kiosko:**
   Aparecerá una ventana. En la pestaña *Acceso directo*, busque el renglón que dice **Destino** (o Target). 
   - Vaya hasta el mero final del texto que está ahí escrito (después de las comillas).
   - Dé **un solo espacio en blanco**.
   - Escriba textualmente: `--kiosk-printing`
   
   *Ejemplo de cómo debe quedar:*
   `"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk-printing`

4. **Guardar y Aplicar:**
   Presione "Aplicar" y "Aceptar" (Si Windows pide permisos de administrador, acéptelos).

5. **Reinicio Obligatorio:**
   Cierre por completo cualquier ventana de Chrome que esté abierta en la computadora. Vuelva a abrir su navegador dándole doble clic **exclusivamente a ese icono que acaba de modificar**.

¡Listo! A partir de ahora, presionar "Imprimir Ticket" en el ERP sacará el papel físicamente en menos de 1 segundo sin pedir ninguna confirmación en pantalla.

---

## Frecuencia de Configuración (¿Cuándo debo volver a hacerlo?)

Esta configuración se hace **UNA SOLA VEZ** en la vida útil de la computadora. Mientras los cajeros abran el sistema usando el icono modificado del escritorio, la impresión será automática para siempre.

**SÓLO DEBERÁ REPETIR ESTOS PASOS SI OCURRE LO SIGUIENTE:**

1. **Equipo Nuevo:** Compran o instalan una nueva computadora en el área de caja.
2. **Formateo:** Un técnico restablece de fábrica o formatea la computadora actual.
3. **Acceso Extraviado:** Alguien elimina por error el icono del escritorio y usted tiene que crear un acceso directo nuevo.
4. **Cambio de Navegador:** Deciden dejar de usar Google Chrome y deciden empezar a abrir el sistema en Edge (o viceversa). 
5. **Cambio de Impresora Principal:** Desconectan la impresora térmica y ponen una nueva marca/modelo. En este caso solo debe volver a aplicarle la palomita de "Impresora Predeterminada" en Windows a la nueva máquina.

> [!IMPORTANTE]
> Instrucción Crítica para el Personal: "Nunca borres el icono de acceso al sistema que está en el escritorio. Es el que tiene la llave mágica para imprimir rápido".
