import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemCardProps {
  item: FreeItem;
  borderColor?: string; // tailwind class เช่น 'border-l-green-500'
}

const ItemCard = ({ item, borderColor = 'border-l-green-500 dark:border-l-green-400' }: ItemCardProps) => {
  // Function to detect URLs in text
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <div key={index} className="inline-block align-middle">
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 text-xs font-semibold border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-md shadow-sm"
              onClick={() => window.open(part, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1 inline-block align-middle" />
              open
            </Button>
          </div>
        );
      }
      return part;
    });
  };

  return (
    <Card className={`h-full hover:shadow-lg transition-shadow duration-300 border-l-4 ${borderColor} dark:bg-gray-800`}>
      {/* Image Section */}
      {item.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs">
            {item.category}
          </Badge>
          {/* ลบ badge แสดงจำนวนสินค้าออก */}
        </div>
        <CardTitle className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-2">
          {item.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {renderTextWithLinks(item.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {/* <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>{new Date(item.dateAdded).toLocaleDateString('th-TH')}</span> */}
          <span className="italic text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {item.subDescription ? item.subDescription : '—'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
