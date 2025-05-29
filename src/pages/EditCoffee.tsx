import { useState, useEffect } from 'react';
import { api, type CoffeeApiData } from '../services/api';

interface EditCoffeeProps {
  coffeeId?: string;
}

export function EditCoffee({ coffeeId = 'eth-001' }: EditCoffeeProps) {
  const [coffee, setCoffee] = useState<CoffeeApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titleKo: '',
    titleEn: '',
    flavorNotes: [] as string[],
    masterComment: '',
    country: '',
    farm: '',
    variety: '',
    process: '',
    region: '',
    altitude: '',
    description: '',
    price: 0
  });
  const [flavorNoteInput, setFlavorNoteInput] = useState('');

  useEffect(() => {
    const loadCoffeeData = async () => {
      setLoading(true);
      try {
        const data = await api.getCoffeeById(coffeeId);
        if (data) {
          setCoffee(data);
          setFormData({
            titleKo: data.titleKo,
            titleEn: data.titleEn,
            flavorNotes: [...data.flavorNotes],
            masterComment: data.masterComment,
            country: data.country,
            farm: data.farm,
            variety: data.variety,
            process: data.process,
            region: data.region,
            altitude: data.altitude,
            description: data.description,
            price: data.price || 0
          });
        }
      } catch (error) {
        console.error('Error loading coffee data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoffeeData();
  }, [coffeeId]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFlavorNote = () => {
    if (flavorNoteInput.trim() && !formData.flavorNotes.includes(flavorNoteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        flavorNotes: [...prev.flavorNotes, flavorNoteInput.trim()]
      }));
      setFlavorNoteInput('');
    }
  };

  const removeFlavorNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      flavorNotes: prev.flavorNotes.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!coffee) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        active: coffee.active,
        id: coffee.id
      };

      const result = await api.updateCoffee(coffee.id, updateData);
      if (result) {
        setCoffee(result);
        alert('커피 데이터가 성공적으로 저장되었습니다!');
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving coffee data:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center p-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="bg-white flex-1 flex flex-col items-center justify-center p-6">
        <p className="text-text-muted">커피 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">커피 데이터 편집</h1>
          <p className="text-text-muted">원두 정보를 수정할 수 있습니다.</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* 타이틀 영역 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">타이틀 정보</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                원두명 + 나라 (한글)
              </label>
              <input
                type="text"
                value={formData.titleKo}
                onChange={(e) => handleInputChange('titleKo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                placeholder="예: 에티오피아 예가체프"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                원두명 + 나라 (영문)
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleInputChange('titleEn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                placeholder="예: Ethiopia Yirgacheffe"
              />
            </div>
          </div>

          {/* 맛 노트 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">맛 노트</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={flavorNoteInput}
                onChange={(e) => setFlavorNoteInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFlavorNote()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                placeholder="맛 노트 추가"
              />
              <button
                onClick={addFlavorNote}
                className="px-4 py-2 bg-text-primary text-white rounded-lg hover:bg-text-primary/90"
              >
                추가
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.flavorNotes.map((note, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-badge-bg text-badge-text rounded-full text-sm"
                >
                  {note}
                  <button
                    onClick={() => removeFlavorNote(index)}
                    className="text-badge-text hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 사장님 설명 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">사장님 설명</h3>
            
            <div className="space-y-2">
              <textarea
                value={formData.masterComment}
                onChange={(e) => handleInputChange('masterComment', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent resize-vertical"
                placeholder="사장님의 원두 설명을 입력하세요"
              />
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">상세 정보</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">나라</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 에티오피아"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">농장</label>
                <input
                  type="text"
                  value={formData.farm}
                  onChange={(e) => handleInputChange('farm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 고롤차 농장"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">품종</label>
                <input
                  type="text"
                  value={formData.variety}
                  onChange={(e) => handleInputChange('variety', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 헤이룸, 쿠루메, 웰리초"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">프로세스</label>
                <input
                  type="text"
                  value={formData.process}
                  onChange={(e) => handleInputChange('process', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 내추럴"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">지역</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 시다모, 예가체프"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">고도</label>
                <input
                  type="text"
                  value={formData.altitude}
                  onChange={(e) => handleInputChange('altitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                  placeholder="예: 2,100m"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">가격 (원)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent"
                placeholder="예: 28000"
              />
            </div>
          </div>

          {/* 원두 소개 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">원두 소개</h3>
            
            <div className="space-y-2">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-text-primary focus:border-transparent resize-vertical"
                placeholder="원두에 대한 자세한 설명을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              saving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-text-primary hover:bg-text-primary/90'
            }`}
          >
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </div>
    </div>
  );
} 