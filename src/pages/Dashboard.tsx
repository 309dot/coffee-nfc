import { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import { api, type CoffeeApiData } from '../services/api';

interface CoffeeCardProps {
  coffee: CoffeeApiData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

function CoffeeCard({ coffee, onEdit, onDelete, onToggleActive }: CoffeeCardProps) {
  return (
    <div className={`border rounded-lg p-4 ${coffee.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${coffee.active ? 'text-text-primary' : 'text-gray-400'}`}>
            {coffee.titleKo}
          </h3>
          <p className={`text-sm ${coffee.active ? 'text-text-muted' : 'text-gray-400'}`}>
            {coffee.titleEn}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            coffee.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {coffee.active ? '활성' : '비활성'}
          </span>
          <span className="text-sm font-medium text-text-primary">
            {coffee.price ? `₩${coffee.price.toLocaleString()}` : '가격 미설정'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {coffee.flavorNotes.slice(0, 3).map((note, index) => (
          <Badge key={index} className="text-xs">
            {note}
          </Badge>
        ))}
        {coffee.flavorNotes.length > 3 && (
          <span className="text-xs text-text-muted">+{coffee.flavorNotes.length - 3}</span>
        )}
      </div>

      <p className="text-sm text-text-muted mb-4 line-clamp-2">
        {coffee.masterComment}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(coffee.id)}
          className="flex-1 py-2 px-3 bg-text-primary text-white rounded-lg text-sm font-medium hover:bg-text-primary/90"
        >
          편집
        </button>
        <button
          onClick={() => onToggleActive(coffee.id, !coffee.active)}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
            coffee.active
              ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          {coffee.active ? '비활성화' : '활성화'}
        </button>
        <button
          onClick={() => onDelete(coffee.id)}
          className="py-2 px-3 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200"
        >
          삭제
        </button>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [coffees, setCoffees] = useState<CoffeeApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState<CoffeeApiData | null>(null);
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
    price: 0,
    active: true
  });
  const [flavorNoteInput, setFlavorNoteInput] = useState('');

  // 데이터 로딩
  const loadCoffees = async () => {
    setLoading(true);
    try {
      const data = await api.getAllCoffeesAdmin();
      setCoffees(data);
    } catch (error) {
      console.error('Error loading coffees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoffees();
  }, []);

  // 폼 관련 함수들
  const handleInputChange = (field: string, value: string | number | boolean) => {
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

  const resetForm = () => {
    setFormData({
      titleKo: '',
      titleEn: '',
      flavorNotes: [],
      masterComment: '',
      country: '',
      farm: '',
      variety: '',
      process: '',
      region: '',
      altitude: '',
      description: '',
      price: 0,
      active: true
    });
    setFlavorNoteInput('');
    setEditingCoffee(null);
    setShowForm(false);
  };

  // CRUD 함수들
  const handleEdit = (id: string) => {
    const coffee = coffees.find(c => c.id === id);
    if (coffee) {
      setEditingCoffee(coffee);
      setFormData({
        titleKo: coffee.titleKo,
        titleEn: coffee.titleEn,
        flavorNotes: [...coffee.flavorNotes],
        masterComment: coffee.masterComment,
        country: coffee.country,
        farm: coffee.farm,
        variety: coffee.variety,
        process: coffee.process,
        region: coffee.region,
        altitude: coffee.altitude,
        description: coffee.description,
        price: coffee.price || 0,
        active: coffee.active
      });
      setShowForm(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 원두를 삭제하시겠습니까?')) {
      try {
        await api.deleteCoffee(id);
        loadCoffees();
      } catch (error) {
        console.error('Error deleting coffee:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      if (active) {
        await api.activateCoffee(id);
      } else {
        await api.deleteCoffee(id);
      }
      loadCoffees();
    } catch (error) {
      console.error('Error toggling coffee status:', error);
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleSave = async () => {
    try {
      if (editingCoffee) {
        // 편집 모드
        await api.updateCoffee(editingCoffee.id, formData);
        alert('원두 정보가 업데이트되었습니다.');
      } else {
        // 생성 모드
        await api.createCoffee(formData);
        alert('새 원두가 추가되었습니다.');
      }
      loadCoffees();
      resetForm();
    } catch (error) {
      console.error('Error saving coffee:', error);
      alert('저장 중 오류가 발생했습니다.');
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

  return (
    <div className="bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">커피 관리 대시보드</h1>
            <p className="text-text-muted">원두 정보를 관리하고 편집할 수 있습니다.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-text-primary text-white rounded-lg font-medium hover:bg-text-primary/90"
          >
            새 원두 추가
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {coffees.filter(c => c.active).length}
            </div>
            <div className="text-sm text-green-600">활성 원두</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {coffees.filter(c => !c.active).length}
            </div>
            <div className="text-sm text-orange-600">비활성 원두</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {coffees.length}
            </div>
            <div className="text-sm text-blue-600">전체 원두</div>
          </div>
        </div>

        {/* Coffee List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text-primary">원두 목록</h2>
          {coffees.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              등록된 원두가 없습니다. 새 원두를 추가해보세요!
            </div>
          ) : (
            <div className="grid gap-4">
              {coffees.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingCoffee ? '원두 편집' : '새 원두 추가'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Form 내용 - 간단 버전 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      한글명
                    </label>
                    <input
                      type="text"
                      value={formData.titleKo}
                      onChange={(e) => handleInputChange('titleKo', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: 에티오피아 예가체프"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      영문명
                    </label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => handleInputChange('titleEn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                      placeholder="예: Ethiopia Yirgacheffe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    맛 노트
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={flavorNoteInput}
                      onChange={(e) => setFlavorNoteInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addFlavorNote()}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
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

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    사장님 설명
                  </label>
                  <textarea
                    value={formData.masterComment}
                    onChange={(e) => handleInputChange('masterComment', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    placeholder="원두에 대한 간단한 설명"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">나라</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">농장</label>
                    <input
                      type="text"
                      value={formData.farm}
                      onChange={(e) => handleInputChange('farm', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">프로세스</label>
                    <input
                      type="text"
                      value={formData.process}
                      onChange={(e) => handleInputChange('process', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">가격</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-text-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-text-primary text-white rounded-lg font-medium hover:bg-text-primary/90"
                >
                  {editingCoffee ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 