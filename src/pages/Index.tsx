
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Search, Settings, Heart } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { FreeItem, Announcement } from '@/types';

const Index = () => {
  const [items, setItems] = useState<FreeItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'เสื้อผ้า',
    'อิเล็กทรอนิกส์',
    'หนังสือ',
    'ของใช้ในบ้าน',
    'ของเล่น',
    'อาหาร',
    'อื่นๆ'
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('freeItems');
    const savedAnnouncements = localStorage.getItem('announcements');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Sample data
      const sampleItems: FreeItem[] = [
        {
          id: '1',
          title: 'เสื้อเชิ้ตสีขาว ไซส์ M',
          description: 'เสื้อเชิ้ตสีขาวแบรนด์ดัง สภาพดีมาก ใส่แค่ 2-3 ครั้ง เหมาะสำหรับไปทำงาน',
          category: 'เสื้อผ้า',
          quantity: 1,
          contactInfo: 'LINE: @freeshirt',
          location: 'กรุงเทพมหานคร',
          dateAdded: new Date().toISOString(),
          isActive: true
        },
        {
          id: '2',
          title: 'หนังสือเรียนคณิตศาสตร์ ม.3',
          description: 'หนังสือเรียนคณิตศาสตร์ระดับมัธยมศึกษาปีที่ 3 สภาพดี มีเขียนบางหน้า',
          category: 'หนังสือ',
          quantity: 3,
          contactInfo: 'Tel: 098-xxx-xxxx',
          location: 'นนทบุรี',
          dateAdded: new Date(Date.now() - 86400000).toISOString(),
          isActive: true
        }
      ];
      setItems(sampleItems);
      localStorage.setItem('freeItems', JSON.stringify(sampleItems));
    }

    if (savedAnnouncements) {
      setAnnouncements(JSON.parse(savedAnnouncements));
    } else {
      // Sample announcement
      const sampleAnnouncements: Announcement[] = [
        {
          id: '1',
          title: 'ยินดีต้อนรับสู่ระบบแจกของฟรี!',
          content: 'ที่นี่คุณสามารถหาของใช้ฟรีได้ทุกวัน อย่าลืมติดต่อเจ้าของก่อนไปรับของนะครับ',
          isActive: true,
          dateCreated: new Date().toISOString()
        }
      ];
      setAnnouncements(sampleAnnouncements);
      localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
    }
  }, []);

  const filteredItems = items.filter(item => {
    if (!item.isActive) return false;
    
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-green-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ระบบแจกของฟรี</h1>
                <p className="text-sm text-gray-600">แบ่งปันสิ่งดีๆ ให้กับทุกคน</p>
              </div>
            </div>
            <Link to="/admin">
              <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                <Settings className="w-4 h-4 mr-2" />
                แอดมิน
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Announcements */}
        <AnnouncementBanner announcements={announcements} />

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาสิ่งของที่ต้องการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="เลือกหมวดหมู่" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                ไม่พบสิ่งของที่ค้นหา
              </h3>
              <p className="text-gray-500">
                ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูนะครับ
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-3">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600">{items.filter(i => i.isActive).length}</h3>
              <p className="text-gray-600">ของที่มีให้แจก</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600">
                {items.reduce((sum, item) => sum + (item.isActive ? item.quantity : 0), 0)}
              </h3>
              <p className="text-gray-600">จำนวนชิ้นทั้งหมด</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-3">
                <Settings className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600">
                {new Set(items.filter(i => i.isActive).map(i => i.category)).size}
              </h3>
              <p className="text-gray-600">หมวดหมู่</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gift className="w-6 h-6" />
            <span className="font-semibold">ระบบแจกของฟรี</span>
          </div>
          <p className="text-gray-300">
            แบ่งปันความดี สร้างสังคมที่ยั่งยืน
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
