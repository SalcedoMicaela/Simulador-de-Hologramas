#  HOLOGRAM 3D - Visualizador Interactivo

<div align="center">

![Hologram](https://img.shields.io/badge/3D%20Visualization-Holographic%20Tech-00ffff?style=for-the-badge&logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**Una aplicación web interactiva para visualizar y manipular hologramas 3D en tiempo real**

[🎮 Demo](#demo) • [🚀 Inicio Rápido](#-inicio-rápido) • [📖 Documentación](#-documentación) • [🏗️ Arquitectura](#-arquitectura)

</div>

---

## 👥 Autores

| 👨‍💻 **Ariel Guevara** | 
| 👨‍💻 **Elkin Pabon** 
| 👩‍💻 **Micaela Sacedo** | 

---

## 📋 Descripción

**HOLOGRAM 3D** es un visualizador web de última generación que permite crear, manipular y visualizar hologramas tridimensionales directamente desde tu navegador. Combina la potencia de **Three.js** para renderizado 3D con una interfaz intuitiva y futurista.

### ¿Qué puede hacer?

🎯 **Dos Modos de Visualización:**
- 🔷 **Modo Objeto**: Crea hologramas 3D con formas geométricas (esferas, pirámides, diamantes)
- 🖼️ **Modo Imagen**: Convierte imágenes PNG/GIF en hologramas de 4 caras

👁️ **Dos Tipos de Vista:**
- 📺 **Vista Pirámide**: Renderizado 3D completo interactivo
- 📋 **Vista Plana**: Visualización de plantilla con 4 caras

🎨 **Controles Avanzados:**
- Personalización de colores con color picker
- Control de escala (0.5x - 3x)
- Adjusted transparency (0% - 95%)
- Intensidad holográfica configurable
- Auto-rotación 360°
- Zoom interactivo

---

## 🚀 Inicio Rápido

### Requisitos
- Navegador moderno con soporte para ES6 Modules
- Conexión a internet (para CDN de Three.js)

### Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <tu-repositorio>
   cd holograma
   ```

2. **Abrir en el navegador**
   ```bash
   # Opción 1: Doble-click en index.html
   # Opción 2: Con servidor local (recomendado)
   python -m http.server 8000
   # Luego: http://localhost:8000
   ```

3. **¡Listo!** 🎉 Verás una esfera holográfica por defecto

### Uso Básico

```
1. Selecciona un Modo (Objeto o Imagen)
2. Elige una Vista (Pirámide o Plana)
3. Ajusta los parámetros de apariencia
4. Interactúa con el ratón:
   - Arrastra para rotar
   - Rueda para zoom
   - Botones para controles adicionales
```

---

## 🏗️ Arquitectura

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
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │ • Mode (object/image)                │   │  │
│  │  │ • View (pyramid/flat)                │   │  │
│  │  │ • Properties (color, scale, etc)     │   │  │
│  │  │ • Textures (image faces)             │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │    3D SCENE & INPUT (SceneManager)           │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │ • Three.js Scene/Camera/Renderer     │   │  │
│  │  │ • OrbitControls for Interaction      │   │  │
│  │  │ • Lighting (Point, Hemispheric)      │   │  │
│  │  │ • Geometries (Sphere/Pyramid/etc)    │   │  │
│  │  │ • Materials (Lambert/Phong)          │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  INPUT HANDLING & FILE LOADING               │  │
│  │  (InputController)                           │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │ • PNG Texture Loading                │   │  │
│  │  │ • GIF Format Support                 │   │  │
│  │  │ • File Validation                    │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │       RENDERING & UTILITIES                  │  │
│  │      (Helpers + Three.js Canvas)             │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 🔄 Flujo de Datos

```
Usuario → UIController → StateManager → SceneManager → Render 3D
   ↑                                          ↑
   └──────────── InputController ────────────┘
                (Carga de imágenes)
```

---

## 📁 Estructura de Archivos

```
holograma/
├── 📄 index.html                 ← Página principal (estructura HTML)
├── 📄 README.md                  ← Este archivo
│
├── 🎨 css/
│   └── styles.css                ← Estilos modernos y holográficos
│
└── 🔧 js/
    ├── main.js                   ← Inicialización de la aplicación
    ├── StateManager.js           ← 🧠 Gestión centralizada de estado
    ├── SceneManager.js           ← 🎥 Renderizado Three.js
    ├── UIController.js           ← 🖼️ Control de interfaz
    ├── InputController.js        ← 🎮 Manejo de entrada de usuario
    └── Helpers.js                ← 🔧 Utilidades (geometría, materiales)
```

---

## 🔧 Componentes Principales

### **1. StateManager.js** - El Corazón de la App
Gestiona el estado global de la aplicación. Todos los componentes leen/escriben aquí.

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

### **2. UIController.js** - La Interfaz
Sincroniza la UI con el estado. Cuando el usuario cambia un slider, notifica a StateManager.

**Responsabilidades:**
- Vincular eventos DOM
- Actualizar valores mostrados
- Sincronizar visibilidad de controles
- Mantener consistencia UI ↔ Estado

### **3. SceneManager.js** - El Motor 3D
Crea y gestiona la escena de Three.js.

**Responsabilidades:**
- Inicializar escena, cámara, renderer
- Crear geometrías (esferas, pirámides, diamantes)
- Aplicar materiales y texturas
- Gestionar iluminación
- Renderizado continuo
- Controles de cámara (OrbitControls)
- Zoom y vista plana

### **4. InputController.js** - Cargador de Archivos
Maneja la carga de imágenes PNG y GIF.

**Responsabilidades:**
- Escuchar eventos de file input
- Cargar PNG como texturas Three.js
- Procesar GIFs para animación
- Validar formatos

### **5. Helpers.js** - Utilidades
Funciones auxiliares para crear geometrías, materiales y efectos especiales.

---

## ✨ Características Destacadas

### 🎨 Interfaz Futurista
- Gradientes dinámicos cyan/azul
- Efectos glow en controles
- Animaciones suaves y transiciones
- Tipografía profesional (Poppins, Space Mono)

### 🧊 Geometrías 3D
- **Esfera**: Forma clásica con iluminación suave
- **Pirámide**: Estructura geométrica clásica
- **Diamante**: Forma facetada con múltiples reflejos

### 🖼️ Modo Imagen
- Soporta PNG y GIF
- 4 caras independientes (frontal, derecha, trasera, izquierda)
- Carga progresiva de texturas

### 🎮 Controles Intuitivos
- **Mouse**: Arrastra = Rotar, Rueda = Zoom
- **Botones**: Auto-rotar, zoom manual, reiniciar vista
- **Sliders**: Control en tiempo real de todos los parámetros

### 📱 Responsive
- Se adapta a diferentes tamaños de pantalla
- Interfaz táctil amigable (en desarrollo)

---

## 🎯 Cómo Funciona

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
7. Usuario ve el cambio en tiempo real ✨
```

### Ejemplo: Cambiar Color

```javascript
// 1. Usuario selecciona color en input[type="color"]
colorPicker.addEventListener('input', (e) => {
  
  // 2. UIController actualiza estado
  StateManager.color = e.target.value;  // "#ff0000"
  
  // 3. Notifica a SceneManager
  sceneManager.updateAppearance();
  
  // 4. SceneManager modifica material
  mesh.material.color.setHex(StateManager.color);
  
  // 5. Se renderiza automáticamente
  renderer.render(scene, camera);
});
```

---

## 🚀 Funcionalidades Avanzadas

### Modos de Visualización

**Vista Pirámide (3D Interactivo)**
```
- Renderizado 3D completo
- Rotación ortogonal con OrbitControls
- Iluminación dinámica
- Mejor para visualización interactiva
```

**Vista Plana (Plantilla 4 Caras)**
```
- Disposición de 4 cuadrados (frente, derecho, trasero, izquierdo)
- Útil para crear plantillas de hologramas
- Mejor para exportación/imprenta
```

### Auto-Rotación
```javascript
// En el loop de animación
if (StateManager.autoRotate) {
  mesh.rotation.y += 0.005;
}
```

### Intensidad Holográfica
```
Modifica la emisión de luz del material:
intensity 0.2 → Débil, sutil
intensity 1.2 → Normal, recomendado
intensity 3.0 → Muy brillante, casi fluorescente
```

---

## 📊 Stack Tecnológico

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura base |
| **CSS3** | Estilos y animaciones modernas |
| **JavaScript ES6+** | Lógica y funcionalidad |
| **Three.js** | Renderizado 3D |
| **OrbitControls** | Controles de cámara |
| **Canvas API** | Renderizado final |

---

## 🎮 Tutoriales Rápidos

### Crear un Objeto 3D Simple
1. Abre `index.html`
2. Selecciona "🎯 Objeto 3D" en Modo
3. Elige "📺 Pirámide" en Vista
4. Selecciona un objeto (⚪ Esfera, 🔺 Pirámide, 💎 Diamante)
5. ¡Ajusta los controles y disfruta!

### Cargar Imágenes como Holograma
1. Selecciona "🖼️ Imagen" en Modo
2. Carga 4 imágenes PNG/GIF en cada cara
3. Los images aparecerán automáticamente
4. Ajusta transparencia para efecto holográfico

### Efectos Especiales
- **Efecto Fantasma**: Transparencia 80% + Intensidad 2.0
- **Efecto Neón**: Color #00ffff + Intensidad 2.5 + Transparencia 50%
- **Efecto Oscuro**: Intensidad 0.3 + Transparencia 10%

---

## 🔍 Casos de Uso

✅ **Educación**: Visualizar modelos 3D para estudiantes  
✅ **Presentaciones**: Mostrar conceptos de forma interactiva  
✅ **Arte Interactivo**: Instalaciones y exhibiciones digitales  
✅ **Diseño**: Prototipado rápido de visualizaciones  
✅ **Marketing**: Demos de productos innovadoras  

---

## 🐛 Resolución de Problemas

### "No veo nada en pantalla"
- ✅ Verifica que tengas conexión a internet (CDN de Three.js)
- ✅ Abre la consola del navegador (F12) para ver errores
- ✅ Intenta en otro navegador (Chrome, Firefox, Edge)

### "Las imágenes no cargan"
- ✅ Asegúrate de usar PNG o GIF
- ✅ Verifica el tamaño del archivo (máx 10MB recomendado)
- ✅ Comprueba que el navegador tiene permisos de lectura

### "Los controles no responden"
- ✅ Recarga la página (Ctrl+F5)
- ✅ Limpia el caché del navegador
- ✅ Abre la consola para verificar errores de JavaScript



---

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de:
- **Asignatura**: Interculturalidad
- **Semestre**: 8vo


---






</div>
