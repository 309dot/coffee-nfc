import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';

interface NFCReaderProps {
  onNFCRead?: (data: string) => void;
  className?: string;
}

export function NFCReader({ onNFCRead, className }: NFCReaderProps) {
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { nfcSupported } = useAppStore();

  const startNFCReading = async () => {
    if (!nfcSupported) {
      setError('NFC가 지원되지 않는 기기입니다.');
      return;
    }

    try {
      setIsReading(true);
      setError(null);

      // Web NFC API 사용
      const ndef = new (window as any).NDEFReader();
      
      await ndef.scan();
      
      ndef.addEventListener('reading', ({ message }: any) => {
        const textDecoder = new TextDecoder();
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const data = textDecoder.decode(record.data);
            onNFCRead?.(data);
            setIsReading(false);
          }
        }
      });

      ndef.addEventListener('readingerror', () => {
        setError('NFC 읽기 중 오류가 발생했습니다.');
        setIsReading(false);
      });

    } catch (error) {
      console.error('NFC Error:', error);
      setError('NFC 읽기를 시작할 수 없습니다.');
      setIsReading(false);
    }
  };

  const stopNFCReading = () => {
    setIsReading(false);
  };

  if (!nfcSupported) {
    return (
      <div className={`bg-gray-100 rounded-2xl p-4 text-center ${className}`}>
        <p className="text-text-muted text-sm">
          이 기기는 NFC를 지원하지 않습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-cta-bg rounded-2xl p-4 text-center ${className}`}>
      <h3 className="font-bold text-text-primary mb-2">
        NFC 코스터 스캔
      </h3>
      
      {error && (
        <p className="text-red-600 text-sm mb-3">
          {error}
        </p>
      )}
      
      {isReading ? (
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
              📱
            </div>
          </div>
          <p className="text-text-primary text-sm">
            NFC 태그를 기기에 가까이 대세요...
          </p>
          <button
            onClick={stopNFCReading}
            className="bg-white text-text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center">
            📱
          </div>
          <p className="text-text-primary text-sm">
            커피 코스터의 NFC 태그를 스캔하여<br />
            상세 정보를 확인하세요
          </p>
          <button
            onClick={startNFCReading}
            className="bg-white text-text-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            스캔 시작
          </button>
        </div>
      )}
    </div>
  );
} 