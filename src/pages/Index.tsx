import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Search, Settings, Sun, Moon } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { FreeItem, Announcement } from '@/types';

const Index = () => {
  const [items, setItems] = useState<FreeItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = [
    'เสื้อผ้า',
    'อิเล็กทรอนิกส์',
    'หนังสือ',
    'ของใช้ในบ้าน',
    'ของเล่น',
    'อาหาร',
    'อื่นๆ'
  ];

  // Dark mode toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md border-b-4 border-green-500 dark:border-green-400">
          <div className="container mx-auto px-3 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">ระบบแจกของฟรี</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-300">แบ่งปันสิ่งดีๆ ให้กับทุกคน</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="border-gray-300 dark:border-gray-600"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-green-500 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900">
                    <Settings className="w-4 h-4 mr-1" />
                    แอดมิน
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 py-4">
          {/* Announcements */}
          <AnnouncementBanner announcements={announcements} />

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาสิ่งของที่ต้องการ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="text-sm dark:bg-gray-700 dark:text-gray-100">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-sm mx-auto">
                <Gift className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  ไม่พบสิ่งของที่ค้นหา
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูนะครับ
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 dark:bg-gray-900 text-white py-6 mt-12">
          <div className="container mx-auto px-3 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5" />
              <span className="font-semibold text-sm">ระบบแจกของฟรี</span>
            </div>
            <p className="text-xs text-gray-300">
              แบ่งปันความดี สร้างสังคมที่ยั่งยืน
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
