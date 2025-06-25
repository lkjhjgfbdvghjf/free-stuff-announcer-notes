export interface FreeItem {
  id: string;
  title: string;
  description: string; // รายละเอียดใหญ่ (ลิ้งค์)
  subDescription?: string; // รายละเอียดย่อย (ข้อความ)
  imageUrl?: string;
  category: string;
  quantity: number;
  dateAdded: string;
  isActive: boolean;
}

export interface AdminNote {
  id: string;
  content: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  dateCreated: string;
}
