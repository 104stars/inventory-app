'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, Package, Trash2 } from 'lucide-react'

export default function DeleteInventoryModal({ 
  open, 
  onOpenChange, 
  inventario, 
  hasArticles, 
  articlesCount, 
  onConfirm 
}) {
  const [confirmationInput, setConfirmationInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    if (hasArticles && confirmationInput !== inventario?.nombre) {
      return // No hacer nada si el nombre no coincide
    }

    setIsDeleting(true)
    try {
      await onConfirm()
      setConfirmationInput('')
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar inventario:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setConfirmationInput('')
    onOpenChange(false)
  }

  const isValid = hasArticles ? confirmationInput === inventario?.nombre : true

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del inventario */}
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">{inventario?.nombre}</h3>
            </div>
            {inventario?.descripcion && (
              <p className="text-sm text-gray-600 mb-2">{inventario.descripcion}</p>
            )}
            
            {hasArticles ? (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Contiene {articlesCount} artículo{articlesCount !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <div className="text-sm text-green-600">
                ✓ Inventario vacío
              </div>
            )}
          </div>

          {/* Advertencia y confirmación */}
          {hasArticles ? (
            <div className="space-y-4">
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-1">
                      ⚠️ Eliminación con artículos
                    </p>
                    <p className="text-sm text-orange-700">
                      Al eliminar este inventario, también se eliminarán permanentemente 
                      todos los {articlesCount} artículo{articlesCount !== 1 ? 's' : ''} que contiene.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-sm font-medium">
                  Para confirmar, escribe el nombre del inventario: <span className="font-bold">"{inventario?.nombre}"</span>
                </Label>
                <Input
                  id="confirmation"
                  type="text"
                  placeholder={inventario?.nombre}
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  className={confirmationInput === inventario?.nombre ? 'border-green-500' : 'border-red-200'}
                />
                {confirmationInput && confirmationInput !== inventario?.nombre && (
                  <p className="text-sm text-red-600">El nombre no coincide</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <p className="text-sm text-green-800">
                ¿Estás seguro de que quieres eliminar el inventario "{inventario?.nombre}"?
              </p>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid || isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              "Eliminando..."
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {hasArticles ? 'Eliminar Todo' : 'Eliminar Inventario'}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
