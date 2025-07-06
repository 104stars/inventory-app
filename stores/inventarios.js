import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useInventariosStore = create(
  persist(
    (set, get) => ({
      // Estado
      inventarios: [
        {
          id: 'default',
          nombre: 'Inventario Principal',
          descripcion: 'Inventario principal de la empresa',
          fechaCreacion: new Date().toISOString(),
        }
      ],
      inventarioActivo: 'default',

      // Acciones
      addInventario: (inventario) => {
        const newInventario = {
          id: Date.now().toString(),
          nombre: inventario.nombre,
          descripcion: inventario.descripcion || '',
          fechaCreacion: new Date().toISOString(),
        }
        
        set((state) => ({
          inventarios: [...state.inventarios, newInventario]
        }))
        
        return newInventario.id
      },

      updateInventario: (id, updates) => {
        set((state) => ({
          inventarios: state.inventarios.map(inventario =>
            inventario.id === id
              ? { ...inventario, ...updates }
              : inventario
          )
        }))
      },

      deleteInventario: (id) => {
        const state = get()
        
        // No permitir eliminar el último inventario
        if (state.inventarios.length <= 1) {
          return false
        }

        // Si se elimina el inventario activo, cambiar al primero disponible
        const newInventarios = state.inventarios.filter(inv => inv.id !== id)
        const newInventarioActivo = state.inventarioActivo === id 
          ? newInventarios[0]?.id 
          : state.inventarioActivo

        set({
          inventarios: newInventarios,
          inventarioActivo: newInventarioActivo
        })

        return true
      },

      setInventarioActivo: (id) => {
        set({ inventarioActivo: id })
      },

      // Funciones auxiliares
      getInventarioById: (id) => {
        return get().inventarios.find(inventario => inventario.id === id)
      },

      getInventarioActivo: () => {
        return get().getInventarioById(get().inventarioActivo)
      }
    }),
    {
      name: 'inventario-inventarios',
    }
  )
)

export default useInventariosStore 