
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';
import { FreeItem } from '@/types';

interface ItemCardProps {
  item: FreeItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  // Function to detect URLs in text
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Button
            key={index}
            variant="link"
            size="sm"
            className="p-0 h-auto text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs"
            onClick={() => window.open(part, '_blank')}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            ดูลิงก์
          </Button>
        );
      }
      return part;
    });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500 dark:border-l-green-400 dark:bg-gray-800">
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
          <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
            เหลือ {item.quantity} ชิ้น
          </Badge>
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
          <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <span>{new Date(item.dateAdded).toLocaleDateString('th-TH')}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
