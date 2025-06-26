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
    imageUrl: ''
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
        imageUrl: editingItem.imageUrl || ''
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
      imageUrl: ''
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
            <Label htmlFor="description" className="dark:text-gray-200">รายละเอียด *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="อธิบายรายละเอียดของสิ่งของ สภาพ ขนาด ฯลฯ"
              className="min-h-[80px] dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subDescription" className="dark:text-gray-200">รายละเอียดเพิ่มเติม (ย่อย)</Label>
            <Input
              id="subDescription"
              value={formData.subDescription}
              onChange={(e) => setFormData({...formData, subDescription: e.target.value})}
              placeholder="ข้อความสั้น ๆ เช่น เงื่อนไข/จุดนัดรับ ฯลฯ"
              className="dark:bg-gray-700 dark:text-gray-100"
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

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="dark:text-gray-200">รูปภาพสินค้า</Label>
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
                  placeholder="ใส่ลิงก์รูปภาพ"
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
                  alt="ตัวอย่างรูปภาพ" 
                  className="w-full max-w-xs h-32 object-cover rounded-lg border dark:border-gray-600"
                />
              </div>
            )}
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
