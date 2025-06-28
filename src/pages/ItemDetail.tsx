import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Star, Building2, Calendar, HardDrive, Hash, Smartphone, ExternalLink, Sun, Moon, Gift } from 'lucide-react';
import { FreeItem } from '@/types';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<FreeItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [siteSettings, setSiteSettings] = useState({
    siteTitle: 'แจกของฟรี ทุกวัน',
    siteSubtitle: 'ไม่มีค่าใช้จ่าย',
    siteLogo: '',
    siteLogoType: 'icon' as 'icon' | 'image'
  });
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  // Dark mode setup
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

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const FIREBASE_URL = 'https://kovfs-a8152-default-rtdb.firebaseio.com';
        const response = await fetch(`${FIREBASE_URL}/items.json`);
        const data = await response.json();
        
        // Fetch site settings
        const settingsResponse = await fetch(`${FIREBASE_URL}/siteSettings.json`);
        const settingsData = await settingsResponse.json();
        
        if (settingsData) {
          setSiteSettings({
            siteTitle: settingsData.siteTitle || 'แจกของฟรี ทุกวัน',
            siteSubtitle: settingsData.siteSubtitle || 'ไม่มีค่าใช้จ่าย',
            siteLogo: settingsData.siteLogo || '',
            siteLogoType: settingsData.siteLogoType || 'icon'
          });
        }
        
        if (data) {
          const itemsArray: FreeItem[] = Object.values(data);
          const foundItem = itemsArray.find(item => item.id === id);
          setItem(foundItem || null);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  // Load user's previous rating from localStorage
  useEffect(() => {
    if (id) {
      const savedRating = localStorage.getItem(`user_rating_${id}`);
      if (savedRating) {
        setUserRating(parseInt(savedRating));
      }
    }
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">ไม่พบรายการนี้</h1>
          <Button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    );
  }

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

  const handleDownload = async () => {
    if (!item.description) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setDownloading(false);
          // Update download count in Firebase
          updateDownloadCount();
          // Open the download link
          window.open(item.description, '_blank');
          return 100;
        }
        // Random progress increment between 5-15%
        const increment = Math.random() * 10 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150); // Update every 150ms
  };

  // Function to update download count
  const updateDownloadCount = async () => {
    if (!item || !id) return;
    
    try {
      const FIREBASE_URL = 'https://kovfs-a8152-default-rtdb.firebaseio.com';
      
      // Get current item data
      const response = await fetch(`${FIREBASE_URL}/items.json`);
      const data = await response.json();
      
      if (data) {
        const itemsArray: FreeItem[] = Object.values(data);
        const currentItem = itemsArray.find(item => item.id === id);
        
        if (currentItem) {
          // Extract current count and increment
          let currentCount = 0;
          if (currentItem.downloadCount) {
            // Parse current count (e.g., "1K+", "500+", "1M+")
            const countStr = currentItem.downloadCount.replace(/[^\d]/g, '');
            const multiplier = currentItem.downloadCount.includes('K') ? 1000 : 
                             currentItem.downloadCount.includes('M') ? 1000000 : 1;
            currentCount = parseInt(countStr) * multiplier;
          }
          
          // Increment by 1
          currentCount += 1;
          
          // Format new count
          let newCountStr = '';
          if (currentCount >= 1000000) {
            newCountStr = Math.floor(currentCount / 1000000) + 'M+';
          } else if (currentCount >= 1000) {
            newCountStr = Math.floor(currentCount / 1000) + 'K+';
          } else {
            newCountStr = currentCount.toString();
          }
          
          // Update the item in Firebase
          const updatedItem = { ...currentItem, downloadCount: newCountStr };
          
          // Find the Firebase key for this item
          const firebaseKey = Object.keys(data).find(key => data[key].id === id);
          
          if (firebaseKey) {
            await fetch(`${FIREBASE_URL}/items/${firebaseKey}.json`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedItem),
            });
            
            // Update local state
            setItem(updatedItem);
          }
        }
      }
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  // Function to handle star rating
  const handleStarRating = async (rating: number) => {
    if (!item || !id) return;
    
    setIsRating(true);
    
    try {
      const FIREBASE_URL = 'https://kovfs-a8152-default-rtdb.firebaseio.com';
      
      // Check if user has already rated this item
      const previousRating = localStorage.getItem(`user_rating_${id}`);
      const hasRatedBefore = previousRating !== null;
      
      // Get current item data
      const response = await fetch(`${FIREBASE_URL}/items.json`);
      const data = await response.json();
      
      if (data) {
        const itemsArray: FreeItem[] = Object.values(data);
        const currentItem = itemsArray.find(item => item.id === id);
        
        if (currentItem) {
          // Calculate new rating
          const currentRating = currentItem.rating || 4.5;
          let currentRatingCount = currentItem.ratingCount || 100;
          let totalRating = currentRating * currentRatingCount;
          
          if (hasRatedBefore) {
            // Remove previous rating and add new one
            const oldRating = parseInt(previousRating);
            totalRating = totalRating - oldRating + rating;
          } else {
            // Add new rating
            totalRating = totalRating + rating;
            currentRatingCount = currentRatingCount + 1;
          }
          
          const newAverageRating = Math.round((totalRating / currentRatingCount) * 10) / 10;
          
          // Update the item in Firebase
          const updatedItem = { 
            ...currentItem, 
            rating: newAverageRating,
            ratingCount: currentRatingCount
          };
          
          // Find the Firebase key for this item
          const firebaseKey = Object.keys(data).find(key => data[key].id === id);
          
          if (firebaseKey) {
            await fetch(`${FIREBASE_URL}/items/${firebaseKey}.json`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedItem),
            });
            
            // Update local state
            setItem(updatedItem);
            setUserRating(rating);
            
            // Save user's rating to localStorage
            localStorage.setItem(`user_rating_${id}`, rating.toString());
          }
        }
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg border-0">
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  กลับหน้าแรก
                </Button>
                
                {/* Site Logo and Name */}
                <div className="flex items-center gap-3 ml-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
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
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-tight">
                      {siteSettings.siteTitle}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                      {siteSettings.siteSubtitle}
                    </p>
                  </div>
                </div>
              </div>
                
              {/* Dark Mode Toggle */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleDarkMode}
                  className="w-10 h-10 rounded-xl p-0"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header Section */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* App Icon */}
                  {item.appIcon && (
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 shadow-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden flex-shrink-0">
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
                                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                </svg>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                      {item.title}
                    </h1>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 font-semibold px-4 py-2 rounded-full text-sm">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-black/10 dark:bg-white/10 px-3 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {item.rating ? item.rating.toFixed(1) : '4.5'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({item.ratingCount || 100})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              
              {/* Image Gallery */}
              <div className="space-y-4">
                {allImages.length > 0 ? (
                  <>
                    <div className="relative h-96 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
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
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-2 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {allImages.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {allImages.length > 1 && (
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {allImages.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-3 transition-all duration-200 ${
                              index === currentImageIndex
                                ? 'border-blue-500 ring-3 ring-blue-200 dark:ring-blue-800'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
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
                  </>
                ) : (
                  <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <Star className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">ไม่มีรูปภาพ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                
                {/* Description */}
                {item.subDescription && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      รายละเอียด
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                      {item.subDescription}
                    </p>
                  </div>
                )}

                {/* App Details */}
                {(item.downloadCount || item.publisher || item.updatedDate || item.size || item.version || item.requirements) && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-blue-500" />
                      ข้อมูลแอปพลิเคชัน
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {item.publisher && (
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ผู้พัฒนา</p>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{item.publisher}</p>
                          </div>
                        </div>
                      )}

                      {item.updatedDate && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">อัปเดตล่าสุด</p>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{item.updatedDate}</p>
                          </div>
                        </div>
                      )}

                      {item.size && (
                        <div className="flex items-start gap-3">
                          <HardDrive className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ขนาดไฟล์</p>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{item.size}</p>
                          </div>
                        </div>
                      )}

                      {item.version && (
                        <div className="flex items-start gap-3">
                          <Hash className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">เวอร์ชัน</p>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{item.version}</p>
                          </div>
                        </div>
                      )}

                      {item.requirements && (
                        <div className="flex items-start gap-3">
                          <Smartphone className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ความต้องการระบบ</p>
                            <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">{item.requirements}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Download Section */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <h2 className="text-xl font-semibold mb-4">ดาวน์โหลดแอป</h2>
                  
                  {item.description ? (
                    <>
                      <Button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] mb-4 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {downloading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                            กำลังเตรียมไฟล์... {Math.round(downloadProgress)}%
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            ดาวน์โหลดฟรี
                          </>
                        )}
                      </Button>
                      
                      {/* Progress Bar */}
                      {downloading && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-blue-100 mb-2">
                            <span>กำลังดาวน์โหลด...</span>
                            <span>{Math.round(downloadProgress)}%</span>
                          </div>
                          <div className="w-full bg-blue-200/30 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-emerald-400 to-green-400 h-full rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${downloadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
                        <span className="flex items-center gap-2 text-emerald-300 font-semibold">
                          <Download className="w-4 h-4" />
                          {item.downloadCount || '0'} ดาวน์โหลดแล้ว
                        </span>
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          ฟรี 100%
                        </span>
                        <span className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          ปลอดภัย
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-blue-100">ไม่มีลิงก์ดาวน์โหลด</p>
                  )}
                </div>

                {/* Rating Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    ให้คะแนนแอปนี้
                  </h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">คะแนนปัจจุบัน:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.rating ? item.rating.toFixed(1) : '4.5'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({item.ratingCount || 100} รีวิว)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ให้คะแนน:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarRating(star)}
                        disabled={isRating}
                        className={`transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                          userRating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                        }`}
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            userRating >= star ? 'fill-yellow-400' : 'hover:fill-yellow-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                  
                  {userRating > 0 && !isRating && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✓ ขอบคุณสำหรับการให้คะแนน {userRating} ดาว!
                      {localStorage.getItem(`user_rating_${id}`) && (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                          คุณสามารถเปลี่ยนคะแนนได้ตลอดเวลา
                        </span>
                      )}
                    </div>
                  )}
                  
                  {isRating && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      กำลังบันทึกคะแนน...
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemDetail;
