import { useState, useEffect, useMemo } from 'react';
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
}

interface CSVImportResult {
  success: boolean;
  imported: number;
  updated: number;
  errors: string[];
}

interface SyncConfig {
  type: 'googleSheets' | 'airtable';
  url: string;
  apiKey?: string; // Airtable용
}

export function FlavorNoteManager() {
  const [flavorNotes, setFlavorNotes] = useState<FlavorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<FlavorNote | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [syncConfig, setSyncConfig] = useState<SyncConfig>({ type: 'googleSheets', url: '' });
  const [syncing, setSyncing] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // 정렬 상태 추가
  const [sortField, setSortField] = useState<'titleKo' | 'titleEn' | 'category' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [formData, setFormData] = useState<FlavorNoteFormData>({
    titleKo: '',
    titleEn: '',
    emoji: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    const unsubscribe = firebaseApi.subscribeToFlavorNotes((notes) => {
      setFlavorNotes(notes);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 정렬된 데이터 계산
  const sortedFlavorNotes = useMemo(() => {
    return [...flavorNotes].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // 날짜 필드의 경우 Date 객체로 변환
      if (sortField === 'createdAt') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // 문자열 필드의 경우
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [flavorNotes, sortField, sortDirection]);

  // 헤더 클릭 핸들러
  const handleSort = (field: 'titleKo' | 'titleEn' | 'category' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬 아이콘 컴포넌트
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <Icons.Sort className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <Icons.SortUp className="w-4 h-4 text-text-primary" />
      : <Icons.SortDown className="w-4 h-4 text-text-primary" />;
  };

  const handleInputChange = (field: keyof FlavorNoteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (note: FlavorNote) => {
    setFormData({
      titleKo: note.titleKo,
      titleEn: note.titleEn,
      emoji: note.emoji,
      description: note.description,
      category: note.category || '',
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

    // 중복 체크 (편집 중인 항목은 제외)
    const duplicateKo = flavorNotes.find(note => 
      note.titleKo.toLowerCase() === formData.titleKo.toLowerCase() && 
      (!editingNote || note.id !== editingNote.id)
    );
    
    const duplicateEn = flavorNotes.find(note => 
      note.titleEn.toLowerCase() === formData.titleEn.toLowerCase() && 
      (!editingNote || note.id !== editingNote.id)
    );

    if (duplicateKo) {
      showToast(`한글 제목 "${formData.titleKo}"가 이미 존재합니다.`);
      return;
    }

    if (duplicateEn) {
      showToast(`영문 제목 "${formData.titleEn}"가 이미 존재합니다.`);
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

  // 중복 항목 정리 함수
  const cleanupDuplicates = async () => {
    if (!window.confirm('중복된 풍미노트를 정리하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      const titleMap = new Map<string, FlavorNote>();
      const duplicates: FlavorNote[] = [];
      
      // 한글 제목 기준으로 중복 찾기
      flavorNotes.forEach(note => {
        const key = note.titleKo.toLowerCase();
        if (titleMap.has(key)) {
          // 중복된 경우, 더 최근에 만들어진 것을 유지
          const existing = titleMap.get(key)!;
          const existingDate = new Date(existing.createdAt || 0);
          const currentDate = new Date(note.createdAt || 0);
          
          if (currentDate > existingDate) {
            duplicates.push(existing);
            titleMap.set(key, note);
          } else {
            duplicates.push(note);
          }
        } else {
          titleMap.set(key, note);
        }
      });

      // 중복 항목 삭제
      let deletedCount = 0;
      for (const duplicate of duplicates) {
        try {
          await firebaseApi.deleteFlavorNote(duplicate.id);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete duplicate: ${duplicate.titleKo}`, error);
        }
      }

      showToast(`${deletedCount}개의 중복 항목이 정리되었습니다.`);
    } catch (error) {
      console.error('Error cleaning duplicates:', error);
      showToast('중복 정리 중 오류가 발생했습니다.');
    }
  };

  const resetForm = () => {
    setFormData({
      titleKo: '',
      titleEn: '',
      emoji: '',
      description: '',
      category: '',
    });
    setEditingNote(null);
    setShowForm(false);
  };

  const exportToCSV = () => {
    const csvData = flavorNotes.map(note => ({
      titleKo: note.titleKo,
      titleEn: note.titleEn,
      emoji: note.emoji,
      description: note.description,
      category: note.category || '',
    }));

    const csv = Papa.unparse(csvData, {
      header: true
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `flavor-notes-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('CSV 파일이 다운로드되었습니다.');
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

  const syncFromUrl = async () => {
    if (!syncConfig.url.trim()) {
      showToast('동기화 URL을 입력해주세요.');
      return;
    }

    setSyncing(true);
    try {
      let csvText = '';

      if (syncConfig.type === 'googleSheets') {
        // Google Sheets CSV export URL 처리
        let url = syncConfig.url;
        if (url.includes('/edit')) {
          // 일반 Google Sheets URL을 CSV export URL로 변환
          const sheetId = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
          if (sheetId) {
            url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
          }
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Google Sheets 데이터를 가져올 수 없습니다.');
        }
        csvText = await response.text();
      } else if (syncConfig.type === 'airtable') {
        // Airtable API 동기화 (향후 구현 예정)
        showToast('Airtable 동기화는 곧 지원될 예정입니다.');
        setSyncing(false);
        return;
      }

      await importFromCSV(csvText);
      showToast('외부 데이터 동기화가 완료되었습니다.');
      setShowSync(false);
    } catch (error) {
      console.error('Sync error:', error);
      showToast('동기화 중 오류가 발생했습니다.');
    } finally {
      setSyncing(false);
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
    Download: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M8 5a7 7 0 108 0" />
      </svg>
    ),
    Sync: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
    Sort: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
      </svg>
    ),
    SortUp: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8" />
      </svg>
    ),
    SortDown: ({ className = "w-4 h-4" }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l3 3m0 0l3-3m-3 3V8" />
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">풍미노트 관리</h2>
            <p className="text-text-muted text-sm">총 {flavorNotes.length}개의 풍미노트</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cleanupDuplicates}
              className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors touch-manipulation"
              title="중복 항목 정리"
            >
              <Icons.Delete className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">중복 정리</span>
            </button>
            <button
              onClick={() => setShowSync(true)}
              className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors touch-manipulation"
              title="외부 동기화"
            >
              <Icons.Sync className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">동기화</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors touch-manipulation"
              title="CSV 내보내기"
            >
              <Icons.Download className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">내보내기</span>
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors touch-manipulation"
              title="CSV 가져오기"
            >
              <Icons.Upload className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">가져오기</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90 transition-colors touch-manipulation"
              title="새 풍미노트 추가"
            >
              <Icons.Add className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">추가</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('titleKo')}
                  >
                    <div className="flex items-center gap-2">
                      풍미노트
                      <SortIcon field="titleKo" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('titleEn')}
                  >
                    <div className="flex items-center gap-2">
                      영문명
                      <SortIcon field="titleEn" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      카테고리
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    설명
                  </th>
                  <th 
                    className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      생성일
                      <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedFlavorNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{note.emoji}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{note.titleKo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{note.titleEn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {note.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {note.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {note.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {note.createdAt && new Date(note.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(note)}
                          className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors touch-manipulation"
                          title="편집"
                        >
                          <Icons.Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(note.id)}
                          className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors touch-manipulation"
                          title="삭제"
                        >
                          <Icons.Delete className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {flavorNotes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🌟</div>
              <p className="text-lg text-text-muted">등록된 풍미노트가 없습니다.</p>
              <p className="text-sm text-text-muted">새 풍미노트를 추가하거나 CSV 파일을 가져와보세요!</p>
            </div>
          )}
        </div>
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

      {/* Sync Modal */}
      {showSync && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg h-[80vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">외부 동기화</h2>
                <button
                  onClick={() => setShowSync(false)}
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
                    동기화 유형
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSyncConfig(prev => ({ ...prev, type: 'googleSheets' }))}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        syncConfig.type === 'googleSheets'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Google Sheets
                    </button>
                    <button
                      onClick={() => setSyncConfig(prev => ({ ...prev, type: 'airtable' }))}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        syncConfig.type === 'airtable'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Airtable
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {syncConfig.type === 'googleSheets' ? 'Google Sheets URL' : 'Airtable URL'}
                  </label>
                  <input
                    type="url"
                    value={syncConfig.url}
                    onChange={(e) => setSyncConfig(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder={
                      syncConfig.type === 'googleSheets'
                        ? 'https://docs.google.com/spreadsheets/d/...'
                        : 'https://airtable.com/...'
                    }
                  />
                </div>

                {syncConfig.type === 'airtable' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      API Key (선택사항)
                    </label>
                    <input
                      type="password"
                      value={syncConfig.apiKey || ''}
                      onChange={(e) => setSyncConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="Airtable API Key"
                    />
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">사용 방법:</h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    {syncConfig.type === 'googleSheets' ? (
                      <>
                        <p>1. Google Sheets를 공개 상태로 설정하세요.</p>
                        <p>2. 스프레드시트 URL을 복사하여 붙여넣으세요.</p>
                        <p>3. 첫 번째 행은 헤더(titleKo, titleEn, emoji, description, category)여야 합니다.</p>
                      </>
                    ) : (
                      <>
                        <p>1. Airtable 베이스를 공개하거나 API 키를 입력하세요.</p>
                        <p>2. 베이스 URL을 복사하여 붙여넣으세요.</p>
                        <p>3. titleKo, titleEn, emoji, description, category 필드가 필요합니다.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 p-6 pt-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSync(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={syncFromUrl}
                  disabled={syncing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      동기화 중...
                    </>
                  ) : (
                    <>
                      <Icons.Sync className="w-4 h-4" />
                      동기화
                    </>
                  )}
                </button>
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