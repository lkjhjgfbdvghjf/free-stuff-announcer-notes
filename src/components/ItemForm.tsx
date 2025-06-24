import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemFormProps {
  onAddItem: (item: Omit<FreeItem, 'id' | 'dateAdded'>) => void;
  categories?: string[];
}

const ItemForm = ({ onAddItem, categories }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: 1,
    contactInfo: '',
    location: '',
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

  // Load categories from localStorage or use provided categories
  useEffect(() => {
    if (categories) {
      setAvailableCategories(categories);
    } else {
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setAvailableCategories(JSON.parse(savedCategories));
      }
    }
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      return;
    }

    onAddItem({
      ...formData,
      isActive: true
    });

    setFormData({
      title: '',
      description: '',
      category: '',
      quantity: 1,
      contactInfo: '',
      location: '',
      imageUrl: ''
    });
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-lg dark:text-gray-100">เพิ่มของแจกใหม่</CardTitle>
        </div>
        <CardDescription className="dark:text-gray-300">
          เพิ่มข้อมูลของที่ต้องการแจกให้คนทั่วไป (สามารถใส่ลิงก์ในรายละเอียดได้)
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
              placeholder="อธิบายรายละเอียดของสิ่งของ สภาพ ขนาด หรือใส่ลิงก์รูปภาพ ฯลฯ"
              className="min-h-[80px] dark:bg-gray-700 dark:text-gray-100"
              required
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
