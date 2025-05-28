import { useState, useEffect } from 'react';
import { analyticsService, type AnalyticsData } from '../../services/analytics';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const data = analyticsService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = analyticsService.exportAnalytics();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('모든 분석 데이터를 삭제하시겠습니까?')) {
      analyticsService.clearAnalytics();
      loadAnalytics();
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

  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="text-center py-6 text-text-muted">
          <p>분석 데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">📈</div>
          <div>
            <h3 className="font-bold text-text-primary">분석 대시보드</h3>
            <p className="text-text-muted text-sm">최근 30일 데이터</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
          >
            내보내기
          </button>
          <button
            onClick={clearData}
            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* 전체 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-600 mb-1">총 조회수</p>
            <p className="text-xl font-bold text-blue-900">{analytics.totalViews}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-green-600 mb-1">순 방문자</p>
            <p className="text-xl font-bold text-green-900">{analytics.uniqueVisitors}</p>
          </div>
        </div>

        {/* 인기 커피 */}
        <div>
          <h4 className="font-medium text-text-primary mb-2">인기 커피 TOP 5</h4>
          <div className="space-y-2">
            {analytics.topCoffees.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-3">데이터가 없습니다</p>
            ) : (
              analytics.topCoffees.map((coffee, index) => (
                <div key={coffee.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-badge-bg text-badge-text rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-text-primary">{coffee.name}</span>
                  </div>
                  <span className="text-sm text-text-muted">{coffee.views}회</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 일별 통계 */}
        <div>
          <h4 className="font-medium text-text-primary mb-2">최근 7일 통계</h4>
          <div className="space-y-1">
            {analytics.dailyStats.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-3">데이터가 없습니다</p>
            ) : (
              analytics.dailyStats.map(stat => (
                <div key={stat.date} className="flex justify-between items-center py-1">
                  <span className="text-sm text-text-muted">
                    {new Date(stat.date).toLocaleDateString('ko-KR', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex gap-3 text-sm">
                    <span className="text-blue-600">조회 {stat.views}</span>
                    <span className="text-green-600">방문 {stat.visitors}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 디바이스 통계 */}
        <div>
          <h4 className="font-medium text-text-primary mb-2">디바이스별 접속</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">모바일</p>
              <p className="font-bold text-text-primary">{analytics.deviceStats.mobile}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">데스크톱</p>
              <p className="font-bold text-text-primary">{analytics.deviceStats.desktop}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-xs text-text-muted">태블릿</p>
              <p className="font-bold text-text-primary">{analytics.deviceStats.tablet}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 