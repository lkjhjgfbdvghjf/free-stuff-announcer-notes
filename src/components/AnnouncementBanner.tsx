
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
    <div className="space-y-4 mb-8">
      {activeAnnouncements.map((announcement) => (
        <Alert key={announcement.id} className="border-blue-200 bg-blue-50">
          <Megaphone className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-semibold">
            {announcement.title}
          </AlertTitle>
          <AlertDescription className="text-blue-700 mt-2">
            {announcement.content}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default AnnouncementBanner;
