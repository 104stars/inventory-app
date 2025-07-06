import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useArticulosStore = create(
  persist(
    (set, get) => ({
      // Estado
      articulos: [],
      filteredArticulos: [],
      searchTerm: '',
      selectedCategoria: 'todas',
      inventarioActivo: 'default',

      // Acciones - Artículos CRUD
      addArticulo: (articulo) => {
        const newArticulo = {
          id: Date.now().toString(),
          nombre: articulo.nombre,
          cantidad: articulo.cantidad || 0,
          cantidadMinima: articulo.cantidadMinima || 1,
          categoria: articulo.categoria || 'Sin categoría',
          inventarioId: articulo.inventarioId || get().inventarioActivo,
          fechaCreacion: new Date().toISOString(),
          ultimaModificacion: new Date().toISOString(),
        }
        
        set((state) => {
          const newArticulos = [...state.articulos, newArticulo]
          return {
            articulos: newArticulos,
            filteredArticulos: get().filterArticulos(newArticulos)
          }
        })
      },

      updateArticulo: (id, updates) => {
        set((state) => {
          const newArticulos = state.articulos.map(articulo =>
            articulo.id === id
              ? { 
                  ...articulo, 
                  ...updates, 
                  ultimaModificacion: new Date().toISOString() 
                }
              : articulo
          )
          return {
            articulos: newArticulos,
            filteredArticulos: get().filterArticulos(newArticulos)
          }
        })
      },

      deleteArticulo: (id) => {
        set((state) => {
          const newArticulos = state.articulos.filter(articulo => articulo.id !== id)
          return {
            articulos: newArticulos,
            filteredArticulos: get().filterArticulos(newArticulos)
          }
        })
      },


      deleteArticulosByInventario: (inventarioId) => {
        set((state) => {
          const newArticulos = state.articulos.filter(articulo => articulo.inventarioId !== inventarioId)
          return {
            articulos: newArticulos,
            filteredArticulos: get().filterArticulos(newArticulos)
          }
        })
      },
      // Acciones - Cantidad
      incrementarCantidad: (id, cantidad = 1) => {
        get().updateArticulo(id, { 
          cantidad: Math.max(0, get().getArticuloById(id)?.cantidad + cantidad || cantidad)
        })
      },

      decrementarCantidad: (id, cantidad = 1) => {
        get().updateArticulo(id, { 
          cantidad: Math.max(0, get().getArticuloById(id)?.cantidad - cantidad || 0)
        })
      },

      setCantidad: (id, cantidad) => {
        get().updateArticulo(id, { cantidad: Math.max(0, cantidad) })
      },

      // Acciones - Filtros y búsqueda
      setSearchTerm: (term) => {
        set((state) => ({
          searchTerm: term,
          filteredArticulos: get().filterArticulos(state.articulos)
        }))
      },

      setSelectedCategoria: (categoria) => {
        set((state) => ({
          selectedCategoria: categoria,
          filteredArticulos: get().filterArticulos(state.articulos)
        }))
      },

      setInventarioActivo: (inventarioId) => {
        set((state) => ({
          inventarioActivo: inventarioId,
          filteredArticulos: get().filterArticulos(state.articulos)
        }))
      },

      // Funciones auxiliares
      filterArticulos: (articulos) => {
        const { searchTerm, selectedCategoria, inventarioActivo } = get()
        
        return articulos.filter(articulo => {
          const matchesSearch = articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesCategoria = selectedCategoria === 'todas' || articulo.categoria === selectedCategoria
          const matchesInventario = articulo.inventarioId === inventarioActivo
          
          return matchesSearch && matchesCategoria && matchesInventario
        })
      },

      getArticuloById: (id) => {
        return get().articulos.find(articulo => articulo.id === id)
      },

      getArticulosBajoStock: () => {
        return get().articulos.filter(articulo => 
          articulo.cantidad <= articulo.cantidadMinima && 
          articulo.inventarioId === get().inventarioActivo
        )
      },

      getCategorias: () => {
        const categorias = [...new Set(get().articulos.map(articulo => articulo.categoria))]
        return categorias.filter(Boolean)
      },

      // Inicializar filtros
      initializeFilters: () => {
        const state = get()
        set({
          filteredArticulos: state.filterArticulos(state.articulos)
        })
      }
    }),
    {
      name: 'inventario-articulos',
      partialize: (state) => ({
        articulos: state.articulos,
        inventarioActivo: state.inventarioActivo,
      }),
    }
  )
)

export default useArticulosStore 
