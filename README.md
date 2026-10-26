# Colmado Express – Menú dinámico con JSON

Práctica de menú dinámico: las opciones principales y los submenús **no están escritos en el HTML**; se cargan desde el archivo `menu.json` usando JavaScript (`fetch`).

**Idea de aplicación:** app de pedidos para un colmado dominicano (comida y víveres).

## Cómo ejecutarlo

`fetch` no funciona abriendo el archivo con doble clic, hay que usar un servidor local:

```bash
python -m http.server 8000
```

Luego abre http://localhost:8000. También se puede publicar con GitHub Pages (Settings → Pages → rama `main`).

## Estructura

| Archivo | Función |
|---|---|
| `menu.json` | Datos del menú: opciones, submenús (`hijos`) y productos (`items`) |
| `index.html` | Estructura vacía de la página |
| `script.js` | Carga el JSON y construye el menú de forma recursiva |
| `style.css` | Estilos, submenús desplegables y versión móvil |

Para agregar una opción nueva solo se edita `menu.json`; no hay que tocar el HTML.

## Conceptos investigados

**API (Application Programming Interface):** conjunto de reglas que permite que una aplicación pida datos o servicios a otra sin conocer su código interno. Es el "mesero" entre el cliente y el sistema.

**REST:** estilo de arquitectura para crear APIs sobre HTTP. Cada recurso tiene una URL (por ejemplo `/menu`) y se usan los métodos `GET`, `POST`, `PUT` y `DELETE`. Es ligero y normalmente devuelve JSON. Este proyecto hace una petición tipo REST (`GET menu.json`).

**SOAP:** protocolo más antiguo y estricto para servicios web. Los mensajes siempre son XML dentro de un "sobre" (Envelope) y se describen con un contrato (WSDL). Es común en banca y sistemas empresariales por su seguridad y formalidad.

**JSON:** formato de texto ligero basado en pares clave-valor y listas. Es fácil de leer y JavaScript lo entiende directamente (`JSON.parse`). Es el formato más usado en APIs REST. Es el que usa este proyecto.

**XML:** formato de marcado con etiquetas (`<menu><opcion/></menu>`). Es más verboso que JSON, pero admite validación estricta (XSD) y es la base de SOAP.

**GraphQL:** lenguaje de consultas para APIs, con un único endpoint donde el cliente pide exactamente los campos que necesita, evitando traer datos de más o hacer varias peticiones.

**Relación entre ellos:** una *API* es la puerta de comunicación entre aplicaciones. *REST*, *SOAP* y *GraphQL* son tres formas de diseñar esa comunicación, y *JSON* y *XML* son los formatos en que viajan los datos (REST y GraphQL suelen usar JSON; SOAP usa XML).

## Uso de Inteligencia Artificial

Se utilizó Claude para generar la estructura inicial del proyecto, el código del menú recursivo y la documentación, y luego se revisó y probó el resultado. (Ajusta este párrafo con lo que hiciste tú realmente.)
