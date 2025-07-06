'use client'

import { useState, useEffect } from 'react'
import useArticulosStore from '@/stores/articulos'
import useCategoriasStore from '@/stores/categorias'
import useInventariosStore from '@/stores/inventarios'
import CreateArticleDialog from '@/components/articulos/CreateArticleDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Plus, Minus, Edit, Trash2, Package, Filter } from 'lucide-react'
import Link from 'next/link'

export default function ArticulosPage() {
  const { 
    filteredArticulos,
    searchTerm,
    selectedCategoria,
    setSearchTerm,
    setSelectedCategoria,
    incrementarCantidad,
    decrementarCantidad,
    deleteArticulo,
    initializeFilters
  } = useArticulosStore()
  
  const { categorias } = useCategoriasStore()
  
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    initializeFilters()
  }, [initializeFilters])

  const handleDeleteArticulo = (id, nombre) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      deleteArticulo(id)
    }
  }

  const getStockBadge = (articulo) => {
    if (articulo.cantidad <= articulo.cantidadMinima) {
      return <Badge variant="destructive">Bajo Stock</Badge>
    } else if (articulo.cantidad <= articulo.cantidadMinima * 2) {
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Stock Medio</Badge>
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-600">Stock Bueno</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Artículos</h1>
              <p className="text-gray-600">Administra tu inventario completo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <CreateArticleDialog />
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar y Filtrar
                </CardTitle>
                <CardDescription>
                  Encuentra artículos específicos o filtra por categoría
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden sm:block'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Búsqueda */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar artículo</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nombre del artículo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por Categoría */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filtrar por categoría</label>
                  <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las categorías</SelectItem>
                      {categorias.map(categoria => (
                        <SelectItem key={categoria.id} value={categoria.nombre}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resumen de resultados */}
              <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                <span>
                  Mostrando {filteredArticulos.length} artículo{filteredArticulos.length !== 1 ? 's' : ''}
                </span>
                {(searchTerm || selectedCategoria !== 'todas') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategoria('todas')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Artículos */}
        {filteredArticulos.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedCategoria !== 'todas' 
                    ? 'No se encontraron artículos' 
                    : 'No hay artículos en el inventario'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategoria !== 'todas'
                    ? 'Intenta cambiar los filtros de búsqueda'
                    : 'Comienza agregando tu primer artículo al inventario'
                  }
                </p>
                <CreateArticleDialog>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Artículo
                  </Button>
                </CreateArticleDialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticulos.map(articulo => (
              <Card key={articulo.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{articulo.nombre}</CardTitle>
                      <CardDescription className="mt-1">
                        {articulo.categoria}
                      </CardDescription>
                    </div>
                    {getStockBadge(articulo)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Información de Stock */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock actual:</span>
                      <span className="font-semibold">{articulo.cantidad} unidades</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stock mínimo:</span>
                      <span className="text-gray-900">{articulo.cantidadMinima} unidades</span>
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => decrementarCantidad(articulo.id)}
                      disabled={articulo.cantidad <= 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold">{articulo.cantidad}</div>
                      <div className="text-xs text-gray-500">unidades</div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => incrementarCantidad(articulo.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/articulos/${articulo.id}/editar`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteArticulo(articulo.id, articulo.nombre)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Fecha de última modificación */}
                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Actualizado: {new Date(articulo.ultimaModificacion).toLocaleDateString('es-ES')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 