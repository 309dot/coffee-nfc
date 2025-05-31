import { useState, useEffect } from 'react';
import { Toast, useToast } from './ui/Toast';
import { firebaseApi } from '../services/firebaseApi';
import Papa from 'papaparse';
import type { FlavorNote } from '../types';

interface FlavorNoteFormData {
  titleKo: string;
  titleEn: string;
  emoji: string;
  description: string;
  category: string;
  active: boolean;
}

interface CSVImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
}

export function FlavorNoteManager() {
  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<FlavorNote | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const [formData, setFormData] = useState<FlavorNoteFormData>({
    titleKo: '',
    titleEn: '',
    emoji: '',
    description: '',
    category: '',
    active: true,
  });

  useEffect(() => {
    const unsubscribe = firebaseApi.subscribeToFlavorNotes((notes) => {
      setFlavorNotes(notes);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleInputChange = (field: keyof FlavorNoteFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (note: FlavorNote) => {
    setFormData({
      titleKo: note.titleKo,
      titleEn: note.titleEn,
      emoji: note.emoji,
      description: note.description,
      category: note.category || '',
      active: note.active,
    });
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말로 이 풍미노트를 삭제하시겠습니까?')) {
      try {
        await firebaseApi.deleteFlavorNote(id);
        showToast('풍미노트가 삭제되었습니다.');
      } catch (error) {
        console.error('Error deleting flavor note:', error);
        showToast('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSave = async () => {
    if (!formData.titleKo.trim() || !formData.titleEn.trim()) {
      showToast('제목을 입력해주세요.');
      return;
    }

    try {
      if (editingNote) {
        await firebaseApi.updateFlavorNote(editingNote.id, formData);
        showToast('풍미노트가 수정되었습니다.');
      } else {
        await firebaseApi.createFlavorNote(formData);
        showToast('풍미노트가 생성되었습니다.');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving flavor note:', error);
      showToast('저장 중 오류가 발생했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      titleKo: '',
      titleEn: '',
      emoji: '',
      description: '',
      category: '',
      active: true,
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      importFromCSV(text);
    };
    reader.readAsText(file);
  };

  const importFromCSV = async (csvText: string) => {
    const result: CSVImportResult = {
      success: false,
      imported: 0,
      updated: 0,
      errors: [],
    };

    try {
      const parseResult = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      if (parseResult.errors.length > 0) {
        result.errors = parseResult.errors.map((err: any) => err.message);
        setImportResult(result);
        return;
      }

      const existingNotes = flavorNotes;
      const existingMap = new Map(existingNotes.map(note => [note.titleEn.toLowerCase(), note]));

      for (const row of parseResult.data as any[]) {
        try {
          if (!row.titleEn || !row.titleKo) {
            result.errors.push(`제목이 없는 행을 건너뜁니다: ${JSON.stringify(row)}`);
            continue;
          }

          const noteData = {
            titleKo: row.titleKo || row['제목(한글)'] || '',
            titleEn: row.titleEn || row['제목(영문)'] || '',
            emoji: row.emoji || row['이모지'] || '☕',
            description: row.description || row['설명'] || '',
            category: row.category || row['카테고리'] || '',
            active: true,
          };

          const existingNote = existingMap.get(noteData.titleEn.toLowerCase());

          if (existingNote) {
            // 기존 데이터 업데이트
            await firebaseApi.updateFlavorNote(existingNote.id, noteData);
            result.updated++;
          } else {
            // 새 데이터 생성
            await firebaseApi.createFlavorNote(noteData);
            result.imported++;
          }
        } catch (error) {
          result.errors.push(`행 처리 오류: ${error}`);
        }
      }

      result.success = result.errors.length === 0;
      setImportResult(result);
      
      if (result.success) {
        showToast(`가져오기 완료: ${result.imported}개 추가, ${result.updated}개 업데이트`);
      } else {
        showToast('가져오기 중 일부 오류가 발생했습니다.');
      }
    } catch (error) {
      result.errors.push(`CSV 파싱 오류: ${error}`);
      setImportResult(result);
      showToast('CSV 파일 처리 중 오류가 발생했습니다.');
    }
  };

  const Icons = {
    Add: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    Edit: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    Delete: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    Upload: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    Close: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    Save: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🌟</div>
        <p className="text-text-muted">풍미노트를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-text-primary">풍미노트 관리</h2>
            <p className="text-text-muted text-sm">총 {flavorNotes.length}개의 풍미노트</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icons.Upload className="w-4 h-4" />
              CSV 가져오기
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
            >
              <Icons.Add className="w-4 h-4" />
              새 풍미노트 추가
            </button>
          </div>
        </div>

        {/* Flavor Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flavorNotes.map((note) => (
            <div key={note.id} className="border rounded-xl p-4 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{note.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{note.titleKo}</h3>
                    <p className="text-sm text-text-muted">{note.titleEn}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {note.active ? '활성' : '비활성'}
                </span>
              </div>
              
              {note.category && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {note.category}
                  </span>
                </div>
              )}
              
              <p className="text-sm text-text-muted mb-3 line-clamp-2">{note.description}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="편집"
                >
                  <Icons.Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="삭제"
                >
                  <Icons.Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {flavorNotes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🌟</div>
            <p className="text-lg text-text-muted">등록된 풍미노트가 없습니다.</p>
            <p className="text-sm text-text-muted">새 풍미노트를 추가하거나 CSV 파일을 가져와보세요!</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingNote ? '풍미노트 편집' : '새 풍미노트 추가'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      제목(한글) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      제목(영문) *
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      이모지
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
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="과일, 견과류, 플로럴 등"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="풍미노트에 대한 자세한 설명을 입력해주세요"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="noteActive"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="w-4 h-4 text-text-primary rounded"
                  />
                  <label htmlFor="noteActive" className="text-sm font-medium text-text-primary">
                    풍미노트 활성화
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex gap-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors"
                >
                  <Icons.Save className="w-4 h-4" />
                  {editingNote ? '수정' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md h-[70vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">CSV 가져오기</h2>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportResult(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icons.Close className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4 pb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    CSV 파일 선택
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    CSV 파일은 titleKo, titleEn, emoji, description, category 열을 포함해야 합니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">CSV 형식 예시:</h4>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
{`titleKo,titleEn,emoji,description,category
레몬 껍질,lemon peel,🍋,상큼한 레몬 향,과일
초콜릿,chocolate,🍫,진한 초콜릿 향,단맛`}
                  </pre>
                </div>

                {importResult && (
                  <div className={`p-4 rounded-lg ${
                    importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <h4 className={`font-medium mb-2 ${
                      importResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      가져오기 결과
                    </h4>
                    <div className="text-sm space-y-1">
                      <p>✅ 새로 추가: {importResult.imported}개</p>
                      <p>🔄 업데이트: {importResult.updated}개</p>
                      {importResult.errors.length > 0 && (
                        <div>
                          <p className="text-red-600">❌ 오류:</p>
                          <ul className="list-disc list-inside ml-2">
                            {importResult.errors.map((error, index) => (
                              <li key={index} className="text-red-600 text-xs">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast 
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
} 