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
  // App Details (Optional)
  publisher?: string;
  updatedDate?: string;
  size?: string;
  version?: string;
  requirements?: string;
  downloadCount?: string; // จำนวนคนดาวน์โหลด เช่น "1M+", "500K+", "10K+"
  appIcon?: string; // URL ของไอคอนแอป
  rating?: number; // คะแนนเฉลี่ย (0-5)
  ratingCount?: number; // จำนวนคนให้คะแนน
  // Gallery Images
  galleryImages?: string[]; // ภาพประกอบแอป
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

export interface AdBannerData {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  isActive: boolean;
  dateCreated: string;
}
