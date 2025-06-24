
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, User, Calendar, ExternalLink } from 'lucide-react';
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
            className="p-0 h-auto text-blue-600 hover:text-blue-800"
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
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {item.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            เหลือ {item.quantity} ชิ้น
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
          {item.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {renderTextWithLinks(item.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>{renderTextWithLinks(item.contactInfo)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{new Date(item.dateAdded).toLocaleDateString('th-TH')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
