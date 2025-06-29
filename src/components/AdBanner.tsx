import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';

interface AdBannerData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  dateCreated: string;
}

interface AdBannerProps {
  adData?: AdBannerData | null;
}

const AdBanner = ({ adData }: AdBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedUntil, setDismissedUntil] = useState<number | null>(null);

  useEffect(() => {
    // ตรวจสอบว่าถูกซ่อนไว้หรือไม่
    const dismissedTimestamp = localStorage.getItem('adBannerDismissedUntil');
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp);
      if (Date.now() < dismissedTime) {
        setDismissedUntil(dismissedTime);
        setIsVisible(false);
        return;
      } else {
        // หมดเวลาแล้ว ลบออกจาก localStorage
        localStorage.removeItem('adBannerDismissedUntil');
      }
    }

    // แสดงโฆษณาถ้ามีข้อมูลและเปิดใช้งาน
    if (adData && adData.isActive) {
      setIsVisible(true);
    }
  }, [adData]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDismissFor5Minutes = () => {
    const dismissUntil = Date.now() + (5 * 60 * 1000); // 5 นาที
    localStorage.setItem('adBannerDismissedUntil', dismissUntil.toString());
    setDismissedUntil(dismissUntil);
    setIsVisible(false);
  };

  if (!isVisible || !adData || !adData.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full mx-auto shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 dark:border-blue-600">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
              {adData.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
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
            <Button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              ปิด
            </Button>
            <Button
              variant="outline"
              onClick={handleDismissFor5Minutes}
              className="w-full text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Clock className="h-4 w-4 mr-2" />
              ไม่แสดงเป็นเวลา 5 นาที
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdBanner;
