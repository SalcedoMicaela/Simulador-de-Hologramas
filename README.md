# HOLOGRAM 3D - Simulador de Holograma para YouTube

<div align="center">

![Hologram](https://img.shields.io/badge/3D%20Visualization-Holographic%20Tech-00ffff?style=for-the-badge&logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**Simulador de holograma casero para crear videos tipo pirámide holográfica**

[Demo](#demo) • [Inicio Rápido](#-inicio-rápido) • [Documentación](#-documentación) • [Arquitectura](#-arquitectura)

</div>

---

## Autores

| | |
|---|---|
| **Ariel Guevara** |
| **Elkin Pabon** |
| **Micaela Sacedo** |

---

## Descripción

**HOLOGRAM 3D** es un simulador web que permite crear hologramas caseros usando una pirámide de plástico transparente sobre la pantalla de tu dispositivo. Perfecto para crear videos virales de YouTube con efectos holográficos profesionales.

### Características Principales

**Dos Modos de Visualización:**
- **Modo Objeto**: Crea hologramas 3D con formas geométricas (esferas, pirámides, diamantes)
- **Modo Imagen**: Convierte imágenes PNG/GIF en hologramas de 4 caras

**Dos Tipos de Vista:**
- **Vista Pirámide**: Renderizado 3D completo interactivo
- **Vista Plana**: Visualización de plantilla con 4 caras

**Controles Avanzados:**
- Personalización de colores con color picker
- Control de escala (0.5x - 3x)
- Transparencia ajustable (0% - 95%)
- Intensidad holográfica configurable
- Auto-rotación 360 grados
- Zoom interactivo

**Interfaz Optimizada:**
- Diseño totalmente responsive (tablets y móviles)
- Menú lateral colapsable para maximizar el área de visualización
- Modo pantalla completa para grabación
- Iconos SVG inline (funcionamiento offline)
- Guías visuales para colocar la pirámide correctamente

---

## Inicio Rápido

### Requisitos
- Navegador moderno con soporte para ES6 Modules
- Conexión a internet para la primera carga (CDN de Three.js)
- Pirámide de plástico transparente (puedes hacerla con acetato)

### Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <tu-repositorio>
   cd "1. holograma"
   ```

2. **Abrir en el navegador**
   ```bash
   # Opción 1: Doble-click en index.html
   # Opción 2: Con servidor local (recomendado)
   python -m http.server 8000
   # Luego: http://localhost:8000
   ```

3. **Listo** Verás una esfera holográfica por defecto

### Uso Básico

```
1. Selecciona un Modo (Objeto o Imagen)
2. Elige una Vista (Pirámide o Plana)
3. Ajusta los parámetros de apariencia
4. Interactúa con el ratón:
   - Arrastra para rotar
   - Rueda para zoom
   - Botones para controles adicionales
5. Coloca tu pirámide de plástico sobre la pantalla
6. Graba la pantalla para tu video de YouTube
```

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    HOLOGRAM 3D                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │           USER INTERFACE (UIController)      │  │
│  │  ┌───────────┬───────────┬──────────────┐   │  │
│  │  │ Selects   │ Sliders   │  Buttons     │   │  │
│  │  └───────────┴───────────┴──────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │       STATE MANAGEMENT (StateManager)        │  │
│  │  • Mode (object/image)                       │  │
│  │  • View (pyramid/flat)                       │  │
│  │  • Properties (color, scale, etc)            │  │
│  │  • Textures (image faces)                    │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │    3D SCENE & INPUT (SceneManager)           │  │
│  │  • Three.js Scene/Camera/Renderer            │  │
│  │  • OrbitControls for Interaction             │  │
│  │  • Lighting (Ambient, Directional)           │  │
│  │  • Geometries (Sphere/Pyramid/Diamond)       │  │
│  │  • Materials (Phong con efectos glow)        │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  INPUT HANDLING & FILE LOADING               │  │
│  │  (InputController)                           │  │
│  │  • PNG Texture Loading                       │  │
│  │  • GIF Format Support                        │  │
│  │  • File Validation                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario → UIController → StateManager → SceneManager → Render 3D
   ↑                                          ↑
   └──────────── InputController ────────────┘
                (Carga de imágenes)
```

---

## Estructura de Archivos

```
holograma/
├── index.html                 ← Página principal
├── README.md                  ← Documentación
│
├── css/
│   └── styles.css             ← Estilos responsive
│
└── js/
    ├── main.js                ← Inicialización y controles UI
    ├── StateManager.js        ← Gestión centralizada de estado
    ├── SceneManager.js        ← Renderizado Three.js
    ├── UIController.js        ← Control de interfaz
    ├── InputController.js     ← Manejo de entrada de archivos
    └── Helpers.js             ← Utilidades 3D
```

---

## Componentes Principales

### 1. StateManager.js - El Corazón de la App
Gestiona el estado global de la aplicación.

```javascript
StateManager = {
  mode: 'object',              // 'object' o 'image'
  view: 'pyramid',             // 'pyramid' o 'flat'
  objectType: 'sphere',        // 'sphere', 'pyramid', 'diamond'
  color: '#00ffff',            // Color hexadecimal
  scale: 1,                    // Factor de escala
  transparency: 0.35,          // Opacidad (0-0.95)
  intensity: 1.2,              // Intensidad holográfica
  autoRotate: true,            // Auto-rotación ON/OFF
  imageTextures: {...},        // PNG/GIF para cada cara
  gifData: {...}               // Datos de GIFs animados
}
```

### 2. UIController.js - La Interfaz
Sincroniza la UI con el estado.

**Responsabilidades:**
- Vincular eventos DOM
- Actualizar valores mostrados
- Sincronizar visibilidad de controles
- Mantener consistencia UI ↔ Estado

### 3. SceneManager.js - El Motor 3D
Crea y gestiona la escena de Three.js.

**Responsabilidades:**
- Inicializar escena, cámara, renderer
- Crear geometrías y materiales
- Aplicar texturas y efectos
- Gestionar iluminación
- Renderizado continuo con animaciones
- Controles de cámara (OrbitControls)

### 4. InputController.js - Cargador de Archivos
Maneja la carga de imágenes PNG y GIF.

**Responsabilidades:**
- Escuchar eventos de file input
- Cargar PNG como texturas Three.js
- Procesar GIFs para animación
- Validar formatos

### 5. Helpers.js - Utilidades
Funciones auxiliares para crear geometrías, materiales y efectos.

---

## Características Destacadas

### Interfaz Moderna
- Gradientes dinámicos cyan/azul
- Efectos glow en controles
- Animaciones suaves y transiciones
- Iconos SVG inline (sin dependencias externas)
- Tipografía profesional (Poppins, Space Mono)

### Geometrías 3D
- **Esfera**: Forma clásica con iluminación suave
- **Pirámide**: Estructura geométrica clásica
- **Diamante**: Forma facetada con múltiples reflejos

### Modo Imagen
- Soporta PNG y GIF
- 4 caras independientes (frontal, derecha, trasera, izquierda)
- Carga progresiva de texturas
- Efectos de scanlines y glow holográfico

### Controles Intuitivos
- **Mouse**: Arrastra = Rotar, Rueda = Zoom
- **Botones**: Auto-rotar, zoom manual, reiniciar vista
- **Sliders**: Control en tiempo real de todos los parámetros

### Responsive Design
- Adaptado para tablets y móviles
- Menú lateral colapsable
- Modo pantalla completa
- Guías visuales para colocar pirámide
- Touch-friendly

---

## Cómo Funciona

### Flujo de Actualización Completo

```
1. Usuario interactúa con UI (ej: mueve slider de transparencia)
   ↓
2. UIController escucha evento → actualiza StateManager
   ↓
3. StateManager.transparency = 0.5
   ↓
4. UIController notifica a SceneManager → updateAppearance()
   ↓
5. SceneManager lee el nuevo estado y modifica el material del mesh
   ↓
6. Three.js re-renderiza automáticamente
   ↓
7. Usuario ve el cambio en tiempo real
```

---

## Funcionalidades Avanzadas

### Modos de Visualización

**Vista Pirámide (3D Interactivo)**
```
- Renderizado 3D completo
- Rotación ortogonal con OrbitControls
- Iluminación dinámica
- Efectos de scanlines y glow
- Ideal para colocar pirámide encima
```

**Vista Plana (Plantilla 4 Caras)**
```
- Disposición de 4 cuadrados
- Frente, derecha, trasera, izquierda
- Útil para previsualizar imágenes
```

### Auto-Rotación
```javascript
// En el loop de animación
if (StateManager.autoRotate) {
  mesh.rotation.y += 0.005;
}
```

### Efectos Holográficos
```
- Capas de profundidad para volumen
- Tinte cian suave
- Scanlines horizontales animados
- Halo glow alrededor de la imagen
- Partículas de luz flotantes
- Rayo de luz vertical
- Levitación suave del holograma
```

---

## Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura base |
| **CSS3** | Estilos, animaciones y responsive |
| **JavaScript ES6+** | Lógica y funcionalidad |
| **Three.js** | Renderizado 3D |
| **OrbitControls** | Controles de cámara |
| **SVG Inline** | Iconos offline |

---

## Tutoriales Rápidos

### Crear un Video para YouTube

1. Abre la aplicación en tu navegador
2. Selecciona "Imagen" en Modo
3. Carga las 4 imágenes (PNG o GIF)
4. Ajusta transparencia (~35%) e intensidad (~1.2)
5. Activa Auto-rotar
6. Coloca la pirámide de plástico en el centro de la pantalla
7. Activa modo pantalla completa
8. Graba la pantalla con tu software de grabación favorito
9. ¡El holograma aparecerá flotando en la pirámide!

### Crear un Objeto 3D Simple

1. Selecciona "Objeto 3D" en Modo
2. Elige "Pirámide" en Vista
3. Selecciona un objeto (Esfera, Pirámide, Diamante)
4. Ajusta el color y la intensidad
5. ¡Listo para grabar!

### Efectos Especiales
- **Efecto Fantasma**: Transparencia 80% + Intensidad 2.0
- **Efecto Neón**: Color #00ffff + Intensidad 2.5 + Transparencia 50%
- **Efecto Oscuro**: Intensidad 0.3 + Transparencia 10%

---

## Cómo Hacer tu Pirámide Casera

### Materiales Necesarios
- Acetato transparente o CD case de plástico
- Regla y lápiz
- Tijeras o cutter
- Cinta adhesiva transparente

### Instrucciones
1. Dibuja 4 triángulos isósceles en el acetato:
   - Base: 6 cm
   - Altura: 7 cm
2. Recorta los triángulos
3. Únelos por los bordes con cinta adhesiva
4. Forma una pirámide con la base abierta
5. Coloca la punta hacia abajo sobre la pantalla

### Tamaño Óptimo
- Para celulares: Base 5-6 cm
- Para tablets: Base 8-10 cm
- Para monitores: Base 12-15 cm

---

## Casos de Uso

- **Educación**: Visualizar modelos 3D para estudiantes
- **Videos de YouTube**: Crear contenido viral con efectos holográficos
- **Presentaciones**: Mostrar conceptos de forma innovadora
- **Arte Interactivo**: Instalaciones y exhibiciones digitales
- **Diseño**: Prototipado rápido de visualizaciones
- **Marketing**: Demos de productos innovadoras

---

## Resolución de Problemas

### "No veo nada en pantalla"
- Verifica que tengas conexión a internet (CDN de Three.js)
- Abre la consola del navegador (F12) para ver errores
- Intenta en otro navegador (Chrome, Firefox, Edge)

### "Las imágenes no cargan"
- Asegúrate de usar PNG o GIF
- Verifica el tamaño del archivo (máx 10MB recomendado)
- Comprueba que el navegador tiene permisos de lectura

### "Los controles no responden"
- Recarga la página (Ctrl+F5)
- Limpia el caché del navegador
- Abre la consola para verificar errores de JavaScript

### "El holograma no se ve bien en la pirámide"
- Ajusta la transparencia entre 30-50%
- Aumenta la intensidad a 1.5-2.0
- Asegúrate de que la pirámide esté centrada
- Usa modo pantalla completa para mejor efecto

---

## Contribuciones

Este proyecto fue desarrollado como parte de:
- **Asignatura**: Interculturalidad
- **Semestre**: 8vo

---

## Licencia

MIT License - Libre uso y modificación
