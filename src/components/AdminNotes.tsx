import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StickyNote, Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminNote } from '@/types';

interface AdminNotesProps {
  notes: AdminNote[];
  onAddNote: (content: string) => void;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

const AdminNotes = ({ notes, onAddNote, onUpdateNote, onDeleteNote }: AdminNotesProps) => {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote('');
    }
  };

  const handleEditNote = (note: AdminNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdateNote(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-600" />
          <CardTitle className="text-lg">โน๊ตส่วนตัวแอดมิน</CardTitle>
        </div>
        <CardDescription>
          โน๊ตเหล่านี้จะเห็นได้เฉพาะแอดมินเท่านั้น
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new note */}
        <div className="space-y-2">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="เพิ่มโน๊ตใหม่..."
            className="min-h-[80px]"
          />
          <Button 
            onClick={handleAddNote} 
            disabled={!newNote.trim()}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มโน๊ต
          </Button>
        </div>

        {/* Existing notes */}
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                {editingId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        บันทึก
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        ยกเลิก
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800 mb-2 whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {new Date(note.dateCreated).toLocaleDateString('th-TH')}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditNote(note)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteNote(note.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {notes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>ยังไม่มีโน๊ต</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNotes;
