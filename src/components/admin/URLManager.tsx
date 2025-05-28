import { useState, useEffect } from 'react';
import { urlGeneratorService, type URLData } from '../../services/urlGenerator';
import { googleSheetsService, type CoffeeData } from '../../services/googleSheets';

export function URLManager() {
  const [coffees, setCoffees] = useState<CoffeeData[]>([]);
  const [urls, setUrls] = useState<URLData[]>([]);
  const [selectedCoffee, setSelectedCoffee] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const coffeeData = await googleSheetsService.fetchCoffeeData();
      setCoffees(coffeeData);
      setUrls(urlGeneratorService.getAllURLs());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateURL = () => {
    const coffee = coffees.find(c => c.id === selectedCoffee);
    if (!coffee) return;

    const urlData = urlGeneratorService.generateURL(coffee);
    urlData.qrCode = urlGeneratorService.generateQRCode(urlData.url);
    
    urlGeneratorService.saveURL(urlData);
    setUrls(urlGeneratorService.getAllURLs());
    setSelectedCoffee('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  const deleteURL = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      urlGeneratorService.deleteURL(id);
      setUrls(urlGeneratorService.getAllURLs());
    }
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
        <div className="text-2xl">🔗</div>
        <div>
          <h3 className="font-bold text-text-primary">URL 관리</h3>
          <p className="text-text-muted text-sm">커피별 고유 URL을 생성하고 관리합니다</p>
        </div>
      </div>

      {/* URL 생성 */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <select
            value={selectedCoffee}
            onChange={(e) => setSelectedCoffee(e.target.value)}
            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">커피를 선택하세요</option>
            {coffees.map(coffee => (
              <option key={coffee.id} value={coffee.id}>
                {coffee.name} - {coffee.origin}
              </option>
            ))}
          </select>
          <button
            onClick={generateURL}
            disabled={!selectedCoffee}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCoffee
                ? 'bg-badge-bg text-badge-text hover:bg-badge-bg/80'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            URL 생성
          </button>
        </div>
      </div>

      {/* URL 목록 */}
      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">생성된 URL ({urls.length}개)</h4>
        
        {urls.length === 0 ? (
          <div className="text-center py-6 text-text-muted">
            <p>생성된 URL이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {urls.map(url => (
              <div key={url.id} className="bg-gray-50 rounded-xl p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h5 className="font-medium text-text-primary text-sm">
                      {url.name}
                    </h5>
                    <p className="text-text-muted text-xs">{url.origin}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyToClipboard(url.url)}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                    >
                      복사
                    </button>
                    <button
                      onClick={() => deleteURL(url.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded p-2 mb-2">
                  <p className="text-xs text-gray-600 break-all">{url.url}</p>
                </div>
                
                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span>클릭: {url.clicks}회</span>
                  <span>{new Date(url.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 