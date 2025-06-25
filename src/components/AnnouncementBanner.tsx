import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { Announcement } from '@/types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

const AnnouncementBanner = ({ announcements }: AnnouncementBannerProps) => {
  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {activeAnnouncements.map((announcement) => (
        <Alert key={announcement.id} className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <Megaphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold text-sm">
            ประกาศ 📢
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-200 mt-1 text-sm overflow-hidden whitespace-nowrap">
            <span className="inline-block announcement-marquee">
              {announcement.content}
            </span>
          </AlertDescription>
        </Alert>
      ))}
      {/* เพิ่ม style tag ปกติสำหรับ marquee (ช้าลง) */}
      {typeof window !== 'undefined' && (
        <style>{`
          @keyframes announcement-marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .announcement-marquee {
            display: inline-block;
            min-width: 100%;
            animation: announcement-marquee 24s linear infinite;
          }
        `}</style>
      )}
    </div>
  );
};

export default AnnouncementBanner;
