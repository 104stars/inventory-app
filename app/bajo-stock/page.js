'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useArticulosStore from '@/stores/articulos'
import useInventariosStore from '@/stores/inventarios'
import CreateArticleDialog from '@/components/articulos/CreateArticleDialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertTriangle, Plus, Minus, TrendingUp, Package, Edit } from 'lucide-react'
import Link from 'next/link'

export default function BajoStockPage() {
  const [isHydrated, setIsHydrated] = useState(false)
  
  const { 
    getArticulosBajoStock, 
    incrementarCantidad, 
    decrementarCantidad,
    initializeFilters,
    syncInventarioActivo,
    getArticuloById
  } = useArticulosStore()
  
  const { getInventarioActivo, inventarioActivo: inventarioActivoStore } = useInventariosStore()

  useEffect(() => {
    // Sincronizar el inventario activo entre stores
    syncInventarioActivo(inventarioActivoStore)
    initializeFilters()
  }, [initializeFilters, syncInventarioActivo, inventarioActivoStore])

  useEffect(() => {
    // Set hydrated to true after component mounts
    setIsHydrated(true)
  }, [])

  const articulosBajoStock = getArticulosBajoStock()
  const inventarioActual = getInventarioActivo()

  const getCriticalLevel = (articulo) => {
    const porcentaje = (articulo.cantidad / articulo.cantidadMinima) * 100
    if (porcentaje === 0) return 'critical'
    if (porcentaje <= 50) return 'very-low'
    if (porcentaje <= 100) return 'low'
    return 'normal'
  }

  const getCriticalBadge = (level) => {
    switch (level) {
      case 'critical':
        return <Badge variant="destructive" className="bg-red-600">Crítico</Badge>
      case 'very-low':
        return <Badge variant="destructive" className="bg-orange-600">Muy Bajo</Badge>
      case 'low':
        return <Badge variant="destructive">Bajo</Badge>
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  const handleIncrementStock = (id, amount = 10) => {
    const articulo = getArticuloById(id)
    if (articulo) {
      incrementarCantidad(id, amount)
      toast.success('Stock actualizado', {
        description: `Stock de ${articulo.nombre} incrementado en ${amount} unidades`
      })
    }
  }

  const handleDecrementStock = (id, amount = 1) => {
    const articulo = getArticuloById(id)
    if (articulo) {
      decrementarCantidad(id, amount)
      toast.success('Stock actualizado', {
        description: `Stock de ${articulo.nombre} decrementado en ${amount} unidad${amount > 1 ? 'es' : ''}`
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              Alertas de Bajo Stock
            </h1>
            <p className="text-gray-600">
              Artículos que requieren reabastecimiento en {isHydrated ? (inventarioActual?.nombre || 'Inventario Principal') : 'Inventario Principal'}
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{isHydrated ? articulosBajoStock.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                Artículos requieren atención
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticos</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {articulosBajoStock.filter(art => getCriticalLevel(art) === 'critical').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sin stock disponible
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Muy Bajos</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {articulosBajoStock.filter(art => getCriticalLevel(art) === 'very-low').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Menos del 50% del mínimo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Artículos con Bajo Stock */}
        {articulosBajoStock.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Excelente! No hay alertas de stock
                </h3>
                <p className="text-gray-600 mb-6">
                  Todos tus artículos tienen stock suficiente según los niveles mínimos establecidos
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/articulos">
                      <Package className="w-4 h-4 mr-2" />
                      Ver Inventario
                    </Link>
                  </Button>
                  <CreateArticleDialog>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Artículos
                    </Button>
                  </CreateArticleDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Alerta General */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Tienes <strong>{articulosBajoStock.length} artículo{articulosBajoStock.length !== 1 ? 's' : ''}</strong> con stock bajo. 
                Considera reabastecerlos para evitar interrupciones en tu operación.
              </AlertDescription>
            </Alert>

            {/* Lista de Artículos */}
            <div className="space-y-4">
              {articulosBajoStock
                .sort((a, b) => {
                  // Ordenar por criticidad: críticos primero
                  const levelA = getCriticalLevel(a)
                  const levelB = getCriticalLevel(b)
                  const order = { 'critical': 0, 'very-low': 1, 'low': 2 }
                  return (order[levelA] || 3) - (order[levelB] || 3)
                })
                .map(articulo => {
                  const criticalLevel = getCriticalLevel(articulo)
                  const porcentajeStock = ((articulo.cantidad / articulo.cantidadMinima) * 100).toFixed(0)
                  
                  return (
                    <Card key={articulo.id} className={`${
                      criticalLevel === 'critical' ? 'border-red-200 bg-red-50' :
                      criticalLevel === 'very-low' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                              {articulo.nombre}
                              {getCriticalBadge(criticalLevel)}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {articulo.categoria} • Última actualización: {new Date(articulo.ultimaModificacion).toLocaleDateString('es-ES')}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Información de Stock */}
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Stock actual:</span>
                                <span className={`font-bold ${
                                  criticalLevel === 'critical' ? 'text-red-600' : 
                                  criticalLevel === 'very-low' ? 'text-orange-600' : 
                                  'text-yellow-600'
                                }`}>
                                  {articulo.cantidad} unidades
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Mínimo requerido:</span>
                                <span className="text-gray-900">{articulo.cantidadMinima} unidades</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Déficit:</span>
                                <span className="font-semibold text-red-600">
                                  {Math.max(0, articulo.cantidadMinima - articulo.cantidad)} unidades
                                </span>
                              </div>
                            </div>
                            
                            {/* Barra de progreso */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Nivel de stock</span>
                                <span>{porcentajeStock}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    criticalLevel === 'critical' ? 'bg-red-500' :
                                    criticalLevel === 'very-low' ? 'bg-orange-500' :
                                    'bg-yellow-500'
                                  }`}
                                  style={{ width: `${Math.min(100, porcentajeStock)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Controles Rápidos */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Acciones Rápidas</h4>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIncrementStock(articulo.id, 5)}
                              >
                                +5
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIncrementStock(articulo.id, 10)}
                              >
                                +10
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIncrementStock(articulo.id, articulo.cantidadMinima)}
                              >
                                Al mínimo
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleIncrementStock(articulo.id, articulo.cantidadMinima * 2)}
                              >
                                Restock completo
                              </Button>
                            </div>
                            
                            {/* Controles manuales */}
                            <div className="flex items-center gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDecrementStock(articulo.id)}
                                disabled={articulo.cantidad <= 0}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <div className="text-center px-3">
                                <div className="font-bold">{articulo.cantidad}</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleIncrementStock(articulo.id)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm">Gestión</h4>
                            <div className="space-y-2">
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={`/articulos/${articulo.id}/editar`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar Artículo
                                </Link>
                              </Button>
                              <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href="/articulos">
                                  <Package className="w-4 h-4 mr-2" />
                                  Ver en Inventario
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 