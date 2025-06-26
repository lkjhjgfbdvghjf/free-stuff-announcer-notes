import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Settings, Sun, Moon, Menu, User, Home, Link as LinkIcon, Star, Book, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ICONS = [
  { name: 'Gift', icon: <Gift className="w-4 h-4 mr-1" /> },
  { name: 'Settings', icon: <Settings className="w-4 h-4 mr-1" /> },
  { name: 'Sun', icon: <Sun className="w-4 h-4 mr-1" /> },
  { name: 'Moon', icon: <Moon className="w-4 h-4 mr-1" /> },
  { name: 'Menu', icon: <Menu className="w-4 h-4 mr-1" /> },
  { name: 'User', icon: <User className="w-4 h-4 mr-1" /> },
  { name: 'Home', icon: <Home className="w-4 h-4 mr-1" /> },
  { name: 'Link', icon: <LinkIcon className="w-4 h-4 mr-1" /> },
  { name: 'Star', icon: <Star className="w-4 h-4 mr-1" /> },
  { name: 'Book', icon: <Book className="w-4 h-4 mr-1" /> },
  { name: 'Info', icon: <Info className="w-4 h-4 mr-1" /> },
];

interface AdminButton {
  id: string;
  label: string;
  url: string;
  icon: string;
}

interface AdminSettingsTabProps {
  buttons: AdminButton[];
  onAddButton: (button: AdminButton) => void;
  onRemoveButton: (id: string) => void;
  onUpdateAllButtons?: (buttons: AdminButton[]) => void;
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ buttons, onAddButton, onRemoveButton, onUpdateAllButtons }) => {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Gift');

  const handleAdd = () => {
    if (!label.trim() || !url.trim() || !icon) return;
    const newBtn = { id: Date.now().toString(), label, url, icon };
    onAddButton(newBtn);
    if (onUpdateAllButtons) onUpdateAllButtons([...buttons, newBtn]);
    setLabel('');
    setUrl('');
    setIcon('Gift');
  };

  const handleRemove = (id: string) => {
    onRemoveButton(id);
    if (onUpdateAllButtons) onUpdateAllButtons(buttons.filter(b => b.id !== id));
  };

  return (
    <Card className="shadow-lg border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">ตั้งค่าปุ่มลัดแอดมิน</CardTitle>
        <p className="text-gray-500 dark:text-gray-400 text-sm">เพิ่ม/ลบปุ่มลัดสำหรับเมนูแอดมินที่แสดงในหน้าแรก</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 items-center mb-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              {ICONS.find(ic => ic.name === icon)?.icon}
            </span>
            <select
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              value={icon}
              onChange={e => setIcon(e.target.value)}
            >
              {ICONS.map(ic => (
                <option key={ic.name} value={ic.name}>{ic.name}</option>
              ))}
            </select>
          </div>
          <input
            className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            placeholder="ชื่อปุ่ม (เช่น จัดการผู้ใช้)"
            value={label}
            onChange={e => setLabel(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 flex-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
            placeholder="ลิงก์หรือเส้นทาง (เช่น /admin/users)"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <Button onClick={handleAdd} variant="default" className="h-10 px-6 font-semibold">เพิ่ม</Button>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {buttons.length === 0 && (
            <div className="text-center text-gray-400 py-6">ยังไม่มีปุ่มลัด</div>
          )}
          {buttons.map(btn => {
            const IconComp = ICONS.find(ic => ic.name === btn.icon)?.icon || null;
            return (
              <div key={btn.id} className="flex items-center gap-3 py-3 group hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  {IconComp}
                </span>
                <div className="flex-1 min-w-0">
                  <a href={btn.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 truncate hover:underline">{btn.label}</a>
                  <div className="text-xs text-gray-400 truncate">{btn.url}</div>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleRemove(btn.id)} className="opacity-80 group-hover:opacity-100">ลบ</Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettingsTab;
