'use client'

import { useState } from 'react'
import useArticulosStore from '@/stores/articulos'
import useCategoriasStore from '@/stores/categorias'
import useInventariosStore from '@/stores/inventarios'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Save, Package, Plus } from 'lucide-react'

export default function CreateArticleDialog({ children, onSuccess }) {
  const [open, setOpen] = useState(false)
  const { addArticulo } = useArticulosStore()
  const { categorias } = useCategoriasStore()
  const { inventarios, inventarioActivo } = useInventariosStore()
  
  const [formData, setFormData] = useState({
    nombre: '',
    cantidad: '',
    cantidadMinima: '',
    categoria: '',
    inventarioId: inventarioActivo // Por defecto el inventario activo
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.cantidad || formData.cantidad < 0) {
      newErrors.cantidad = 'La cantidad debe ser un número positivo'
    }
    
    if (!formData.cantidadMinima || formData.cantidadMinima < 0) {
      newErrors.cantidadMinima = 'La cantidad mínima debe ser un número positivo'
    }
    
    if (formData.cantidadMinima && formData.cantidad && 
        parseInt(formData.cantidadMinima) > parseInt(formData.cantidad)) {
      newErrors.cantidadMinima = 'La cantidad mínima no puede ser mayor al stock actual'
    }

    if (!formData.inventarioId) {
      newErrors.inventarioId = 'Debe seleccionar un inventario'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const articulo = {
        nombre: formData.nombre.trim(),
        cantidad: parseInt(formData.cantidad) || 0,
        cantidadMinima: parseInt(formData.cantidadMinima) || 1,
        categoria: formData.categoria || 'Sin categoría',
        inventarioId: formData.inventarioId
      }
      
      addArticulo(articulo)
      
      // Resetear formulario
      setFormData({
        nombre: '',
        cantidad: '',
        cantidadMinima: '',
        categoria: '',
        inventarioId: inventarioActivo
      })
      setErrors({})
      setOpen(false)
      
      // Callback de éxito si se proporciona
      if (onSuccess) {
        onSuccess(articulo)
      }
    } catch (error) {
      console.error('Error al crear artículo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Resetear formulario al cerrar
      setFormData({
        nombre: '',
        cantidad: '',
        cantidadMinima: '',
        categoria: '',
        inventarioId: inventarioActivo
      })
      setErrors({})
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Nuevo Artículo
          </DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo artículo para tu inventario
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Inventario */}
          <div className="space-y-2">
            <Label htmlFor="inventario">Inventario de Destino *</Label>
            <Select value={formData.inventarioId} onValueChange={(value) => handleChange('inventarioId', value)}>
              <SelectTrigger className={errors.inventarioId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona un inventario" />
              </SelectTrigger>
              <SelectContent>
                {inventarios.map(inventario => (
                  <SelectItem key={inventario.id} value={inventario.id}>
                    {inventario.nombre}
                    {inventario.id === inventarioActivo && ' (Activo)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.inventarioId && (
              <p className="text-sm text-red-600">{errors.inventarioId}</p>
            )}
          </div>

          {/* Nombre del Artículo */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Artículo *</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej: Tornillo M8, Pintura Blanca, etc."
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Cantidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad Actual *</Label>
              <Input
                id="cantidad"
                type="number"
                placeholder="0"
                min="0"
                value={formData.cantidad}
                onChange={(e) => handleChange('cantidad', e.target.value)}
                className={errors.cantidad ? 'border-red-500' : ''}
              />
              {errors.cantidad && (
                <p className="text-sm text-red-600">{errors.cantidad}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidadMinima">Cantidad Mínima *</Label>
              <Input
                id="cantidadMinima"
                type="number"
                placeholder="1"
                min="0"
                value={formData.cantidadMinima}
                onChange={(e) => handleChange('cantidadMinima', e.target.value)}
                className={errors.cantidadMinima ? 'border-red-500' : ''}
              />
              {errors.cantidadMinima && (
                <p className="text-sm text-red-600">{errors.cantidadMinima}</p>
              )}
              <p className="text-xs text-gray-500">
                Se mostrará alerta cuando esté por debajo de este valor
              </p>
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sin categoría">Sin categoría</SelectItem>
                {categorias.map(categoria => (
                  <SelectItem key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Puedes crear nuevas categorías desde la sección de categorías
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Crear Artículo'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 