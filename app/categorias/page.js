'use client'

import { useState } from 'react'
import useCategoriasStore from '@/stores/categorias'
import useArticulosStore from '@/stores/articulos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Plus, Edit, Trash2, Tag, Save, X } from 'lucide-react'
import { COLORES_CATEGORIAS, ICONS_CATEGORIAS } from '@/constants/defaultCategories'
import Link from 'next/link'

export default function CategoriasPage() {
  const { categorias, addCategoria, updateCategoria, deleteCategoria } = useCategoriasStore()
  const { articulos } = useArticulosStore()
  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    color: COLORES_CATEGORIAS[0],
    icono: ICONS_CATEGORIAS[0]
  })
  const [errors, setErrors] = useState({})

  const getArticulosEnCategoria = (nombreCategoria) => {
    return articulos.filter(art => art.categoria === nombreCategoria).length
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validaciones
    const newErrors = {}
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    // Verificar si ya existe una categoría con el mismo nombre (excepto la que se está editando)
    const existeCategoria = categorias.find(cat => 
      cat.nombre.toLowerCase() === formData.nombre.toLowerCase() && 
      cat.id !== editingId
    )
    if (existeCategoria) {
      newErrors.nombre = 'Ya existe una categoría con este nombre'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Crear o actualizar categoría
    if (editingId) {
      updateCategoria(editingId, formData)
    } else {
      addCategoria(formData)
    }

    // Resetear formulario
    setFormData({
      nombre: '',
      color: COLORES_CATEGORIAS[0],
      icono: ICONS_CATEGORIAS[0]
    })
    setShowForm(false)
    setEditingId(null)
    setErrors({})
  }

  const handleEdit = (categoria) => {
    setFormData({
      nombre: categoria.nombre,
      color: categoria.color,
      icono: categoria.icono
    })
    setEditingId(categoria.id)
    setShowForm(true)
  }

  const handleDelete = (categoria) => {
    const articulosEnCategoria = getArticulosEnCategoria(categoria.nombre)
    
    if (articulosEnCategoria > 0) {
      alert(`No se puede eliminar esta categoría porque tiene ${articulosEnCategoria} artículo${articulosEnCategoria !== 1 ? 's' : ''} asignado${articulosEnCategoria !== 1 ? 's' : ''}. Por favor, reasigna o elimina los artículos primero.`)
      return
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
      deleteCategoria(categoria.id)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: '',
      color: COLORES_CATEGORIAS[0],
      icono: ICONS_CATEGORIAS[0]
    })
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
              <Tag className="w-8 h-8 text-blue-500" />
              Gestión de Categorías
            </h1>
            <p className="text-gray-600">
              Organiza y administra las categorías de tu inventario
            </p>
          </div>
        </div>

        {/* Botón para agregar nueva categoría */}
        {!showForm && (
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Crear Nueva Categoría</h3>
                  <p className="text-gray-600">Añade una nueva categoría para organizar mejor tu inventario</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Categoría
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
                {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
              </CardTitle>
              <CardDescription>
                {editingId ? 'Modifica los datos de la categoría' : 'Completa los datos para crear una nueva categoría'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre de la Categoría *</Label>
                    <Input
                      id="nombre"
                      type="text"
                      placeholder="Ej: Materias Primas"
                      value={formData.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className={errors.nombre ? 'border-red-500' : ''}
                    />
                    {errors.nombre && (
                      <p className="text-sm text-red-600">{errors.nombre}</p>
                    )}
                  </div>

                  {/* Color */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select value={formData.color} onValueChange={(value) => handleChange('color', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un color" />
                      </SelectTrigger>
                      <SelectContent>
                        {COLORES_CATEGORIAS.map(color => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color }}
                              ></div>
                              {color}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Icono */}
                  <div className="space-y-2">
                    <Label htmlFor="icono">Icono</Label>
                    <Select value={formData.icono} onValueChange={(value) => handleChange('icono', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un icono" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICONS_CATEGORIAS.map(icono => (
                          <SelectItem key={icono} value={icono}>
                            {icono}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vista previa */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="text-sm font-medium text-gray-700">Vista previa:</Label>
                  <div className="mt-2">
                    <Badge 
                      style={{ backgroundColor: formData.color, color: 'white' }}
                      className="text-sm"
                    >
                      {formData.icono} {formData.nombre || 'Nombre de la categoría'}
                    </Badge>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Actualizar Categoría' : 'Crear Categoría'}
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

        {/* Lista de Categorías */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías Existentes</CardTitle>
            <CardDescription>
              {categorias.length} categoría{categorias.length !== 1 ? 's' : ''} registrada{categorias.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categorias.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
                <p className="text-gray-600 mb-4">Crea tu primera categoría para organizar tu inventario</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Categoría
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map(categoria => {
                  const articulosCount = getArticulosEnCategoria(categoria.nombre)
                  
                  return (
                    <Card key={categoria.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <Badge 
                            style={{ backgroundColor: categoria.color, color: 'white' }}
                            className="text-sm"
                          >
                            {categoria.icono} {categoria.nombre}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Estadísticas */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Artículos:</span>
                            <span className="font-semibold">{articulosCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Color:</span>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: categoria.color }}
                              ></div>
                              <span className="text-xs font-mono">{categoria.color}</span>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleEdit(categoria)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(categoria)}
                            disabled={articulosCount > 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {articulosCount > 0 && (
                          <div className="text-xs text-gray-500 pt-2 border-t">
                            💡 Elimina o reasigna los artículos para poder borrar esta categoría
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💡 Consejos para Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Usa nombres descriptivos y específicos para tus categorías</li>
              <li>• Los colores ayudan a identificar rápidamente los tipos de artículos</li>
              <li>• No puedes eliminar categorías que tengan artículos asignados</li>
              <li>• Las categorías facilitan la búsqueda y organización del inventario</li>
              <li>• Puedes editar categorías existentes en cualquier momento</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 