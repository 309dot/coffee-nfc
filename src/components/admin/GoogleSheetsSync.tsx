import { useState } from 'react';
import { googleSheetsService } from '../../services/googleSheets';

export function GoogleSheetsSync() {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(
    googleSheetsService.getLastSyncTime()
  );
  const [message, setMessage] = useState<string>('');

  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    
    try {
      const result = await googleSheetsService.syncData();
      
      if (result.success) {
        setLastSync(new Date().toISOString());
        setMessage(`✅ ${result.message} (${result.count}개 항목)`);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage('❌ 동기화 중 오류가 발생했습니다.');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '없음';
    return new Date(dateString).toLocaleString('ko-KR');
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">📊</div>
        <div>
          <h3 className="font-bold text-text-primary">구글 시트 동기화</h3>
          <p className="text-text-muted text-sm">커피 데이터를 구글 시트에서 가져옵니다</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-sm text-text-muted mb-1">마지막 동기화</p>
          <p className="font-medium text-text-primary">
            {formatDate(lastSync)}
          </p>
        </div>

        {message && (
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-sm text-text-primary">{message}</p>
          </div>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          className={`w-full py-3 rounded-xl font-medium transition-colors ${
            syncing
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-badge-bg text-badge-text hover:bg-badge-bg/80'
          }`}
        >
          {syncing ? '동기화 중...' : '지금 동기화'}
        </button>
      </div>
    </div>
  );
} 