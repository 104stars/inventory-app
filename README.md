# InventarioApp - MVP

Una aplicación moderna y fácil de usar para la gestión de inventarios, construida con Next.js, Tailwind CSS, ShadCN/UI y Zustand.

## 🚀 Características Principales

### ✅ Gestión de Artículos
- ➕ Crear nuevos artículos con nombre, cantidad y categoría
- ✏️ Editar detalles de artículos existentes
- 🗑️ Eliminar artículos del inventario
- 🔍 Búsqueda en tiempo real por nombre
- 📊 Controles rápidos para aumentar/disminuir cantidades

### ✅ Seguimiento de Inventario
- 📈 Incrementar/Decrementar stock con botones +/-
- 📝 Entrada manual de cantidad para ajustes amplios
- 📋 Vista clara de todos los niveles de inventario actuales
- 📊 Dashboard con estadísticas en tiempo real

### ✅ Alertas de Bajo Stock
- ⚠️ Configurar nivel mínimo por artículo
- 🔴 Indicadores visuales cuando el stock está bajo
- 📋 Vista dedicada de todos los artículos con stock crítico
- 🚨 Acciones rápidas de reabastecimiento

### ✅ Categorías Básicas
- 🏷️ Crear categorías personalizadas con colores e íconos
- 🔄 Filtrar artículos por categoría
- 🎨 Vista previa visual de las categorías
- 📂 Gestión completa de categorías

### ✅ Múltiples Inventarios
- 📁 Crear y gestionar múltiples inventarios
- 🔄 Cambiar entre inventarios fácilmente
- 📊 Estadísticas independientes por inventario
- 🎯 Un inventario activo a la vez

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: ShadCN/UI
- **State Management**: Zustand
- **Icons**: Lucide React
- **Language**: JavaScript (sin TypeScript)
- **Storage**: LocalStorage con persistencia automática

## 📦 Instalación y Configuración

### Prerequisitos
- Node.js 18+ 
- npm o pnpm

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [tu-repositorio]
   cd InventarioApp
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📱 Uso de la Aplicación

### Dashboard Principal
- **Vista general**: Estadísticas del inventario activo
- **Selector de inventario**: Cambiar entre diferentes inventarios
- **Acceso rápido**: Botones para las funciones principales
- **Artículos recientes**: Últimos artículos agregados
- **Alertas**: Notificaciones de stock bajo

### Gestión de Artículos
1. **Crear artículo**: Clic en "Nuevo Artículo"
2. **Buscar**: Usar la barra de búsqueda en tiempo real
3. **Filtrar**: Seleccionar categoría específica
4. **Editar cantidad**: Botones +/- o edición directa
5. **Gestionar**: Editar o eliminar artículos individuales

### Alertas de Stock
- **Ver alertas**: Página dedicada `/bajo-stock`
- **Niveles críticos**: Código de colores por urgencia
- **Acciones rápidas**: Botones para restock inmediato
- **Gestión**: Enlaces directos para editar artículos

### Categorías
- **Crear**: Nombre, color e ícono personalizado
- **Vista previa**: Ver cómo se verá la categoría
- **Estadísticas**: Cantidad de artículos por categoría
- **Protección**: No eliminar categorías con artículos

### Inventarios Múltiples
- **Crear**: Nuevos inventarios con nombre y descripción
- **Activar**: Cambiar el inventario de trabajo
- **Estadísticas**: Ver resumen por inventario
- **Protección**: No eliminar inventarios con contenido


## 💾 Almacenamiento de Datos

### LocalStorage
- **Persistencia automática**: Los datos se guardan localmente
- **Sin sincronización**: No requiere conexión a internet
- **Recuperación**: Los datos persisten entre sesiones
- **Particionado**: Diferentes stores para diferentes tipos de datos

### Estructura de Datos
```javascript
// Artículos
{
  id: "timestamp",
  nombre: "string",
  cantidad: number,
  cantidadMinima: number,
  categoria: "string",
  inventarioId: "string",
  fechaCreacion: "ISO string",
  ultimaModificacion: "ISO string"
}

// Categorías
{
  id: "string",
  nombre: "string",
  color: "hex color",
  icono: "string"
}

// Inventarios
{
  id: "string",
  nombre: "string",
  descripcion: "string",
  fechaCreacion: "ISO string"
}
```

## 🎯 Funcionalidades del MVP

### ✅ Incluido en el MVP
- Gestión completa de artículos (CRUD)
- Búsqueda y filtrado en tiempo real
- Alertas de bajo stock configurables
- Categorías personalizables
- Múltiples inventarios
- Dashboard con estadísticas
- Interfaz responsive y moderna
- Almacenamiento local persistente

### ❌ No Incluido en el MVP
- Escaneo de códigos de barras
- Seguimiento multi-ubicación
- Reportes y análisis avanzados
- Cuentas de usuario/autenticación
- Exportación de datos
- Notificaciones push
- Información de proveedores
- Seguimiento de costos
- Fotos de artículos
- Sincronización en la nube

## 🔄 Próximas Mejoras (Post-MVP)

1. **Autenticación de usuarios**
2. **Base de datos en la nube**
3. **Reportes y análisis**
4. **Exportación a Excel/PDF**
5. **Códigos de barras**
6. **Aplicación móvil nativa**
7. **Multi-ubicación**
8. **Notificaciones automáticas**

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles específicos

---