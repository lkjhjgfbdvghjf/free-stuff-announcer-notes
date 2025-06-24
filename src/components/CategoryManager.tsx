import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CategoryManagerProps {
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

const CategoryManager = ({ categories, onUpdateCategories }: CategoryManagerProps) => {
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory.trim())) {
      toast({
        title: "หมวดหมู่ซ้ำ",
        description: "หมวดหมู่นี้มีอยู่แล้ว",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    onUpdateCategories(updatedCategories);
    setNewCategory('');
    
    toast({
      title: "เพิ่มหมวดหมู่สำเร็จ",
      description: "หมวดหมู่ใหม่ได้ถูกเพิ่มแล้ว",
    });
  };

  const handleEditCategory = (index: number) => {
    setEditingIndex(index);
    setEditValue(categories[index]);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim() || editingIndex === null) return;
    
    if (categories.includes(editValue.trim()) && editValue.trim() !== categories[editingIndex]) {
      toast({
        title: "หมวดหมู่ซ้ำ",
        description: "หมวดหมู่นี้มีอยู่แล้ว",
        variant: "destructive"
      });
      return;
    }

    const updatedCategories = [...categories];
    updatedCategories[editingIndex] = editValue.trim();
    onUpdateCategories(updatedCategories);
    setEditingIndex(null);
    setEditValue('');
    
    toast({
      title: "แก้ไขหมวดหมู่สำเร็จ",
      description: "หมวดหมู่ได้ถูกแก้ไขแล้ว",
    });
  };

  const handleDeleteCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    onUpdateCategories(updatedCategories);
    
    toast({
      title: "ลบหมวดหมู่สำเร็จ",
      description: "หมวดหมู่ได้ถูกลบแล้ว",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">จัดการหมวดหมู่</CardTitle>
        <CardDescription>
          เพิ่ม แก้ไข หรือลบหมวดหมู่สินค้า
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new category */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="new-category">เพิ่มหมวดหมู่ใหม่</Label>
            <Input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="เช่น อุปกรณ์กีฬา"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่ม
            </Button>
          </div>
        </div>

        {/* Existing categories */}
        <div className="space-y-2">
          <Label>หมวดหมู่ที่มีอยู่</Label>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                {editingIndex === index ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge variant="secondary" className="flex-1 justify-start">
                      {category}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(index)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>ยังไม่มีหมวดหมู่</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
