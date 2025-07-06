'use client'

import { useEffect, useState } from 'react'
import useArticulosStore from '@/stores/articulos'
import useInventariosStore from '@/stores/inventarios'
import InventarioSelector from '@/components/layout/InventarioSelector'
import CreateArticleDialog from '@/components/articulos/CreateArticleDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Package, AlertTriangle, TrendingUp, Search, Folder, Settings } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false)
  
  const { 
    articulos, 
    getArticulosBajoStock, 
    initializeFilters,
    inventarioActivo 
  } = useArticulosStore()
  
  const { getInventarioActivo } = useInventariosStore()

  useEffect(() => {
    initializeFilters()
    setIsHydrated(true)
  }, [initializeFilters])

  const inventarioActual = getInventarioActivo()
  const articulosBajoStock = getArticulosBajoStock()
  const totalArticulos = articulos.filter(art => art.inventarioId === inventarioActivo).length
  const valorTotalStock = articulos
    .filter(art => art.inventarioId === inventarioActivo)
    .reduce((total, art) => total + art.cantidad, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                InventarioApp
              </h1>
            </div>
            <p className="text-gray-600">
              Gestiona tu inventario de forma eficiente
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <InventarioSelector />
            <Button variant="outline" asChild className="border-green-200 text-green-700 hover:bg-green-50">
              <Link href="/inventarios">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Inventario
              </Link>
            </Button>
            <CreateArticleDialog />
          </div>
        </div>

        {/* Inventario Activo Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {isHydrated ? (inventarioActual?.nombre || 'Inventario Principal') : 'Inventario Principal'}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {isHydrated ? (inventarioActual?.descripcion || 'Inventario principal de la empresa') : 'Inventario principal de la empresa'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link href="/inventarios">
                  <Settings className="w-4 h-4 mr-2" />
                  Gestionar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isHydrated ? totalArticulos : 0}</div>
              <p className="text-xs text-muted-foreground">
                En {isHydrated ? (inventarioActual?.nombre || 'Inventario Principal') : 'Inventario Principal'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bajo Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {isHydrated ? articulosBajoStock.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isHydrated ? valorTotalStock : 0}</div>
              <p className="text-xs text-muted-foreground">
                Unidades totales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isHydrated ? new Set(articulos.filter(art => art.inventarioId === inventarioActivo).map(art => art.categoria)).size : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Diferentes tipos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Artículos Recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Artículos Recientes</CardTitle>
              <CardDescription>
                Últimos artículos añadidos al inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              {articulos.filter(art => art.inventarioId === inventarioActivo).length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No hay artículos en el inventario</p>
                  <CreateArticleDialog>
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar primer artículo
                    </Button>
                  </CreateArticleDialog>
                </div>
              ) : (
                <div className="space-y-3">
                  {articulos
                    .filter(art => art.inventarioId === inventarioActivo)
                    .slice(-5)
                    .reverse()
                    .map(articulo => (
                      <div key={articulo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{articulo.nombre}</p>
                          <p className="text-sm text-gray-500">{articulo.categoria}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{articulo.cantidad}</p>
                          {articulo.cantidad <= articulo.cantidadMinima && (
                            <Badge variant="destructive" className="text-xs">
                              Bajo stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/articulos">
                      Ver todos los artículos
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas de Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertas de Stock
              </CardTitle>
              <CardDescription>
                Artículos que requieren reabastecimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isHydrated || articulosBajoStock.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-gray-500">¡Excelente! No hay alertas de stock bajo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {articulosBajoStock.slice(0, 5).map(articulo => (
                    <div key={articulo.id} className="flex items-center justify-between p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <div>
                        <p className="font-medium text-red-800">{articulo.nombre}</p>
                        <p className="text-sm text-red-600">
                          Stock actual: {articulo.cantidad} / Mínimo: {articulo.cantidadMinima}
                        </p>
                      </div>
                      <Badge variant="destructive">
                        Urgente
                      </Badge>
                    </div>
                  ))}
                  {isHydrated && articulosBajoStock.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{articulosBajoStock.length - 5} artículos más con bajo stock
                    </p>
                  )}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/bajo-stock">
                      Ver todas las alertas
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button asChild variant="outline" className="h-24 flex-col">
                <Link href="/articulos">
                  <Package className="w-8 h-8 mb-2" />
                  Ver Artículos
                </Link>
              </Button>
              <CreateArticleDialog>
                <Button variant="outline" className="h-24 flex-col cursor-pointer">
                  <Plus className="w-8 h-8 mb-2" />
                  Nuevo Artículo
                </Button>
              </CreateArticleDialog>
              <Button asChild variant="outline" className="h-24 flex-col">
                <Link href="/categorias">
                  <Search className="w-8 h-8 mb-2" />
                  Categorías
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col">
                <Link href="/bajo-stock">
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  Bajo Stock
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col">
                <Link href="/inventarios">
                  <Folder className="w-8 h-8 mb-2" />
                  Inventarios
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
