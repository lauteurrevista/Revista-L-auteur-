# Guía de Administración — L'Auteur

**Para quién es esta guía:** Los editores de la revista que necesitan publicar nuevas ediciones, cambiar textos o imágenes, sin necesidad de saber programar.

---

## Índice

1. [Cómo instalar el proyecto localmente](#1-instalación-local)
2. [Cómo publicarlo en GitHub Pages](#2-publicar-en-github-pages)
3. [Cómo agregar una nueva edición](#3-agregar-una-nueva-edición)
4. [Cómo cambiar textos del sitio](#4-cambiar-textos-del-sitio)
5. [Cómo cambiar imágenes](#5-cambiar-imágenes)
6. [Cómo invitar a un colaborador](#6-invitar-a-un-colaborador)
7. [Flujo de trabajo diario](#7-flujo-de-trabajo-diario)
8. [Solución de problemas frecuentes](#8-solución-de-problemas)

---

## 1. Instalación local

No necesitas instalar ningún programa especial para trabajar con este proyecto. Todo se puede hacer directamente desde el navegador en GitHub.

Sin embargo, si quieres ver el sitio en tu computadora antes de publicarlo:

1. Descarga el repositorio como ZIP desde GitHub (botón verde "Code" → "Download ZIP")
2. Descomprime la carpeta
3. Abre el archivo `index.html` con tu navegador

> ⚠️ Nota: Al abrir directamente con el navegador, las ediciones no cargarán (por restricciones de seguridad del navegador con archivos locales). Para pruebas completas necesitas un servidor local. Puedes instalar la extensión **"Live Server"** en Visual Studio Code, o simplemente publicar en GitHub Pages y probar ahí.

---

## 2. Publicar en GitHub Pages

### Paso 1: Crear una cuenta en GitHub
Ve a [github.com](https://github.com) y crea una cuenta gratuita si no tienes una.

### Paso 2: Crear el repositorio
1. Haz clic en el botón **"+"** arriba a la derecha → **"New repository"**
2. Nombre del repositorio: `lauteur` (o el nombre que prefieras)
3. Selecciona **"Public"** (debe ser público para GitHub Pages gratuito)
4. Haz clic en **"Create repository"**

### Paso 3: Subir los archivos
1. En la página del repositorio vacío, haz clic en **"uploading an existing file"**
2. Arrastra todos los archivos y carpetas del proyecto
3. En la parte inferior escribe un mensaje: `Primera publicación de L'Auteur`
4. Haz clic en **"Commit changes"**

### Paso 4: Activar GitHub Pages
1. Ve a la pestaña **"Settings"** del repositorio
2. En el menú izquierdo busca **"Pages"**
3. En "Branch" selecciona **"main"** y la carpeta **"/ (root)"**
4. Haz clic en **"Save"**
5. Espera 1-2 minutos

Tu sitio estará disponible en:
```
https://TU-USUARIO.github.io/lauteur/
```

### Paso 5 (opcional): Dominio personalizado
Si tienes un dominio propio (ej. `lauteur.com`):
1. En Settings → Pages → Custom domain, escribe tu dominio
2. En tu proveedor de dominio, apunta los DNS a GitHub Pages
3. GitHub te dará las instrucciones exactas

---

## 3. Agregar una nueva edición

Este es el proceso más importante. Solo tiene 3 pasos.

### Paso 1: Subir la portada

1. Ve a tu repositorio en GitHub
2. Navega a la carpeta `assets/covers/`
3. Haz clic en **"Add file"** → **"Upload files"**
4. Sube la imagen de la portada
5. Nómbrala siguiendo el patrón: `cover-04.jpg` (para la edición 4)

**Especificaciones de la portada:**
- Formato: JPG o WebP (recomendado WebP por ser más ligero)
- Tamaño: mínimo 600×800 px, recomendado 900×1200 px
- Proporción: 3:4 (vertical, como una revista)
- Peso máximo recomendado: 500 KB

### Paso 2: Subir el PDF

1. Navega a la carpeta `assets/pdfs/`
2. Haz clic en **"Add file"** → **"Upload files"**
3. Sube el PDF de la edición
4. Nómbralo: `edicion-04.pdf` (para la edición 4)

**Sobre los PDFs:**
- No hay límite de tamaño técnico, pero PDFs más ligeros cargan más rápido
- Para optimizar un PDF grande, puedes usar [ilovepdf.com](https://ilovepdf.com) → "Comprimir PDF"
- El PDF debe tener las páginas en el orden correcto

### Paso 3: Actualizar el archivo de ediciones

Este es el único archivo que debes editar para que la edición aparezca en el sitio.

1. Ve al archivo `data/editions.json`
2. Haz clic en el ícono del lápiz (✏️) para editarlo
3. Copia el siguiente bloque y pégalo **antes** del corchete `]` final, después de una coma:

```json
{
  "id": 4,
  "numero": "Nº 04",
  "titulo": "El Título de Esta Edición",
  "descripcion": "Una descripción de dos o tres oraciones sobre el tema central de esta edición.",
  "fecha": "Julio 2025",
  "fecha_iso": "2025-07",
  "portada": "assets/covers/cover-04.jpg",
  "pdf": "assets/pdfs/edicion-04.pdf",
  "paginas": 36,
  "destacada": false,
  "temas": ["narrativa", "poesía"]
}
```

4. Cambia los valores según tu edición:
   - `"id"` → número entero único (siguiente al último)
   - `"numero"` → cómo se mostrará en pantalla
   - `"titulo"` → título de la edición
   - `"descripcion"` → descripción breve (2-3 oraciones)
   - `"fecha"` → cómo se mostrará ("Julio 2025")
   - `"fecha_iso"` → formato técnico ("2025-07")
   - `"portada"` → ruta a la imagen que subiste
   - `"pdf"` → ruta al PDF que subiste
   - `"paginas"` → número de páginas del PDF
   - `"temas"` → palabras clave para búsqueda (pueden ser cualquier cosa)

5. Haz clic en **"Commit changes"**
6. Escribe un mensaje descriptivo: `Agregar edición 04 — El Título`
7. Confirma con **"Commit changes"**

**El sitio se actualizará automáticamente en 1-2 minutos.**

### Cómo queda el archivo JSON con dos ediciones:

```json
{
  "revista": { ... },
  "ediciones": [
    {
      "id": 1,
      ...edición 1...
    },
    {
      "id": 2,
      ...edición 2...
    },
    {
      "id": 3,
      ...edición 3 (nueva)...
    }
  ]
}
```

> ⚠️ **Cuidado con las comas:** Cada bloque `{ }` va separado del siguiente por una coma, excepto el último. Si ves un error, probablemente falta o sobra una coma.

---

## 4. Cambiar textos del sitio

### Textos principales (nombre, descripción, redes sociales)

Edita el archivo `js/config.js`. Al abrirlo verás secciones claramente marcadas:

```javascript
nombre:    "L'Auteur",           // ← Cambia el nombre
subtitulo: "Revista Literaria...", // ← Cambia el subtítulo
descripcion: "...",              // ← Cambia la descripción
email:     "contacto@...",       // ← Cambia el email
instagram: "https://...",        // ← Cambia el link de Instagram
```

Simplemente reemplaza el texto entre comillas y haz commit.

### Manifiesto "Sobre la revista"

En el mismo `js/config.js`, busca la sección `manifiesto:` y edita el texto. Puedes usar `<br>` para saltos de línea.

### Textos en el footer

Edita directamente en `index.html` y `biblioteca.html`. Busca la sección `<footer>` y cambia los textos.

---

## 5. Cambiar imágenes

### Portada de una edición ya publicada

1. Sube la nueva portada a `assets/covers/` con el mismo nombre que la anterior
2. GitHub preguntará si quieres reemplazarla → confirma
3. El sitio se actualiza automáticamente (puede tardar unos minutos por caché)

### Banner o imagen de fondo del hero

El hero actualmente usa CSS puro (sin imagen de fondo). Si quieres agregar una:

1. Sube la imagen a `assets/images/`
2. En `css/home.css` busca `.hero` y agrega:
   ```css
   background-image: url('../assets/images/TU-IMAGEN.jpg');
   background-size: cover;
   background-position: center;
   ```

### Logo / favicon

Reemplaza el archivo `assets/images/favicon.svg` con tu propio SVG o PNG de 32×32 px.

---

## 6. Invitar a un colaborador

Para que otra persona pueda editar el sitio:

1. Ve a tu repositorio en GitHub
2. Haz clic en **"Settings"** → **"Collaborators"**
3. Haz clic en **"Add people"**
4. Escribe el nombre de usuario de GitHub de tu colaborador
5. Selecciona el rol **"Write"** (puede editar pero no borrar el repositorio)
6. La persona recibirá un email de invitación

Una vez aceptada la invitación, el colaborador puede editar cualquier archivo directamente desde GitHub, igual que tú.

### Flujo de trabajo entre dos personas

Para evitar conflictos cuando las dos personas editan al mismo tiempo:

- **Coordinen por mensaje** antes de editar el mismo archivo (especialmente `editions.json`)
- Si ocurre un conflicto, GitHub lo marcará y deberán resolverlo manualmente
- Una estrategia simple: una persona sube archivos, la otra edita el JSON, y se turnan

---

## 7. Flujo de trabajo diario

### Para publicar una nueva edición (10 minutos):

```
1. Preparar archivos:
   ✓ PDF de la edición listo y optimizado
   ✓ Imagen de portada (JPG/WebP, 900×1200 px aprox.)

2. En GitHub:
   ✓ Subir portada → assets/covers/cover-XX.jpg
   ✓ Subir PDF    → assets/pdfs/edicion-XX.pdf
   ✓ Editar       → data/editions.json (agregar bloque)
   ✓ Hacer commit con mensaje descriptivo

3. Verificar:
   ✓ Esperar 1-2 min y abrir el sitio
   ✓ Comprobar que la portada aparece en la biblioteca
   ✓ Comprobar que el PDF abre correctamente en el visor
```

### Para corregir un error tipográfico:

```
1. Ir al archivo en GitHub
2. Hacer clic en el lápiz (✏️)
3. Corregir el texto
4. Commit con mensaje: "Corrección tipográfica en edición X"
```

---

## 8. Solución de problemas

### El PDF no carga en el visor

- Verifica que el nombre del archivo en `editions.json` coincide **exactamente** con el archivo subido (mayúsculas, guiones, extensión)
- Los PDF muy grandes (más de 50 MB) pueden tardar mucho en cargar
- Prueba comprimir el PDF en [ilovepdf.com](https://ilovepdf.com)

### La portada no aparece

- Verifica el nombre del archivo (debe ser idéntico al que pusiste en el JSON)
- Verifica que está en la carpeta correcta: `assets/covers/`
- Espera 2-3 minutos después del commit (GitHub Pages tiene caché)

### El JSON no es válido (el sitio no carga ediciones)

Señales de un JSON inválido: el sitio muestra "Cargando..." permanentemente.

Para verificar tu JSON:
1. Copia todo el contenido de `editions.json`
2. Ve a [jsonlint.com](https://jsonlint.com)
3. Pega el contenido y haz clic en "Validate JSON"
4. El sitio te mostrará exactamente dónde está el error

El error más común es una coma extra al final del último elemento, o una coma faltante entre elementos.

### El sitio no se actualiza después de un commit

- Espera 5 minutos (a veces GitHub Pages tarda)
- Prueba abriendo el sitio en modo incógnito (para evitar caché del navegador)
- Verifica en Settings → Pages que el despliegue no muestra errores (aparecerá una marca roja si hay problema)

### Quiero cambiar el dominio

1. Compra un dominio en cualquier proveedor (Namecheap, Google Domains, etc.)
2. En GitHub: Settings → Pages → Custom domain → escribe tu dominio
3. En tu proveedor de dominio, crea estos registros DNS:
   ```
   Tipo A:     185.199.108.153
   Tipo A:     185.199.109.153
   Tipo A:     185.199.110.153
   Tipo A:     185.199.111.153
   Tipo CNAME: www → TU-USUARIO.github.io
   ```
4. Activa "Enforce HTTPS" en la misma página de Settings

---

## Referencia rápida: estructura del JSON

```json
{
  "id":          1,                          → número único, no repetir
  "numero":      "Nº 01",                   → texto que aparece en pantalla
  "titulo":      "Los Orígenes",            → título de la edición
  "descripcion": "Descripción breve...",    → 2-3 oraciones
  "fecha":       "Enero 2025",              → cómo se muestra la fecha
  "fecha_iso":   "2025-01",                 → formato técnico (año-mes)
  "portada":     "assets/covers/cover-01.jpg", → ruta exacta al archivo
  "pdf":         "assets/pdfs/edicion-01.pdf", → ruta exacta al archivo
  "paginas":     32,                         → número de páginas (sin comillas)
  "destacada":   false,                      → true solo para la más reciente
  "temas":       ["narrativa", "poesía"]     → etiquetas para búsqueda
}
```

---

*Guía elaborada para L'Auteur — Actualiza este documento si cambias la estructura del proyecto.*
