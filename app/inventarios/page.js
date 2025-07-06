'use client'

import { useState } from 'react'
import useInventariosStore from '@/stores/inventarios'
import useArticulosStore from '@/stores/articulos'
import DeleteInventoryModal from '@/components/inventarios/DeleteInventoryModal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Edit, Trash2, Folder, Save, X, Package, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function InventariosPage() {
  const { 
    inventarios, 
    inventarioActivo, 
    addInventario, 
    updateInventario, 
    deleteInventario, 
    setInventarioActivo 
  } = useInventariosStore()
  
  const { articulos, deleteArticulosByInventario } = useArticulosStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })
  const [errors, setErrors] = useState({})
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    inventario: null
  })

  const getInventarioStats = (inventarioId) => {
    const articulosDelInventario = articulos.filter(art => art.inventarioId === inventarioId)
    const bajoStock = articulosDelInventario.filter(art => art.cantidad <= art.cantidadMinima)
    const totalUnidades = articulosDelInventario.reduce((total, art) => total + art.cantidad, 0)
    
    return {
      totalArticulos: articulosDelInventario.length,
      bajoStock: bajoStock.length,
      totalUnidades,
      categorias: new Set(articulosDelInventario.map(art => art.categoria)).size
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    const newErrors = {}
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    // Verificar si ya existe un inventario con el mismo nombre (excepto el que se está editando)
    const existeInventario = inventarios.find(inv => 
      inv.nombre.toLowerCase() === formData.nombre.toLowerCase() && 
      inv.id !== editingId
    )
    if (existeInventario) {
      newErrors.nombre = 'Ya existe un inventario con este nombre'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Crear o actualizar inventario
    if (editingId) {
      updateInventario(editingId, formData)
    } else {
      addInventario(formData)
    }

    // Resetear formulario
    setFormData({ nombre: '', descripcion: '' })
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  const handleEdit = (inventario) => {
    setFormData({
      nombre: inventario.nombre,
      descripcion: inventario.descripcion || ''
    })
    setEditingId(inventario.id)
    setShowForm(true)
  }

  const handleDelete = (inventario) => {
    setDeleteModal({
      open: true,
      inventario: inventario
    })
  }

  const handleConfirmDelete = async () => {
    const inventario = deleteModal.inventario
    if (!inventario) return

    try {
      // Primero eliminar todos los artículos del inventario
      deleteArticulosByInventario(inventario.id)
      
      // Luego eliminar el inventario
      const wasDeleted = deleteInventario(inventario.id)
      if (!wasDeleted) {
        alert('No se puede eliminar el último inventario. Debe existir al menos uno.')
        return
      }

      // Cerrar el modal
      setDeleteModal({ open: false, inventario: null })
    } catch (error) {
      console.error('Error al eliminar inventario:', error)
      alert('Ocurrió un error al eliminar el inventario')
    }
  }

  const handleCancel = () => {
    setFormData({ nombre: '', descripcion: '' })
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSwitchInventario = (inventarioId) => {
    setInventarioActivo(inventarioId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Folder className="w-8 h-8 text-blue-500" />
              Gestión de Inventarios
            </h1>
            <p className="text-gray-600">
              Administra múltiples inventarios para tu negocio
            </p>
          </div>
        </div>

        {/* Inventario Activo */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventario Activo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {inventarios.find(inv => inv.id === inventarioActivo)?.nombre}
                </h3>
                <p className="text-blue-700">
                  {inventarios.find(inv => inv.id === inventarioActivo)?.descripcion}
                </p>
              </div>
              <Badge className="bg-blue-600 text-white">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Botón para agregar nuevo inventario */}
        {!showForm && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Crear Nuevo Inventario</h3>
                  <p className="text-gray-600">Añade un nuevo inventario para organizar diferentes líneas de productos</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Inventario
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? 'Editar Inventario' : 'Nuevo Inventario'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Modifica los datos del inventario' : 'Completa los datos para crear un nuevo inventario'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Inventario *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ej: Almacén Principal, Sucursal Norte"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className={errors.nombre ? 'border-red-500' : ''}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-red-600">{errors.nombre}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input
                      id="descripcion"
                      type="text"
                      placeholder="Descripción opcional del inventario"
                      value={formData.descripcion}
                      onChange={(e) => handleChange('descripcion', e.target.value)}
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Actualizar Inventario' : 'Crear Inventario'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Inventarios */}
        <Card>
          <CardHeader>
            <CardTitle>Inventarios Existentes</CardTitle>
            <CardDescription>
              {inventarios.length} inventario{inventarios.length !== 1 ? 's' : ''} registrado{inventarios.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventarios.map(inventario => {
                const stats = getInventarioStats(inventario.id)
                const isActive = inventario.id === inventarioActivo
                
                return (
                  <Card 
                    key={inventario.id} 
                    className={`hover:shadow-md transition-shadow ${
                      isActive ? 'border-blue-200 bg-blue-50' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Folder className="w-5 h-5" />
                            {inventario.nombre}
                            {isActive && <Badge className="bg-blue-600 text-white">Activo</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {inventario.descripcion || 'Sin descripción'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Estadísticas */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Artículos:</span>
                            <span className="font-semibold">{stats.totalArticulos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Categorías:</span>
                            <span className="font-semibold">{stats.categorias}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total unidades:</span>
                            <span className="font-semibold">{stats.totalUnidades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bajo stock:</span>
                            <span className={`font-semibold ${stats.bajoStock > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {stats.bajoStock}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Alertas */}
                      {stats.bajoStock > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                          <span className="text-sm text-orange-800">
                            {stats.bajoStock} artículo{stats.bajoStock !== 1 ? 's' : ''} con bajo stock
                          </span>
                        </div>
                      )}

                      {/* Acciones */}
                      <div className="space-y-2">
                        {!isActive && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleSwitchInventario(inventario.id)}
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Activar Inventario
                          </Button>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEdit(inventario)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          
                          {inventarios.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(inventario)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Info adicional */}
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Creado: {new Date(inventario.fechaCreacion).toLocaleDateString('es-ES')}
                        {stats.totalArticulos > 0 && inventarios.length > 1 && (
                          <div className="mt-1">
                            ⚠️ Al eliminar este inventario se borrarán también todos sus artículos
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Consejos para Inventarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Usa nombres descriptivos para identificar fácilmente cada inventario</li>
              <li>• Solo un inventario puede estar activo a la vez</li>
              <li>• Los artículos pertenecen al inventario activo cuando se crean</li>
              <li>• Al eliminar un inventario se borran también todos sus artículos</li>
              <li>• Siempre debe existir al menos un inventario</li>
            </ul>
          </CardContent>
        </Card>

        {/* Modal de confirmación de eliminación */}
        <DeleteInventoryModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal(prev => ({ ...prev, open }))}
          inventario={deleteModal.inventario}
          hasArticles={deleteModal.inventario ? getInventarioStats(deleteModal.inventario.id).totalArticulos > 0 : false}
          articlesCount={deleteModal.inventario ? getInventarioStats(deleteModal.inventario.id).totalArticulos : 0}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
} 