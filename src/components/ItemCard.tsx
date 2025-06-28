import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Download, Star, Building2, Calendar, HardDrive, Hash, Smartphone, Eye, Image } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemCardProps {
  item: FreeItem;
  borderColor?: string;
}

const ItemCard = ({ item, borderColor = 'border-l-green-500 dark:border-l-green-400' }: ItemCardProps) => {
  const navigate = useNavigate();

  // Function to detect URLs in text
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Button
            key={index}
            variant="default"
            size="sm"
            className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => window.open(part, '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            ดาวน์โหลดฟรี
          </Button>
        );
      }
      return part;
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <div class="text-center">
                      <div class="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">${item.title}</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.title}</p>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold px-3 py-1 rounded-full shadow-lg">
          {item.category}
        </Badge>
        
        {/* App Icon */}
        {item.appIcon && (
          <div className="absolute bottom-3 left-3">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-lg border-2 border-white dark:border-gray-700 overflow-hidden">
              <img 
                src={item.appIcon} 
                alt={`${item.title} icon`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">4.5</span>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      
      {/* Content Section */}
      <CardContent className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-2 leading-tight">
          {item.title}
        </h3>
        
        {/* Description */}
        {item.subDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 leading-relaxed">
            {item.subDescription}
          </p>
        )}

        {/* App Details Section */}
        {(item.publisher || item.updatedDate || item.size || item.version || item.requirements) && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-blue-100 dark:border-gray-600">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Star className="w-4 h-4 mr-2 text-blue-500" />
              รายละเอียดแอป
            </h4>
            
            <div className="grid grid-cols-1 gap-2 text-xs">
              {/* Publisher */}
              {item.publisher && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Building2 className="w-3 h-3 mr-2 text-blue-500" />
                    <span className="font-medium">ผู้พัฒนา</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold text-right max-w-[60%] line-clamp-1">
                    {item.publisher}
                  </span>
                </div>
              )}

              {/* Updated */}
              {item.updatedDate && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3 mr-2 text-green-500" />
                    <span className="font-medium">อัปเดต</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    {item.updatedDate}
                  </span>
                </div>
              )}

              {/* Size */}
              {item.size && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <HardDrive className="w-3 h-3 mr-2 text-purple-500" />
                    <span className="font-medium">ขนาด</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    {item.size}
                  </span>
                </div>
              )}

              {/* Version */}
              {item.version && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Hash className="w-3 h-3 mr-2 text-orange-500" />
                    <span className="font-medium">เวอร์ชัน</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    {item.version}
                  </span>
                </div>
              )}

              {/* Requirements */}
              {item.requirements && (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Smartphone className="w-3 h-3 mr-2 text-red-500" />
                    <span className="font-medium">ความต้องการ</span>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-semibold">
                    {item.requirements}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          {renderTextWithLinks(item.description)}
          
          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-300"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            ดูรายละเอียดเพิ่มเติม
          </Button>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              ฟรี 100%
            </span>
            <span className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              ปลอดภัย
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
