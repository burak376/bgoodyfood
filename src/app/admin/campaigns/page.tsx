'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Gift, 
  Image, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  Upload, 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar,
  Target,
  Star,
  Clock,
  Users
} from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import AdminLayout from '@/components/admin/admin-layout'

interface CampaignModal {
  id?: string
  title: string
  description?: string
  imageUrl?: string
  isActive: boolean
  discount?: number
  buttonText?: string
  buttonLink?: string
  startDate?: string
  endDate?: string
  targetAudience?: 'all' | 'new' | 'returning'
  priority?: number
  createdAt?: string
  updatedAt?: string
}

export default function CampaignsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [campaigns, setCampaigns] = useState<CampaignModal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<CampaignModal | null>(null)
  
  const [formData, setFormData] = useState<CampaignModal>({
    title: '',
    description: '',
    imageUrl: '',
    isActive: true,
    discount: 10,
    buttonText: 'Kampanyayı İncele',
    buttonLink: '/products',
    startDate: '',
    endDate: '',
    targetAudience: 'all',
    priority: 1
  })

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login')
      return
    }

    loadCampaigns()
  }, [user, router])

  const loadCampaigns = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCampaigns(data)
      }
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error)
      toast({
        title: 'Hata',
        description: 'Kampanyalar yüklenemedi',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      isActive: true,
      discount: 10,
      buttonText: 'Kampanyayı İncele',
      buttonLink: '/products',
      startDate: '',
      endDate: '',
      targetAudience: 'all',
      priority: 1
    })
    setEditingCampaign(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingCampaign?.id 
        ? `/api/admin/campaigns/${editingCampaign.id}` 
        : '/api/admin/campaigns'
      const method = editingCampaign?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        
        if (editingCampaign?.id) {
          setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? data : c))
        } else {
          setCampaigns(prev => [...prev, data])
        }
        
        toast({
          title: 'Başarılı',
          description: editingCampaign?.id ? 'Kampanya güncellendi' : 'Kampanya oluşturuldu'
        })
        
        setIsDialogOpen(false)
        resetForm()
      } else {
        throw new Error('İşlem başarısız')
      }
    } catch (error) {
      console.error('Kampanya kaydedilirken hata:', error)
      toast({
        title: 'Hata',
        description: 'Kampanya kaydedilemedi',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (campaign: CampaignModal) => {
    setEditingCampaign(campaign)
    setFormData(campaign)
    setIsDialogOpen(true)
  }

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId))
        toast({
          title: 'Başarılı',
          description: 'Kampanya silindi'
        })
      }
    } catch (error) {
      console.error('Kampanya silinirken hata:', error)
      toast({
        title: 'Hata',
        description: 'Kampanya silinemedi',
        variant: 'destructive'
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'new': return 'Yeni Kullanıcılar'
      case 'returning': return 'Geri Dönen Kullanıcılar'
      default: return 'Tüm Kullanıcılar'
    }
  }

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'new': return <Users className="w-3 h-3" />
      case 'returning': return <Clock className="w-3 h-3" />
      default: return <Target className="w-3 h-3" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  if (isLoading) {
    return (
      <AdminLayout title="Kampanya Modal Yönetimi" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p>Yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Kampanya Modal Yönetimi" subtitle="Kullanıcıların karşısına çıkacak kampanya modallarını yönetin">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kampanya Modalları</h1>
            <p className="text-gray-600">Kullanıcıların karşısına çıkacak kampanya modal'larını oluşturun ve yönetin</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Kampanya
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign?.id ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Oluştur'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Temel Bilgiler */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Kampanya Başlığı</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Kampanya başlığı"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Kampanya açıklaması"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount">İndirim Oranı (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          discount: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        placeholder="10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Öncelik</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority || ''}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          priority: e.target.value ? parseInt(e.target.value) : 1 
                        }))}
                        placeholder="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Tarih ve Hedef Kitle */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Başlangıç Tarihi</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Bitiş Tarihi</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">Hedef Kitle</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value: 'all' | 'new' | 'returning') => 
                        setFormData(prev => ({ ...prev, targetAudience: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hedef kitle seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                        <SelectItem value="new">Yeni Kullanıcılar</SelectItem>
                        <SelectItem value="returning">Geri Dönen Kullanıcılar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Buton Ayarları */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Buton Metni</Label>
                    <Input
                      id="buttonText"
                      value={formData.buttonText}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Kampanyayı İncele"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonLink">Buton Linki</Label>
                    <Input
                      id="buttonLink"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                      placeholder="/products"
                    />
                  </div>
                </div>

                {/* Görsel Yükleme */}
                <div className="space-y-2">
                  <Label htmlFor="image">Kampanya Görseli</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {formData.imageUrl ? (
                      <div className="space-y-4">
                        <img
                          src={formData.imageUrl}
                          alt="Kampanya görseli önizlemesi"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image')?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Görseli Değiştir
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Gift className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Görsel yüklemek için tıklayın
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image')?.click()}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Görsel Yükle
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Durum */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Kampanya Durumu</Label>
                    <p className="text-sm text-gray-500">
                      Kampanyanın aktif olup olmayacağını belirler
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      resetForm()
                    }}
                  >
                    İptal
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Settings className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Kampanya Listesi */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(campaign)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(campaign.id!)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Görsel */}
                {campaign.imageUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Durum ve Özellikler */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={campaign.isActive ? "default" : "secondary"}
                      className="flex items-center"
                    >
                      {campaign.isActive ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          Pasif
                        </>
                      )}
                    </Badge>
                    
                    {campaign.discount && (
                      <Badge className="bg-red-100 text-red-800">
                        %{campaign.discount} İNDİRİM
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className="flex items-center">
                      {getTargetAudienceIcon(campaign.targetAudience || 'all')}
                      <span className="ml-1">
                        {getTargetAudienceLabel(campaign.targetAudience || 'all')}
                      </span>
                    </Badge>
                    
                    <div className="flex items-center text-gray-500">
                      <Star className="w-3 h-3 mr-1" />
                      Öncelik: {campaign.priority}
                    </div>
                  </div>
                </div>

                {/* Tarih Bilgisi */}
                {(campaign.startDate || campaign.endDate) && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {campaign.startDate && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Başlangıç: {formatDate(campaign.startDate)}
                      </div>
                    )}
                    {campaign.endDate && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Bitiş: {formatDate(campaign.endDate)}
                      </div>
                    )}
                  </div>
                )}

                {/* Buton Bilgisi */}
                {campaign.buttonText && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Buton:</p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      {campaign.buttonText}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {campaigns.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz kampanya bulunmuyor</h3>
              <p className="text-gray-600 mb-6">İlk kampanyanızı oluşturarak başlayın.</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                İlk Kampanyayı Oluştur
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bilgi Kartı */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Bilgi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Kampanya modalları, hedef kitleye göre kullanıcıların karşısına çıkar</p>
              <p>• Öncelik değeri yüksek olan kampanyalar önce gösterilir</p>
              <p>• Tarih aralığı belirtilen kampanyalar sadece o tarihlerde aktif olur</p>
              <p>• Pasif kampanyalar hiçbir kullanıcıya gösterilmez</p>
              <p>• Her kullanıcı aynı anda sadece bir kampanya görür</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}