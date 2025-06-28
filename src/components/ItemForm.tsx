import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Upload, Link } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemFormProps {
  onAddItem: (item: Omit<FreeItem, 'id' | 'dateAdded'>) => void;
  categories?: string[];
  editingItem?: FreeItem | null;
  onUpdateItem?: (item: FreeItem) => void;
  onCancelEdit?: () => void;
}

const ItemForm = ({ onAddItem, categories, editingItem, onUpdateItem, onCancelEdit }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subDescription: '',
    category: '',
    quantity: 1,
    imageUrl: '',
    // App Details
    publisher: '',
    updatedDate: '',
    size: '',
    version: '',
    requirements: '',
    downloadCount: '', // จำนวนคนดาวน์โหลด
    appIcon: '', // URL ไอคอนแอป
    // Gallery Images
    galleryImages: [] as string[]
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([
    'เสื้อผ้า',
    'อิเล็กทรอนิกส์',
    'หนังสือ',
    'ของใช้ในบ้าน',
    'ของเล่น',
    'อาหาร',
    'อื่นๆ'
  ]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

  // Update categories when props change
  useEffect(() => {
    if (categories && categories.length > 0) {
      setAvailableCategories(categories);
    } else {
      // Load from localStorage if no props provided
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setAvailableCategories(parsedCategories);
      }
    }
  }, [categories]);

  // Listen for localStorage changes to update categories in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        const parsedCategories = JSON.parse(savedCategories);
        setAvailableCategories(parsedCategories);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        description: editingItem.description,
        subDescription: editingItem.subDescription || '',
        category: editingItem.category,
        quantity: editingItem.quantity || 1,
        imageUrl: editingItem.imageUrl || '',
        // App Details
        publisher: editingItem.publisher || '',
        updatedDate: editingItem.updatedDate || '',
        size: editingItem.size || '',
        version: editingItem.version || '',
        requirements: editingItem.requirements || '',
        downloadCount: editingItem.downloadCount || '',
        appIcon: editingItem.appIcon || '',
        // Gallery Images
        galleryImages: editingItem.galleryImages || []
      });
      setImagePreview(editingItem.imageUrl || '');
    }
  }, [editingItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({...formData, imageUrl: result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData({...formData, imageUrl: url});
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      return;
    }
    if (editingItem && onUpdateItem) {
      onUpdateItem({ ...editingItem, ...formData });
    } else {
      onAddItem({
        ...formData,
        isActive: true
      });
    }
    // Reset form
    setFormData({
      title: '',
      description: '',
      subDescription: '',
      category: '',
      quantity: 1,
      imageUrl: '',
      publisher: '',
      updatedDate: '',
      size: '',
      version: '',
      requirements: '',
      downloadCount: '',
      appIcon: '',
      galleryImages: []
    });
    setImageFile(null);
    setImagePreview('');
    if (onCancelEdit) onCancelEdit();
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">
            {editingItem ? 'แก้ไขของแจก' : 'เพิ่มของแจกใหม่'}
          </CardTitle>
          {editingItem && onCancelEdit && (
            <Button size="sm" variant="outline" onClick={onCancelEdit}>
              ยกเลิก
            </Button>
          )}
        </div>
        <CardDescription className="dark:text-gray-300">
          เพิ่มข้อมูลของที่ต้องการแจกให้คนทั่วไป
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-gray-200">ชื่อสิ่งของ *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="เช่น เสื้อเชิ้ตสีขาว"
                className="dark:bg-gray-700 dark:text-gray-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="dark:text-gray-200">หมวดหมู่ *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-gray-200">ลิงก์แอป *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="ใส่ลิงก์ดาวน์โหลดแอป เช่น https://play.google.com/store/apps/details?id=com.example.app"
              className="dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subDescription" className="dark:text-gray-200">รายละเอียดแอป</Label>
            <Textarea
              id="subDescription"
              value={formData.subDescription}
              onChange={(e) => setFormData({...formData, subDescription: e.target.value})}
              placeholder="อธิบายรายละเอียดของแอป คุณสมบัติ การใช้งาน ฯลฯ"
              className="min-h-[80px] dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="dark:text-gray-200">จำนวน</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              className="dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* App Details Section */}
          <div className="space-y-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              รายละเอียดแอปพลิเคชัน (เสริม)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="downloadCount" className="dark:text-gray-200">จำนวนดาวน์โหลด</Label>
                <Input
                  id="downloadCount"
                  value={formData.downloadCount}
                  onChange={(e) => setFormData({...formData, downloadCount: e.target.value})}
                  placeholder="เช่น 1M+, 500K+, 10K+"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="appIcon" className="dark:text-gray-200">ไอคอนแอป (URL)</Label>
                <Input
                  id="appIcon"
                  value={formData.appIcon}
                  onChange={(e) => setFormData({...formData, appIcon: e.target.value})}
                  placeholder="เช่น https://example.com/app-icon.png"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
                {/* App Icon Preview */}
                {formData.appIcon && (
                  <div className="mt-2">
                    <img 
                      src={formData.appIcon} 
                      alt="ตัวอย่างไอคอนแอป" 
                      className="w-12 h-12 object-cover rounded-xl border dark:border-gray-600"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="publisher" className="dark:text-gray-200">ผู้พัฒนา</Label>
                <Input
                  id="publisher"
                  value={formData.publisher}
                  onChange={(e) => setFormData({...formData, publisher: e.target.value})}
                  placeholder="เช่น GARENA INTERNATIONAL I PRIVATE LIMITED"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="updatedDate" className="dark:text-gray-200">วันที่อัปเดต</Label>
                <Input
                  id="updatedDate"
                  value={formData.updatedDate}
                  onChange={(e) => setFormData({...formData, updatedDate: e.target.value})}
                  placeholder="เช่น May 23, 2025"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size" className="dark:text-gray-200">ขนาดไฟล์</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="เช่น 377 MB"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="version" className="dark:text-gray-200">เวอร์ชัน</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({...formData, version: e.target.value})}
                  placeholder="เช่น 1.111.1"
                  className="dark:bg-gray-600 dark:text-gray-100"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements" className="dark:text-gray-200">ความต้องการระบบ</Label>
              <Input
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="เช่น Android 4.1 ขึ้นไป"
                className="dark:bg-gray-600 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="dark:text-gray-200">รูปภาพหลัก</Label>
            <Tabs value={imageMode} onValueChange={(value) => setImageMode(value as 'upload' | 'url')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  อัปโหลด
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  ลิงก์
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="dark:bg-gray-700 dark:text-gray-100"
                />
              </TabsContent>
              
              <TabsContent value="url" className="space-y-2">
                <Input
                  placeholder="ใส่ลิงก์รูปภาพหลัก"
                  value={imageMode === 'url' ? formData.imageUrl : ''}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="dark:bg-gray-700 dark:text-gray-100"
                />
              </TabsContent>
            </Tabs>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="ตัวอย่างรูปภาพหลัก" 
                  className="w-full max-w-xs h-32 object-cover rounded-lg border dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Gallery Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="dark:text-gray-200">ภาพประกอบแอป (เสริม)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newUrl = prompt('ใส่ลิงก์ภาพประกอบ:');
                  if (newUrl && newUrl.trim()) {
                    setFormData({
                      ...formData,
                      galleryImages: [...formData.galleryImages, newUrl.trim()]
                    });
                  }
                }}
                className="text-xs"
              >
                + เพิ่มภาพ
              </Button>
            </div>
            
            {/* Gallery Images List */}
            {formData.galleryImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {formData.galleryImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`ภาพประกอบ ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border dark:border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg==';
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newImages = formData.galleryImages.filter((_, i) => i !== index);
                        setFormData({ ...formData, galleryImages: newImages });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              เพิ่มภาพประกอบเพื่อแสดงในแกลเลอรี่ เมื่อผู้ใช้คลิก "ดูรายละเอียดเพิ่มเติม"
            </p>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มของแจก
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;
