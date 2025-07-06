export const DEFAULT_CATEGORIES = [
  { 
    id: '1', 
    nombre: 'Materias Primas', 
    color: '#3B82F6', 
    icono: 'Package',
    descripcion: 'Materiales base para producción'
  },
  { 
    id: '2', 
    nombre: 'Productos Terminados', 
    color: '#10B981', 
    icono: 'Box',
    descripcion: 'Productos listos para venta'
  },
  { 
    id: '3', 
    nombre: 'Herramientas', 
    color: '#F59E0B', 
    icono: 'Wrench',
    descripcion: 'Herramientas y equipos'
  },
  { 
    id: '4', 
    nombre: 'Suministros', 
    color: '#8B5CF6', 
    icono: 'Clipboard',
    descripcion: 'Suministros de oficina y operación'
  },
  { 
    id: '5', 
    nombre: 'Repuestos', 
    color: '#EF4444', 
    icono: 'Settings',
    descripcion: 'Repuestos y componentes'
  }
]

export const STOCK_LEVELS = {
  CRITICAL: { min: 0, max: 5, color: 'red', label: 'Crítico' },
  LOW: { min: 6, max: 10, color: 'orange', label: 'Bajo' },
  NORMAL: { min: 11, max: 50, color: 'green', label: 'Normal' },
  HIGH: { min: 51, max: Infinity, color: 'blue', label: 'Alto' }
}

export const ICONS_CATEGORIAS = [
  'Package', 'Box', 'Wrench', 'Clipboard', 'Settings', 
  'ShoppingCart', 'Truck', 'Factory', 'Cpu', 'Zap',
  'Hammer', 'Scissors', 'Paintbrush', 'Beaker', 'Tag'
]

export const COLORES_CATEGORIAS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
] 