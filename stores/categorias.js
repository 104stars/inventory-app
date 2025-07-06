import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCategoriasStore = create(
  persist(
    (set, get) => ({
      // Estado
      categorias: [
        { id: '1', nombre: 'Materias Primas', color: '#3B82F6', icono: 'Package' },
        { id: '2', nombre: 'Productos Terminados', color: '#10B981', icono: 'Box' },
        { id: '3', nombre: 'Herramientas', color: '#F59E0B', icono: 'Wrench' },
        { id: '4', nombre: 'Suministros', color: '#8B5CF6', icono: 'Clipboard' },
      ],

      // Acciones
      addCategoria: (categoria) => {
        const newCategoria = {
          id: Date.now().toString(),
          nombre: categoria.nombre,
          color: categoria.color || '#6B7280',
          icono: categoria.icono || 'Tag',
        }
        
        set((state) => ({
          categorias: [...state.categorias, newCategoria]
        }))
        
        return newCategoria.id
      },

      updateCategoria: (id, updates) => {
        set((state) => ({
          categorias: state.categorias.map(categoria =>
            categoria.id === id
              ? { ...categoria, ...updates }
              : categoria
          )
        }))
      },

      deleteCategoria: (id) => {
        set((state) => ({
          categorias: state.categorias.filter(categoria => categoria.id !== id)
        }))
      },

      // Funciones auxiliares
      getCategoriaById: (id) => {
        return get().categorias.find(categoria => categoria.id === id)
      },

      getCategoriaByNombre: (nombre) => {
        return get().categorias.find(categoria => categoria.nombre === nombre)
      },

      getNombresCategoriasOrdenados: () => {
        return get().categorias
          .map(cat => cat.nombre)
          .sort((a, b) => a.localeCompare(b))
      }
    }),
    {
      name: 'inventario-categorias',
    }
  )
)

export default useCategoriasStore 