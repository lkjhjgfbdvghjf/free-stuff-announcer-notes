import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Settings, Sun, Moon, Menu, User, Home, Link as LinkIcon, Star, Book, Info } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { FreeItem, Announcement } from '@/types';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { fetchBorderColorFromFirebase } from '@/lib/borderColor';
import { fetchHeaderBorderColorFromFirebase } from '@/lib/headerBorderColor';
import { saveTitleColorToFirebase, fetchTitleColorFromFirebase } from '@/lib/titleColor';

const Index = () => {
  const [items, setItems] = useState<FreeItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [adminButtons, setAdminButtons] = useState<{ id: string; label: string; url: string; icon: string }[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [borderColor, setBorderColor] = useState('border-l-green-500 dark:border-l-green-400');
  const [headerBorderColor, setHeaderBorderColor] = useState('border-green-500 dark:border-green-400');
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [titleColor, setTitleColor] = useState('from-green-400 via-blue-500 to-purple-500');

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

  // Firebase base URL
  const FIREBASE_URL = 'https://kovfs-a8152-default-rtdb.firebaseio.com';

  // ดึงข้อมูลจาก Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch(`${FIREBASE_URL}/items.json`);
        const itemsData = await itemsRes.json();
        const itemsArray: FreeItem[] = itemsData ? Object.values(itemsData) : [];
        setItems(itemsArray);

        const annRes = await fetch(`${FIREBASE_URL}/announcements.json`);
        const annData = await annRes.json();
        const annArray: Announcement[] = annData ? Object.values(annData) : [];
        setAnnouncements(annArray);
      } catch (err) {
        // fallback: ไม่พบข้อมูลหรือ error
        setItems([]);
        setAnnouncements([]);
      }
    };
    fetchData();
  }, []);

  // ดึงหมวดหมู่จาก Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(`${FIREBASE_URL}/categories.json`);
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData);
        } else {
          setCategories([
            'เสื้อผ้า',
            'อิเล็กทรอนิกส์',
            'หนังสือ',
            'ของใช้ในบ้าน',
            'ของเล่น',
            'อาหาร',
            'อื่นๆ'
          ]);
        }
      } catch {
        setCategories([
          'เสื้อผ้า',
          'อิเล็กทรอนิกส์',
          'หนังสือ',
          'ของใช้ในบ้าน',
          'ของเล่น',
          'อาหาร',
          'อื่นๆ'
        ]);
      }
    };
    fetchCategories();
  }, []);

  // โหลดปุ่ม admin จาก Firebase
  useEffect(() => {
    const fetchAdminButtons = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}/adminButtons.json`);
        const data = await res.json();
        if (data) {
          // รองรับทั้ง object (id เป็น key) และ array
          const arr = Array.isArray(data) ? data : Object.values(data);
          setAdminButtons(arr);
        } else {
          setAdminButtons([]);
        }
      } catch {
        setAdminButtons([]);
      }
    };
    fetchAdminButtons();
    // ตรวจสอบสถานะ admin (เช่น localStorage หรือ cookie)
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
  }, []);

  // โหลดสีเส้นข้างจาก Firebase ตอน mount
  useEffect(() => {
    fetchBorderColorFromFirebase().then(setBorderColor);
    fetchHeaderBorderColorFromFirebase().then(setHeaderBorderColor);
  }, []);

  // โหลดสี titleColor จาก Firebase มาใช้กับ PANEL FREE ทุกคนเห็นเหมือนกัน
  useEffect(() => {
    fetchTitleColorFromFirebase().then(setTitleColor);
  }, []);

  // ฟังก์ชันบันทึกข้อมูลไป Firebase (ถ้าต้องการใช้งานในอนาคต)
  const saveItemsToFirebase = async (newItems: FreeItem[]) => {
    await fetch(`${FIREBASE_URL}/items.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItems.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})),
    });
  };
  const saveAnnouncementsToFirebase = async (newAnnouncements: Announcement[]) => {
    await fetch(`${FIREBASE_URL}/announcements.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnnouncements.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})),
    });
  };

  const filteredItems = items.filter(item => {
    if (!item.isActive) return false;
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesCategory;
  });

  // ฟังก์ชันสำหรับแสดงไอคอนตามชื่อ
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'Gift': return <Gift className="w-4 h-4 mr-2" />;
      case 'Settings': return <Settings className="w-4 h-4 mr-2" />;
      case 'Sun': return <Sun className="w-4 h-4 mr-2" />;
      case 'Moon': return <Moon className="w-4 h-4 mr-2" />;
      case 'Menu': return <Menu className="w-4 h-4 mr-2" />;
      case 'User': return <User className="w-4 h-4 mr-2" />;
      case 'Home': return <Home className="w-4 h-4 mr-2" />;
      case 'Link': return <LinkIcon className="w-4 h-4 mr-2" />;
      case 'Star': return <Star className="w-4 h-4 mr-2" />;
      case 'Book': return <Book className="w-4 h-4 mr-2" />;
      case 'Info': return <Info className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <main className="container mx-auto px-3 py-4">
          {/* Announcements */}
          <AnnouncementBanner announcements={announcements} />

          {/* Header (แทปสีขาวด้านบน) */}
          <header className={`bg-white dark:bg-gray-800 shadow-md border-b-4 ${headerBorderColor}`}>
            <div className="container mx-auto px-3 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`text-2xl font-extrabold bg-gradient-to-r ${titleColor} bg-clip-text text-transparent drop-shadow-md tracking-wide animate-gradient-x`}
                    style={{
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                      textShadow: '0 2px 8px rgba(80,80,80,0.10)'
                    }}
                  >
                    PANEL FREE
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Hamburger menu for admin tools */}
                  <div className="relative group">
                    <button type="button" className="flex items-center justify-center w-10 h-10 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setShowAdminMenu(v => !v)}>
                      <Menu className="w-6 h-6" />
                    </button>
                    {showAdminMenu && (
                      <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow min-w-[200px] animate-fade-in">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                          onClick={() => { window.location.href = '/admin'; setShowAdminMenu(false); }}
                        >
                          🛡️ เข้าสู่ระบบแอดมิน
                        </button>
                        {/* แสดงปุ่ม admin อื่นๆ เฉพาะตอนล็อกอินแล้ว */}
                        {isAdmin && adminButtons.map(btn => (
                          <a
                            key={btn.id}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                          >
                            {getIcon(btn.icon)}
                            {btn.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Search and Filter */}
          {/* ลบช่องค้นหา และแสดงหมวดหมู่เป็นบล็อกปุ่ม */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`text-sm ${selectedCategory === category ? 'bg-green-500 text-white' : 'dark:bg-gray-700 dark:text-gray-100'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`text-sm ${selectedCategory === 'all' ? 'bg-green-500 text-white' : 'dark:bg-gray-700 dark:text-gray-100'}`}
                onClick={() => setSelectedCategory('all')}
              >
                ทั้งหมด
              </Button>
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} borderColor={borderColor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 max-w-sm mx-auto">
                {/* ลบไอคอนกล่องของขวัญ */}
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
      </div>
    </div>
  );
};

export default Index;
