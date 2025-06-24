
import React, { useState } from 'react';
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
}

const ItemForm = ({ onAddItem }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: 1,
    contactInfo: '',
    location: '',
    imageUrl: ''
  });

  const categories = [
    'เสื้อผ้า',
    'อิเล็กทรอนิกส์',
    'หนังสือ',
    'ของใช้ในบ้าน',
    'ของเล่น',
    'อาหาร',
    'อื่นๆ'
  ];

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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          <CardTitle className="text-lg">เพิ่มของแจกใหม่</CardTitle>
        </div>
        <CardDescription>
          เพิ่มข้อมูลของที่ต้องการแจกให้คนทั่วไป
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">ชื่อสิ่งของ *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="เช่น เสื้อเชิ้ตสีขาว"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่ *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="อธิบายรายละเอียดของสิ่งของ สภาพ ขนาด ฯลฯ"
              className="min-h-[80px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">จำนวน</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 1})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">สถานที่</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="เช่น กรุงเทพมหานคร"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">ข้อมูลติดต่อ</Label>
            <Input
              id="contact"
              value={formData.contactInfo}
              onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
              placeholder="เช่น เบอร์โทร, LINE ID, Facebook"
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มของแจก
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ItemForm;
