import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdBannerData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  dateCreated: string;
}

const AdManager = () => {
  const [adData, setAdData] = useState<AdBannerData>({
    id: 'ad-1',
    title: '',
    content: '',
    imageUrl: '',
    isActive: false,
    dateCreated: new Date().toISOString()
  });
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // โหลดข้อมูลโฆษณาจาก localStorage
    const savedAdData = localStorage.getItem('adBannerData');
    if (savedAdData) {
      try {
        const parsedData = JSON.parse(savedAdData);
        setAdData(parsedData);
      } catch (error) {
        console.error('Error parsing ad data:', error);
      }
    }
  }, []);

  const handleSave = () => {
    try {
      const updatedAdData = {
        ...adData,
        id: adData.id || 'ad-1',
        dateCreated: adData.dateCreated || new Date().toISOString()
      };
      
      localStorage.setItem('adBannerData', JSON.stringify(updatedAdData));
      setAdData(updatedAdData);
      
      toast({
        title: "บันทึกสำเร็จ",
        description: "ข้อมูลโฆษณาได้ถูกบันทึกแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAdData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setAdData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleClearAll = () => {
    setAdData({
      id: 'ad-1',
      title: '',
      content: '',
      imageUrl: '',
      isActive: false,
      dateCreated: new Date().toISOString()
    });
    localStorage.removeItem('adBannerData');
    toast({
      title: "ล้างข้อมูลสำเร็จ",
      description: "ข้อมูลโฆษณาถูกล้างแล้ว",
    });
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                จัดการโฆษณาแบนเนอร์
              </CardTitle>
              <CardDescription>
                สร้างและจัดการโฆษณาที่จะแสดงเมื่อผู้ใช้เข้าเว็บไซต์
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={togglePreview}
              className="flex items-center gap-2"
            >
              {previewMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  ซ่อนตัวอย่าง
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  ดูตัวอย่าง
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adTitle">หัวข้อโฆษณา</Label>
            <Input
              id="adTitle"
              value={adData.title}
              onChange={(e) => setAdData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="ใส่หัวข้อโฆษณา..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adContent">เนื้อหาโฆษณา</Label>
            <Textarea
              id="adContent"
              value={adData.content}
              onChange={(e) => setAdData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="ใส่เนื้อหาโฆษณา..."
              className="w-full min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adImage">รูปภาพโฆษณา (ไม่บังคับ)</Label>
            <div className="flex gap-2">
              <Input
                id="adImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              {adData.imageUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearImage}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {adData.imageUrl && (
              <div className="mt-2">
                <img
                  src={adData.imageUrl}
                  alt="ตัวอย่างรูปภาพ"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="adActive"
              checked={adData.isActive}
              onCheckedChange={(checked) => setAdData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="adActive" className="text-sm font-medium">
              เปิดใช้งานโฆษณา
            </Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
              บันทึก
            </Button>
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ล้างทั้งหมด
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ตัวอย่างโฆษณา */}
      {previewMode && adData.title && adData.content && (
        <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 dark:border-blue-600">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
              ตัวอย่างโฆษณา
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    {adData.title}
                  </h3>
                  <div className="w-6 h-6 border-2 border-gray-300 rounded flex items-center justify-center text-xs">
                    ✕
                  </div>
                </div>

                {adData.imageUrl && (
                  <div className="mb-4">
                    <img
                      src={adData.imageUrl}
                      alt={adData.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {adData.content}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="w-full h-10 bg-blue-600 rounded flex items-center justify-center text-white font-medium">
                    ปิด
                  </div>
                  <div className="w-full h-10 border border-gray-300 rounded flex items-center justify-center text-gray-600 font-medium">
                    ⏰ ไม่แสดงเป็นเวลา 5 นาที
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdManager;
