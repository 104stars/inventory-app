import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import useInventariosStore from '@/stores/inventarios'
import useArticulosStore from '@/stores/articulos'
import { Folder } from 'lucide-react'

export default function InventarioSelector() {
  const { inventarios, inventarioActivo, setInventarioActivo } = useInventariosStore()
  const { setInventarioActivo: setArticulosInventario } = useArticulosStore()
  
  const handleInventarioChange = (inventarioId) => {
    setInventarioActivo(inventarioId)
    setArticulosInventario(inventarioId)
  }

  return (
    <div className="flex items-center gap-2">
      <Folder className="w-4 h-4 text-gray-500" />
      <Select value={inventarioActivo} onValueChange={handleInventarioChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Seleccionar inventario" />
        </SelectTrigger>
        <SelectContent>
          {inventarios.map(inventario => (
            <SelectItem key={inventario.id} value={inventario.id}>
              <div className="flex items-center gap-2">
                <span>{inventario.nombre}</span>
                {inventario.id === inventarioActivo && (
                  <Badge variant="secondary" className="text-xs">Activo</Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 