import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Settings, Sun, Moon, Menu, User, Home, Link as LinkIcon, Star, Book, Info } from 'lucide-react';

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
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <select
          className="border rounded px-2 py-1"
          value={icon}
          onChange={e => setIcon(e.target.value)}
        >
          {ICONS.map(ic => (
            <option key={ic.name} value={ic.name}>{ic.name}</option>
          ))}
        </select>
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="ชื่อปุ่ม"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="ลิงก์หรือเส้นทาง"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <Button onClick={handleAdd} variant="default">เพิ่ม</Button>
      </div>
      <div className="space-y-2">
        {buttons.map(btn => {
          const IconComp = ICONS.find(ic => ic.name === btn.icon)?.icon || null;
          return (
            <div key={btn.id} className="flex items-center gap-2">
              <span>{IconComp}</span>
              <a href={btn.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{btn.label}</a>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(btn.id)}>ลบ</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSettingsTab;
