import React from 'react';
import { X, User, Settings, Gift, Sun, Moon, Home, Link as LinkIcon, Star, Book, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminClick: () => void;
  adminButtons: Array<{
    id: string;
    label: string;
    url: string;
    icon: string;
  }>;
  isAdmin: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const HamburgerMenu = ({ 
  isOpen, 
  onClose, 
  onAdminClick, 
  adminButtons, 
  isAdmin,
  isDarkMode,
  onToggleDarkMode 
}: HamburgerMenuProps) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gift': return <Gift className="w-5 h-5" />;
      case 'Settings': return <Settings className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Menu': return <Menu className="w-5 h-5" />;
      case 'User': return <User className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Link': return <LinkIcon className="w-5 h-5" />;
      case 'Star': return <Star className="w-5 h-5" />;
      case 'Book': return <Book className="w-5 h-5" />;
      case 'Info': return <Info className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sliding Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
          <h2 className="text-xl font-bold text-white">เมนู</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1 p-4 space-y-2">
            
            {/* Admin Login/Panel */}
            <button
              onClick={() => {
                onAdminClick();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 transition-all duration-200 border border-blue-200 dark:border-blue-700"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800 dark:text-gray-200">
                  {isAdmin ? 'แพนเนลแอดมิน' : 'เข้าสู่ระบบ Admin'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {isAdmin ? 'จัดการระบบ' : 'สำหรับผู้ดูแลระบบ'}
                </div>
              </div>
            </button>

            {/* Admin Buttons (only show when logged in) */}
            {isAdmin && adminButtons.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-2">
                  เครื่องมือแอดมิน
                </h3>
                {adminButtons.map(btn => (
                  <a
                    key={btn.id}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      {getIcon(btn.icon)}
                    </div>
                    <span className="font-medium">{btn.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Dark Mode Toggle */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-2 mb-2">
                การตั้งค่า
              </h3>
              <button
                onClick={() => {
                  onToggleDarkMode();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-700 dark:text-gray-300"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <span className="font-medium">
                  {isDarkMode ? 'โหมดกลางวัน' : 'โหมดกลางคืน'}
                </span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              © 2024 Panel Free
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
