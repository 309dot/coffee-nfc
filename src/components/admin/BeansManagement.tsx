import { useState, useEffect } from 'react';
import { googleSheetsService, type CoffeeData } from '../../services/googleSheets';

export function BeansManagement() {
  const [coffees, setCoffees] = useState<CoffeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<boolean | null>(null);

  useEffect(() => {
    loadCoffees();
  }, []);

  const loadCoffees = async () => {
    setLoading(true);
    try {
      const data = await googleSheetsService.fetchCoffeeData();
      setCoffees(data);
    } catch (error) {
      console.error('Error loading coffees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCoffees = coffees.filter(coffee => {
    const matchesSearch = coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coffee.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coffee.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === null || coffee.active === filterActive;
    
    return matchesSearch && matchesFilter;
  });

  const toggleActive = (coffeeId: string) => {
    setCoffees(prev => prev.map(coffee => 
      coffee.id === coffeeId 
        ? { ...coffee, active: !coffee.active }
        : coffee
    ));
    
    // 실제로는 여기서 서버나 구글 시트에 업데이트해야 함
    console.log('Toggle active status for coffee:', coffeeId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">☕</div>
        <div>
          <h3 className="font-bold text-text-primary">원두 관리</h3>
          <p className="text-text-muted text-sm">등록된 커피 원두를 관리합니다</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          placeholder="커피명, 원산지, 농장주로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm"
        />
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive(null)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterActive === null
                ? 'bg-badge-bg text-badge-text'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 ({coffees.length})
          </button>
          <button
            onClick={() => setFilterActive(true)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterActive === true
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            활성 ({coffees.filter(c => c.active).length})
          </button>
          <button
            onClick={() => setFilterActive(false)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filterActive === false
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            비활성 ({coffees.filter(c => !c.active).length})
          </button>
        </div>
      </div>

      {/* 커피 목록 */}
      <div className="space-y-3">
        {filteredCoffees.length === 0 ? (
          <div className="text-center py-6 text-text-muted">
            <p>조건에 맞는 커피가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCoffees.map(coffee => (
              <div key={coffee.id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-text-primary">{coffee.name}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        coffee.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {coffee.active ? '활성' : '비활성'}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">{coffee.origin}</p>
                    <p className="text-text-muted text-xs">농장주: {coffee.farmer}</p>
                  </div>
                  <button
                    onClick={() => toggleActive(coffee.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      coffee.active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {coffee.active ? '비활성화' : '활성화'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-text-muted">가격</p>
                    <p className="font-medium text-text-primary">{formatPrice(coffee.price)}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-text-muted">로스팅</p>
                    <p className="font-medium text-text-primary">{coffee.roastLevel}</p>
                  </div>
                </div>

                {coffee.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {coffee.badges.map((badge, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-badge-bg text-badge-text rounded-full text-xs"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}

                {coffee.tastingNotes.length > 0 && (
                  <div className="text-xs text-text-muted">
                    <span className="font-medium">테이스팅 노트: </span>
                    {coffee.tastingNotes.join(', ')}
                  </div>
                )}

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-text-muted">
                    등록일: {new Date(coffee.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                  <span className="text-xs text-text-muted">
                    수확: {coffee.harvestDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새로고침 버튼 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={loadCoffees}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          데이터 새로고침
        </button>
      </div>
    </div>
  );
} 