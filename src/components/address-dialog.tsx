'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Home, 
  Briefcase, 
  Building,
  Save,
  X,
  Map
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Address {
  id: string
  title: string
  address: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

interface AddressDialogProps {
  trigger?: React.ReactNode
  onAddressUpdate?: () => void
}

export function AddressDialog({ trigger, onAddressUpdate }: AddressDialogProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    isDefault: false
  })

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Addresses fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAddresses()
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      title: '',
      address: '',
      isDefault: false
    })
    setEditingAddress(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.address.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      if (editingAddress) {
        // Update existing address
        const response = await fetch(`/api/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          toast({
            title: "Başarılı",
            description: "Adres başarıyla güncellendi.",
          })
          fetchAddresses()
          resetForm()
        } else {
          throw new Error('Update failed')
        }
      } else {
        // Create new address
        const response = await fetch('/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          toast({
            title: "Başarılı",
            description: "Yeni adres başarıyla eklendi.",
          })
          fetchAddresses()
          resetForm()
        } else {
          throw new Error('Create failed')
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: editingAddress ? "Adres güncellenemedi." : "Adres eklenemedi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      title: address.title,
      address: address.address,
      isDefault: address.isDefault
    })
  }

  const handleDelete = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Başarılı",
          description: "Adres başarıyla silindi.",
        })
        fetchAddresses()
        if (editingAddress?.id === addressId) {
          resetForm()
        }
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Adres silinemedi.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      // Update all addresses to non-default first
      const updatePromises = addresses.map(addr => 
        fetch(`/api/addresses/${addr.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...addr,
            isDefault: addr.id === addressId
          })
        })
      )

      await Promise.all(updatePromises)
      
      toast({
        title: "Başarılı",
        description: "Varsayılan adres güncellendi.",
      })
      fetchAddresses()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Varsayılan adres güncellenemedi.",
        variant: "destructive",
      })
    }
  }

  const getAddressIcon = (title: string) => {
    if (title.toLowerCase().includes('ev')) return <Home className="w-5 h-5" />
    if (title.toLowerCase().includes('iş')) return <Briefcase className="w-5 h-5" />
    return <Building className="w-5 h-5" />
  }

  const defaultTrigger = (
    <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
      <Map className="w-4 h-4 mr-2" />
      Yeni Adres Ekle
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Adres Yönetimi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Address Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Adres Başlığı
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Ev Adresi, İş Adresi"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Adres Detayı
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Mahalle, Cadde, Sokak, Kapı No vb."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Bu adresi varsayılan yap
              </label>
            </div>

            <DialogFooter className="flex space-x-2">
              {editingAddress && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingAddress ? 'Güncelle' : 'Ekle'}
              </Button>
            </DialogFooter>
          </form>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Kayıtlı Adresler</h3>
            
            {isLoading && addresses.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Yükleniyor...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Henüz kayıtlı adresiniz bulunmuyor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg transition-all ${
                      editingAddress?.id === address.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          address.isDefault ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <div className={address.isDefault ? 'text-green-600' : 'text-gray-600'}>
                            {getAddressIcon(address.title)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{address.title}</h4>
                            {address.isDefault && (
                              <Badge className="bg-green-100 text-green-800 text-xs">Varsayılan</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {!address.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Varsayılan yap"
                          >
                            <Home className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(address)}
                          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Düzenle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}