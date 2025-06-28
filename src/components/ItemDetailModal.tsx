import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronLeft, ChevronRight, Download, Star, Building2, Calendar, HardDrive, Hash, Smartphone, ExternalLink, Users } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemDetailModalProps {
  item: FreeItem;
  isOpen: boolean;
  onClose: () => void;
}

const ItemDetailModal = ({ item, isOpen, onClose }: ItemDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // รวมรูปภาพหลักกับภาพประกอบ
  const allImages = [
    ...(item.imageUrl ? [item.imageUrl] : []),
    ...(item.galleryImages || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleDownload = () => {
    if (item.description) {
      window.open(item.description, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-gray-900">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {item.title}
              </DialogTitle>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold px-3 py-1 rounded-full">
                {item.category}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="relative mx-6 mb-6">
            <div className="relative h-80 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={allImages[currentImageIndex]}
                alt={`${item.title} - รูปที่ ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                }}
              />
              
              {/* Navigation Buttons */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">4.5</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`ภาพย่อ ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Description */}
          {item.subDescription && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                รายละเอียด
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.subDescription}
              </p>
            </div>
          )}

          {/* App Details */}
          {(item.publisher || item.updatedDate || item.size || item.version || item.requirements) && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-500" />
                ข้อมูลแอปพลิเคชัน
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.publisher && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ผู้พัฒนา</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{item.publisher}</p>
                    </div>
                  </div>
                )}

                {item.updatedDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">อัปเดตล่าสุด</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{item.updatedDate}</p>
                    </div>
                  </div>
                )}

                {item.size && (
                  <div className="flex items-center gap-3">
                    <HardDrive className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ขนาดไฟล์</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{item.size}</p>
                    </div>
                  </div>
                )}

                {item.version && (
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">เวอร์ชัน</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{item.version}</p>
                    </div>
                  </div>
                )}

                {item.requirements && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Smartphone className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ความต้องการระบบ</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">{item.requirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Download Button */}
          {item.description && (
            <div className="flex flex-col gap-4">
              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <Download className="w-5 h-5 mr-2" />
                ดาวน์โหลดฟรี
              </Button>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                {item.downloadCount ? (
                  <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Users className="w-4 h-4" />
                    {item.downloadCount} ดาวน์โหลดแล้ว
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-green-500" />
                    ยังไม่มีข้อมูลดาวน์โหลด
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                  ปลอดภัย
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailModal;
