import { useState, useEffect } from 'react';
import { firebaseApi } from '../services/firebaseApi';
import type { FlavorNote } from '../types';

interface FlavorNoteFormData {
  titleKo: string;
  titleEn: string;
  emoji: string;
  imageUrl: string;
  description: string;
  category: string;
  active: boolean;
}

export function FlavorNoteManagement() {
  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<FlavorNote | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const [formData, setFormData] = useState<FlavorNoteFormData>({
    titleKo: '',
    titleEn: '',
    emoji: '',
    imageUrl: '',
    description: '',
    category: '',
    active: true
  });

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  useEffect(() => {
    loadFlavorNotes();
  }, []);

  const loadFlavorNotes = async () => {
    setLoading(true);
    try {
      const notes = await firebaseApi.getAllFlavorNotesAdmin();
      setFlavorNotes(notes);
    } catch (error) {
      console.error('Error loading flavor notes:', error);
      showNotificationMessage('풍미 노트 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      titleKo: '',
      titleEn: '',
      emoji: '',
      imageUrl: '',
      description: '',
      category: '',
      active: true
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleInputChange = (field: keyof FlavorNoteFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.titleKo.trim() || !formData.titleEn.trim() || !formData.emoji.trim()) {
      showNotificationMessage('필수 필드를 모두 입력해주세요.');
      return;
    }

    try {
      if (editingNote) {
        const updatedNote = await firebaseApi.updateFlavorNote(editingNote.id, formData);
        if (updatedNote) {
          setFlavorNotes(prev => prev.map(note => note.id === editingNote.id ? updatedNote : note));
          showNotificationMessage('풍미 노트가 수정되었습니다.');
        }
      } else {
        const newNote = await firebaseApi.createFlavorNote(formData);
        setFlavorNotes(prev => [...prev, newNote]);
        showNotificationMessage('새 풍미 노트가 추가되었습니다.');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving flavor note:', error);
      showNotificationMessage('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (note: FlavorNote) => {
    setFormData({
      titleKo: note.titleKo,
      titleEn: note.titleEn,
      emoji: note.emoji,
      imageUrl: note.imageUrl || '',
      description: note.description,
      category: note.category || '',
      active: note.active
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 풍미 노트를 삭제하시겠습니까?')) {
      try {
        await firebaseApi.deleteFlavorNote(id);
        setFlavorNotes(prev => prev.filter(note => note.id !== id));
        showNotificationMessage('풍미 노트가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting flavor note:', error);
        showNotificationMessage('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const updatedNote = await firebaseApi.toggleFlavorNoteActive(id, active);
      if (updatedNote) {
        setFlavorNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
        showNotificationMessage(`풍미 노트가 ${active ? '활성화' : '비활성화'}되었습니다.`);
      }
    } catch (error) {
      console.error('Error toggling flavor note status:', error);
      showNotificationMessage('상태 변경 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary break-keep word-break-keep">풍미 노트 관리</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
        >
          <span className="text-lg">+</span>
          새 풍미 노트 추가
        </button>
      </div>

      {/* Flavor Notes Grid */}
      {flavorNotes.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">🌟</div>
          <p className="text-lg break-keep word-break-keep">등록된 풍미 노트가 없습니다.</p>
          <p className="text-sm break-keep word-break-keep">새 풍미 노트를 추가해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flavorNotes.map((note) => (
            <div key={note.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary break-keep word-break-keep">{note.titleKo}</h3>
                    <p className="text-sm text-text-muted break-keep word-break-keep">{note.titleEn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(note.id, !note.active)}
                    className={`w-8 h-4 rounded-full relative transition-colors ${
                      note.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                      note.active ? 'translate-x-4' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
              
              {note.category && (
                <div className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-text-muted break-keep word-break-keep">
                  {note.category}
                </div>
              )}
              
              <p className="text-sm text-text-primary leading-relaxed break-keep word-break-keep">
                {note.description.length > 80 ? `${note.description.substring(0, 80)}...` : note.description}
              </p>
              
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                >
                  편집
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/55 backdrop-blur-sm p-6">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-text-primary break-keep word-break-keep">
                  {editingNote ? '풍미 노트 편집' : '새 풍미 노트 추가'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">×</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      풍미명(한글) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary break-keep word-break-keep"
                      placeholder="예: 레몬 껍질"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      풍미명(영문) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary break-keep word-break-keep"
                      placeholder="예: lemon peel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      이모지 *
                    </label>
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={(e) => handleInputChange('emoji', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="🍋"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      카테고리
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary break-keep word-break-keep"
                      placeholder="예: 과일, 견과류, 향신료"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    이미지 URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    상세 설명 *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary break-keep word-break-keep"
                    placeholder="풍미에 대한 자세한 설명을 입력해주세요"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="w-4 h-4 text-text-primary rounded"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-text-primary break-keep word-break-keep">
                    풍미 노트 활성화
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors break-keep word-break-keep"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors break-keep word-break-keep"
                >
                  {editingNote ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-text-primary text-white px-6 py-3 rounded-lg shadow-lg break-keep word-break-keep">
            {notificationMessage}
          </div>
        </div>
      )}
    </div>
  );
} 