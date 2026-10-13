# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Público general: la comunidad del estado La Guaira, prensa y cualquier persona que reciba el enlace. Llegan sin contexto técnico, muchas veces desde el teléfono, y quieren saber cuánta ayuda llegó tras el terremoto y a qué parroquias.

## Product Purpose

Rendición de cuentas. El panel muestra con transparencia el despliegue logístico de Cáritas La Guaira después del terremoto: toneladas entregadas, vehículos despachados, fuentes de donación y reparto por zona y por parroquia. Funciona si cualquier persona puede verificar a dónde fue la ayuda y encontrar los datos de su propia parroquia.

## Positioning

El detalle llega hasta cada una de las 26 parroquias de la diócesis: toneladas, vehículos, presbítero responsable y dirección del templo, sobre un mapa de las zonas del estado. Es la red parroquial de Cáritas la que hace posible ese nivel de detalle.

## Operating Context

- Se comparte como enlace público y se abre tanto en escritorio como en móvil.
- Los datos se actualizan periódicamente a medida que se suman despliegues. Hoy están escritos en `src/data/*.js` y hay que editarlos a mano. La fuente de presbíteros y direcciones es `src/assets/Direcciones.xlsx`.
- Sitio estático (`npm run build` → `dist/`), apto para cualquier hosting estático.

## Capabilities and Constraints

- Stack existente: React 18, Vite 5, Tailwind CSS v4 y Chart.js.
- Contenido en español (formato numérico `es-VE`).
- Funciones actuales: KPIs generales, distribución por zona, fuentes de donación y flota por donante, ranking de parroquias, mapa interactivo por zona con zoom y modal por parroquia, y tabla filtrable, buscable y ordenable.
- Terminología del dominio: zonas Este, Centro, Catia La Mar y Montaña; "Zona Cero" son las parroquias con mayor devastación tras el doblete sísmico; toneladas (t); camiones y gandolas.
- Pendiente de decidir: cómo se actualizarán los datos (edición manual, hoja de cálculo, backend o CMS) y si cada actualización mostrará su fecha de corte.

## Brand Commitments

- Nombre e identidad: Cáritas La Guaira, Pastoral Social de la Diócesis de La Guaira.
- Activos: `src/assets/caritas-logo.png` y `src/assets/caritas-isotipo.png`.
- Contacto oficial publicado en el footer: dirección en Macuto, teléfono, correo e Instagram @caritaslg.

## Evidence on Hand

- Cifras por parroquia y por donante en `src/data/parishes.js` y `src/data/donors.js`.
- Directorio de presbíteros y direcciones en `src/data/directory.js`, tomado de `src/assets/Direcciones.xlsx`.
- Mapas SVG del estado y de cada zona en `src/assets/maps/`.
- No hay fotografías, testimonios, citas ni fechas de corte de los datos. No se deben inventar.

## Product Principles

1. **Cada cifra se puede rastrear.** Todo total debe poder bajar hasta la parroquia y el donante que lo componen.
2. **Legible para cualquiera.** Quien llega sin contexto entiende las cifras principales sin explicación previa, en móvil o en escritorio.
3. **Datos fáciles de actualizar.** Como las cifras cambian periódicamente, los totales se calculan a partir de los datos y no se escriben a mano.
4. **Sobriedad ante la tragedia.** Se informa con respeto hacia las comunidades afectadas, sin sensacionalismo ni tono promocional.
