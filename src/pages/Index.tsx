import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Settings, Sun, Moon, Menu, User, Home, Link as LinkIcon, Star, Book, Info, Users } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { FreeItem, Announcement, AdBannerData } from '@/types';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import AdBanner from '@/components/AdBanner';
import HamburgerMenu from '@/components/HamburgerMenu';
import { fetchBorderColorFromFirebase } from '@/lib/borderColor';
import { fetchHeaderBorderColorFromFirebase } from '@/lib/headerBorderColor';
import { saveTitleColorToFirebase, fetchTitleColorFromFirebase } from '@/lib/titleColor';

const Index = () => {
  const [items, setItems] = useState<FreeItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [adData, setAdData] = useState<AdBannerData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [adminButtons, setAdminButtons] = useState<{ id: string; label: string; url: string; icon: string }[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [borderColor, setBorderColor] = useState('border-l-green-500 dark:border-l-green-400');
  const [headerBorderColor, setHeaderBorderColor] = useState('border-green-500 dark:border-green-400');
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [titleColor, setTitleColor] = useState('from-green-400 via-blue-500 to-purple-500');
  const [siteTitle, setSiteTitle] = useState('');
  const [siteSubtitle, setSiteSubtitle] = useState('แจกของฟรี ทุกวัน ไม่มีค่าใช้จ่าย');
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'PANEL FREE',
    siteSubtitle: 'แจกของฟรี ทุกวัน ไม่มีค่าใช้จ่าย',
    siteLogo: '',
    siteLogoType: 'icon' as 'icon' | 'image'
  });
  const [viewCount, setViewCount] = useState(0);

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

        // โหลดข้อมูลโฆษณาจาก localStorage
        const savedAdData = localStorage.getItem('adBannerData');
        if (savedAdData) {
          try {
            const parsedAdData = JSON.parse(savedAdData);
            setAdData(parsedAdData);
          } catch (error) {
            console.error('Error parsing ad data:', error);
          }
        }

        // Fetch view count
        const viewCountResponse = await fetch(`${FIREBASE_URL}/viewCount.json`);
        const viewCountData = await viewCountResponse.json();
        const currentViewCount = viewCountData || 0;
        
        // Increment view count
        const newViewCount = currentViewCount + 1;
        await fetch(`${FIREBASE_URL}/viewCount.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newViewCount),
        });
        
        setViewCount(newViewCount);

        // Fetch site settings
        const settingsRes = await fetch(`${FIREBASE_URL}/siteSettings.json`);
        const settingsData = await settingsRes.json();
        if (settingsData) {
          setSiteSettings({
            siteTitle: settingsData.siteTitle || 'PANEL FREE',
            siteSubtitle: settingsData.siteSubtitle || 'แจกของฟรี ทุกวัน ไม่มีค่าใช้จ่าย',
            siteLogo: settingsData.siteLogo || '',
            siteLogoType: settingsData.siteLogoType || 'icon'
          });
        }
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

  // โหลด siteTitle จาก Firebase
  useEffect(() => {
    const fetchSiteTitle = async () => {
      try {
        const res = await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/siteTitle.json');
        const data = await res.json();
        if (typeof data === 'string') setSiteTitle(data);
      } catch {}
    };
    fetchSiteTitle();
  }, []);

  // โหลด siteSubtitle จาก Firebase
  useEffect(() => {
    const fetchSiteSubtitle = async () => {
      try {
        const res = await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/siteSubtitle.json');
        const data = await res.json();
        if (typeof data === 'string') setSiteSubtitle(data);
      } catch {}
    };
    fetchSiteSubtitle();
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

  // Update document title with view count
  useEffect(() => {
    if (viewCount > 0) {
      const formatViewCount = (count: number) => {
        if (count >= 1000000) {
          return Math.floor(count / 1000000) + 'M';
        } else if (count >= 1000) {
          return Math.floor(count / 1000) + 'K';
        }
        return count.toString();
      };
      
      document.title = `(${formatViewCount(viewCount)}) ${siteSettings.siteTitle}`;
    } else {
      document.title = siteSettings.siteTitle;
    }
    
    return () => {
      document.title = siteSettings.siteTitle;
    };
  }, [viewCount, siteSettings.siteTitle]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        {/* Ad Banner */}
        <AdBanner adData={adData} />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Announcements */}
          <AnnouncementBanner announcements={announcements} />

          {/* Header (แทปสีขาวด้านบน) */}
          <header className="bg-white dark:bg-gray-800 shadow-xl border-0 rounded-2xl mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl">
                <div className="container mx-auto px-4 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        {siteSettings.siteLogoType === 'image' && siteSettings.siteLogo ? (
                          <img 
                            src={siteSettings.siteLogo} 
                            alt="Site Logo" 
                            className="w-full h-full object-cover rounded-xl"
                            onError={(e) => {
                              // Fallback to Gift icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                parent.innerHTML = '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H13.5L19 8.5V9H21ZM12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5 10.5 9.8 10.5 9 11.2 7.5 12 7.5ZM6 12H18V14H6V12ZM6 16H18V18H6V16ZM6 20H18V22H6V20Z"/></svg>';
                              }
                            }}
                          />
                        ) : (
                          <Gift className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <span
                          className={`text-2xl font-black bg-gradient-to-r ${titleColor} bg-clip-text text-transparent drop-shadow-lg tracking-wide`}
                          style={{
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block',
                          }}
                        >
                          {siteSettings.siteTitle}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {siteSettings.siteSubtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* View Counter */}
                      {viewCount > 0 && (
                        <div className="flex items-center gap-0.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-1 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                          <Users className="w-2 h-2 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-light text-blue-700 dark:text-blue-300 leading-none">
                            <span className="hidden sm:inline">เข้าชม </span>
                            {viewCount >= 1000000 ? 
                              `${Math.floor(viewCount / 1000000)}M` : 
                              viewCount >= 1000 ? 
                              `${Math.floor(viewCount / 1000)}K` : 
                              viewCount.toLocaleString()
                            }
                            <span className="hidden sm:inline"> ครั้ง</span>
                          </span>
                        </div>
                      )}
                      
                      {/* Hamburger menu button */}
                      <button 
                        type="button" 
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg" 
                        onClick={() => setShowAdminMenu(true)}
                      >
                        <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleDarkMode}
                        className="w-12 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg p-0"
                      >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
              เลือกหมวดหมู่ที่สนใจ
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === 'all' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                ทั้งหมด
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} borderColor={borderColor} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                  <Gift className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                  ไม่พบสิ่งของในหมวดหมู่นี้
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  ลองเลือกหมวดหมู่อื่น หรือกลับมาดูใหม่ในภายหลัง
                  <br />
                  เรามีของใหม่มาแจกทุกวัน!
                </p>
                <Button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ดูสิ่งของทั้งหมด
                </Button>
              </div>
            </div>
          )}
        </main>
        
        {/* Hamburger Menu */}
        <HamburgerMenu
          isOpen={showAdminMenu}
          onClose={() => setShowAdminMenu(false)}
          onAdminClick={() => window.location.href = '/admin'}
          adminButtons={adminButtons}
          isAdmin={isAdmin}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </div>
    </div>
  );
};

export default Index;
