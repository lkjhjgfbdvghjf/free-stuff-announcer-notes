import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Megaphone, StickyNote, Trash2, Edit2, Eye, EyeOff, Settings } from 'lucide-react';
import AdminLogin from '@/components/AdminLogin';
import ItemForm from '@/components/ItemForm';
import AdminNotes from '@/components/AdminNotes';
import CategoryManager from '@/components/CategoryManager';
import AdminSettingsTab from '@/components/AdminSettingsTab';
import { FreeItem, AdminNote, Announcement } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ItemCard from '@/components/ItemCard';
import { saveBorderColorToFirebase } from '@/lib/borderColor';
import { saveTitleColorToFirebase } from '@/lib/titleColor';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState<FreeItem[]>([]);
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'เสื้อผ้า',
    'อิเล็กทรอนิกส์',
    'หนังสือ',
    'ของใช้ในบ้าน',
    'ของเล่น',
    'อาหาร',
    'อื่นๆ'
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [adminButtons, setAdminButtons] = useState<{
    id: string;
    label: string;
    url: string;
    icon: string;
  }[]>([]);
  const [borderColor, setBorderColor] = useState('border-l-green-500 dark:border-l-green-400');
  const [headerBorderColor, setHeaderBorderColor] = useState('border-green-500 dark:border-green-400');
  const [titleColor, setTitleColor] = useState('from-green-400 via-blue-500 to-purple-500');
  const [siteTitle, setSiteTitle] = useState('PANEL FREE');
  const [editingItem, setEditingItem] = useState<FreeItem | null>(null);
  const { toast } = useToast();

  // Firebase base URL
  const FIREBASE_URL = 'https://kovfs-a8152-default-rtdb.firebaseio.com';

  // ดึงข้อมูลจาก Firebase แทน localStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsRes = await fetch(`${FIREBASE_URL}/items.json`);
        const itemsData = await itemsRes.json();
        const notesRes = await fetch(`${FIREBASE_URL}/adminNotes.json`);
        const notesData = await notesRes.json();
        const annRes = await fetch(`${FIREBASE_URL}/announcements.json`);
        const annData = await annRes.json();
        const catRes = await fetch(`${FIREBASE_URL}/categories.json`);
        const catData = await catRes.json();

        const itemsArray: FreeItem[] = itemsData ? Object.values(itemsData) : [];
        setItems(itemsArray);

        const notesArray: AdminNote[] = notesData ? Object.values(notesData) : [];
        setNotes(notesArray);

        const annArray: Announcement[] = annData ? Object.values(annData) : [];
        setAnnouncements(annArray);

        setCategories(catData || categories);
      } catch (err) {
        setItems([]);
        setNotes([]);
        setAnnouncements([]);
        setCategories(categories);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // ฟังก์ชันบันทึกข้อมูลไป Firebase
  const saveItemsToFirebase = async (newItems: FreeItem[]) => {
    await fetch(`${FIREBASE_URL}/items.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItems.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})),
    });
  };
  const saveNotesToFirebase = async (newNotes: AdminNote[]) => {
    await fetch(`${FIREBASE_URL}/adminNotes.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotes.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})),
    });
  };
  const saveAnnouncementsToFirebase = async (newAnnouncements: Announcement[]) => {
    await fetch(`${FIREBASE_URL}/announcements.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAnnouncements.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})),
    });
  };
  const saveCategoriesToFirebase = async (newCategories: string[]) => {
    await fetch(`${FIREBASE_URL}/categories.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategories),
    });
  };
  const saveAdminButtonsToFirebase = async (buttons: typeof adminButtons) => {
    await fetch(`${FIREBASE_URL}/adminButtons.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buttons.reduce((acc, b) => ({ ...acc, [b.id]: b }), {})),
    });
  };

  // Load data from localStorage
  useEffect(() => {
    const savedItems = localStorage.getItem('freeItems');
    const savedNotes = localStorage.getItem('adminNotes');
    const savedAnnouncements = localStorage.getItem('announcements');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  // Save data to localStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleUpdateCategories = (newCategories: string[]) => {
    setCategories(newCategories);
    saveCategoriesToFirebase(newCategories);
  };

  const handleAddItem = (itemData: Omit<FreeItem, 'id' | 'dateAdded'>) => {
    const newItem: FreeItem = {
      ...itemData,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveItemsToFirebase(updatedItems);
    toast({
      title: "เพิ่มของแจกสำเร็จ",
      description: "ข้อมูลได้ถูกบันทึกแล้ว",
    });
  };

  const handleToggleItemStatus = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    setItems(updatedItems);
    saveItemsToFirebase(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    saveItemsToFirebase(updatedItems);
    toast({
      title: "ลบข้อมูลสำเร็จ",
      description: "ข้อมูลได้ถูกลบแล้ว",
    });
  };

  const handleAddNote = (content: string) => {
    const newNote: AdminNote = {
      id: Date.now().toString(),
      content,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString()
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotesToFirebase(updatedNotes);
  };

  const handleUpdateNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, content, dateUpdated: new Date().toISOString() } : note
    );
    setNotes(updatedNotes);
    saveNotesToFirebase(updatedNotes);
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotesToFirebase(updatedNotes);
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.content.trim()) {
      return;
    }
    const announcement: Announcement = {
      id: Date.now().toString(),
      title: 'ประกาศ', // ล็อกหัวข้อเป็น 'ประกาศ' เสมอ
      content: newAnnouncement.content.trim(),
      isActive: true,
      dateCreated: new Date().toISOString()
    };
    const updatedAnnouncements = [...announcements, announcement];
    setAnnouncements(updatedAnnouncements);
    saveAnnouncementsToFirebase(updatedAnnouncements);
    setNewAnnouncement({ title: '', content: '' });
    toast({
      title: "เพิ่มประกาศสำเร็จ",
      description: "ประกาศได้ถูกเพิ่มแล้ว",
    });
  };

  const handleToggleAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.map(ann =>
      ann.id === id ? { ...ann, isActive: !ann.isActive } : ann
    );
    setAnnouncements(updatedAnnouncements);
    saveAnnouncementsToFirebase(updatedAnnouncements);
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
    setAnnouncements(updatedAnnouncements);
    saveAnnouncementsToFirebase(updatedAnnouncements);
    toast({
      title: "ลบประกาศสำเร็จ",
      description: "ประกาศได้ถูกลบแล้ว",
    });
  };

  // โหลดปุ่ม adminButtons จาก Firebase
  useEffect(() => {
    const fetchAdminButtons = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}/adminButtons.json`);
        const data = await res.json();
        if (data) setAdminButtons(Object.values(data));
      } catch {}
    };
    fetchAdminButtons();
  }, []);

  const handleAddAdminButton = (btn: { id: string; label: string; url: string; icon: string }) => {
    const updated = [...adminButtons, btn];
    setAdminButtons(updated);
    saveAdminButtonsToFirebase(updated);
  };
  const handleRemoveAdminButton = (id: string) => {
    const updated = adminButtons.filter(b => b.id !== id);
    setAdminButtons(updated);
    saveAdminButtonsToFirebase(updated);
  };
  const handleUpdateAllAdminButtons = (buttons: typeof adminButtons) => {
    setAdminButtons(buttons);
    saveAdminButtonsToFirebase(buttons);
  };

  // ฟังก์ชันบันทึกสี headerBorderColor ไป Firebase
  const saveHeaderBorderColorToFirebase = async (color: string) => {
    await fetch('https://kovfs-a8152-default-rtdb.firebaseio.com/headerBorderColor.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(color),
    });
  };

  // Load siteTitle from Firebase
  useEffect(() => {
    const fetchSiteTitle = async () => {
      try {
        const res = await fetch(`${FIREBASE_URL}/siteTitle.json`);
        const data = await res.json();
        if (data) setSiteTitle(data);
      } catch {}
    };
    fetchSiteTitle();
  }, []);

  // Save siteTitle to Firebase
  const saveSiteTitleToFirebase = async (title: string) => {
    await fetch(`${FIREBASE_URL}/siteTitle.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(title),
    });
  };

  const handleEditItem = (item: FreeItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (updatedItem: FreeItem) => {
    const updatedItems = items.map(item =>
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item
    );
    setItems(updatedItems);
    saveItemsToFirebase(updatedItems);
    setEditingItem(null);
    toast({
      title: "แก้ไขของแจกสำเร็จ",
      description: "ข้อมูลได้ถูกบันทึกแล้ว",
    });
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className={`bg-white shadow-md border-b-4 ${headerBorderColor}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  กลับหน้าหลัก
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{siteTitle}</h1>
                <p className="text-sm text-gray-600">จัดการของแจก ประกาศ หมวดหมู่ และโน๊ตส่วนตัว</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                localStorage.removeItem('isAdmin');
                setIsLoggedIn(false);
              }}
              variant="outline"
              className="border-red-500 text-red-700 hover:bg-red-50"
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              จัดการของแจก
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              ประกาศ
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              หมวดหมู่
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="w-4 h-4" />
              โน๊ตส่วนตัว
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <span className="text-xl">⋮</span>
              ตั้งค่าปุ่ม
            </TabsTrigger>
          </TabsList>

          {/* Items Management */}
          <TabsContent value="items" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <ItemForm
                onAddItem={handleAddItem}
                categories={categories}
                editingItem={editingItem}
                onUpdateItem={handleUpdateItem}
                onCancelEdit={() => setEditingItem(null)}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">รายการของแจกทั้งหมด</CardTitle>
                  <CardDescription>
                    จำนวนทั้งหมด: {items.length} รายการ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {/* เพิ่มตัวเลือกสีเส้นข้าง */}
                  <div className="mb-4">
                    <Label htmlFor="borderColorSelect">สีเส้นข้างการ์ด:</Label>
                    <select
                      id="borderColorSelect"
                      className="ml-2 border rounded px-2 py-1 text-sm"
                      value={borderColor}
                      onChange={e => {
                        setBorderColor(e.target.value);
                        saveBorderColorToFirebase(e.target.value); // save to firebase
                      }}
                    >
                      <option value="border-l-green-500 dark:border-l-green-400">เขียว (ค่าเริ่มต้น)</option>
                      <option value="border-l-blue-500 dark:border-l-blue-400">น้ำเงิน</option>
                      <option value="border-l-red-500 dark:border-l-red-400">แดง</option>
                      <option value="border-l-yellow-500 dark:border-l-yellow-400">เหลือง</option>
                      <option value="border-l-purple-500 dark:border-l-purple-400">ม่วง</option>
                      <option value="border-l-pink-500 dark:border-l-pink-400">ชมพู</option>
                      <option value="border-l-orange-500 dark:border-l-orange-400">ส้ม</option>
                      <option value="border-l-cyan-500 dark:border-l-cyan-400">ฟ้า</option>
                      <option value="border-l-teal-500 dark:border-l-teal-400">เขียวอมฟ้า</option>
                      <option value="border-l-emerald-500 dark:border-l-emerald-400">เขียวมรกต</option>
                      <option value="border-l-gray-500 dark:border-l-gray-400">เทา</option>
                      <option value="border-l-indigo-500 dark:border-l-indigo-400">คราม</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="headerBorderColorSelect">สีเส้นขอบล่างชื่อเว็บ:</Label>
                    <select
                      id="headerBorderColorSelect"
                      className="ml-2 border rounded px-2 py-1 text-sm"
                      value={headerBorderColor}
                      onChange={e => {
                        setHeaderBorderColor(e.target.value);
                        saveHeaderBorderColorToFirebase(e.target.value);
                      }}
                    >
                      <option value="border-green-500 dark:border-green-400">เขียว (ค่าเริ่มต้น)</option>
                      <option value="border-blue-500 dark:border-blue-400">น้ำเงิน</option>
                      <option value="border-red-500 dark:border-red-400">แดง</option>
                      <option value="border-yellow-500 dark:border-yellow-400">เหลือง</option>
                      <option value="border-purple-500 dark:border-purple-400">ม่วง</option>
                      <option value="border-pink-500 dark:border-pink-400">ชมพู</option>
                      <option value="border-orange-500 dark:border-orange-400">ส้ม</option>
                      <option value="border-cyan-500 dark:border-cyan-400">ฟ้า</option>
                      <option value="border-teal-500 dark:border-teal-400">เขียวอมฟ้า</option>
                      <option value="border-emerald-500 dark:border-emerald-400">เขียวมรกต</option>
                      <option value="border-gray-500 dark:border-gray-400">เทา</option>
                      <option value="border-indigo-500 dark:border-indigo-400">คราม</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="titleColorSelect">สีตัวอักษร PANEL FREE:</Label>
                    <select
                      id="titleColorSelect"
                      className="ml-2 border rounded px-2 py-1 text-sm"
                      value={titleColor}
                      onChange={e => {
                        setTitleColor(e.target.value);
                        saveTitleColorToFirebase(e.target.value);
                      }}
                    >
                      <option value="from-green-400 via-blue-500 to-purple-500">เขียว-น้ำเงิน-ม่วง (ค่าเริ่มต้น)</option>
                      <option value="from-pink-500 via-red-500 to-yellow-500">ชมพู-แดง-เหลือง</option>
                      <option value="from-blue-500 via-cyan-400 to-green-400">น้ำเงิน-ฟ้า-เขียว</option>
                      <option value="from-yellow-400 via-orange-500 to-red-500">เหลือง-ส้ม-แดง</option>
                      <option value="from-purple-500 via-indigo-500 to-blue-500">ม่วง-คราม-น้ำเงิน</option>
                      <option value="from-emerald-400 via-teal-400 to-cyan-400">เขียวมรกต-เขียวอมฟ้า-ฟ้า</option>
                      <option value="from-gray-400 via-gray-600 to-gray-800">เทาเข้ม</option>
                      <option value="from-lime-400 via-green-500 to-emerald-500">ไลม์-เขียว-มรกต</option>
                      <option value="from-fuchsia-500 via-pink-500 to-red-500">ฟูเชีย-ชมพู-แดง</option>
                      <option value="from-orange-400 via-yellow-400 to-lime-400">ส้ม-เหลือง-ไลม์</option>
                      <option value="from-sky-400 via-blue-500 to-indigo-500">ฟ้า-น้ำเงิน-คราม</option>
                      <option value="from-rose-400 via-pink-500 to-fuchsia-500">โรส-ชมพู-ฟูเชีย</option>
                    </select>
                  </div>
                  {items.map((item) => (
                    <div key={item.id} className="relative group">
                      <ItemCard item={item} borderColor={borderColor} />
                      <button
                        className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition-opacity opacity-80 group-hover:opacity-100"
                        title="ลบ"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className="absolute top-2 right-10 z-10 bg-yellow-400 text-white rounded-full p-1 shadow hover:bg-yellow-500 transition-opacity opacity-80 group-hover:opacity-100"
                        title="แก้ไข"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>ยังไม่มีของแจก</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Announcements Management */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">เพิ่มประกาศใหม่</CardTitle>
                  </div>
                  <CardDescription>
                    ประกาศจะแสดงในหน้าหลักให้คนทั่วไปเห็น
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ลบช่องกรอกหัวข้อประกาศออก */}
                  <div className="space-y-2">
                    <Label htmlFor="ann-content">เนื้อหาประกาศ</Label>
                    <Textarea
                      id="ann-content"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      placeholder="เขียนเนื้อหาประกาศที่ต้องการให้คนทั่วไปเห็น..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button
                    onClick={handleAddAnnouncement}
                    disabled={!newAnnouncement.content.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Megaphone className="w-4 h-4 mr-2" />
                    เพิ่มประกาศ
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ประกาศทั้งหมด</CardTitle>
                  <CardDescription>
                    จำนวนทั้งหมด: {announcements.length} ประกาศ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{announcement.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {announcement.content}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={announcement.isActive ? "default" : "secondary"}>
                                {announcement.isActive ? "แสดง" : "ซ่อน"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(announcement.dateCreated).toLocaleDateString('th-TH')}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleAnnouncement(announcement.id)}
                            >
                              {announcement.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {announcements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Megaphone className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>ยังไม่มีประกาศ</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Category Management */}
          <TabsContent value="categories">
            <CategoryManager 
              categories={categories}
              onUpdateCategories={handleUpdateCategories}
            />
          </TabsContent>

          {/* Admin Notes */}
          <TabsContent value="notes">
            <AdminNotes 
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          </TabsContent>

          {/* Admin Settings */}
          <TabsContent value="settings">
            <div className="mb-6">
              <Label htmlFor="siteTitleInput">ชื่อเว็บไซต์ (Site Title):</Label>
              <Input
                id="siteTitleInput"
                className="mt-1 max-w-xs"
                value={siteTitle}
                onChange={e => setSiteTitle(e.target.value)}
                onBlur={e => saveSiteTitleToFirebase(e.target.value)}
                placeholder="กรอกชื่อเว็บไซต์ใหม่"
              />
              <p className="text-xs text-gray-500 mt-1">เปลี่ยนชื่อที่จะแสดงในหน้าแรก เช่น "PANEL FREE"</p>
            </div>
            <AdminSettingsTab
              buttons={adminButtons}
              onAddButton={handleAddAdminButton}
              onRemoveButton={handleRemoveAdminButton}
              onUpdateAllButtons={handleUpdateAllAdminButtons}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
