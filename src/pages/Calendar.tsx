import { CalendarIcon } from '../components/icons';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'cupping' | 'workshop' | 'tasting';
  available: boolean;
}

export function Calendar() {
  const events: Event[] = [
    {
      id: '1',
      title: 'Ethiopian Coffee Cupping',
      date: '2024-01-15',
      time: '14:00',
      type: 'cupping',
      available: true,
    },
    {
      id: '2',
      title: 'Latte Art Workshop',
      date: '2024-01-18',
      time: '16:00',
      type: 'workshop',
      available: true,
    },
    {
      id: '3',
      title: 'Origin Tasting Session',
      date: '2024-01-22',
      time: '15:30',
      type: 'tasting',
      available: false,
    },
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cupping': return 'bg-blue-100 text-blue-600';
      case 'workshop': return 'bg-green-100 text-green-600';
      case 'tasting': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'cupping': return '커핑';
      case 'workshop': return '워크샵';
      case 'tasting': return '테이스팅';
      default: return '이벤트';
    }
  };

  return (
    <div className="bg-white rounded-b-2xl flex-1 flex flex-col">
      {/* Header */}
      <section className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <CalendarIcon size={24} className="text-badge-text" />
          <h1 className="text-2xl font-bold text-text-primary">
            Coffee Events
          </h1>
        </div>
        <p className="text-text-muted text-sm">
          다가오는 커피 이벤트를 확인하세요
        </p>
      </section>

      {/* Current Month */}
      <section className="px-6 mb-4">
        <div className="bg-comment-bg rounded-2xl p-4">
          <h2 className="font-bold text-text-primary text-lg mb-2">
            January 2024
          </h2>
          <p className="text-text-muted text-sm">
            이번 달 총 {events.length}개의 이벤트가 예정되어 있습니다.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="px-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-gray-50 rounded-2xl p-4 transition-colors ${
                event.available 
                  ? 'hover:bg-gray-100 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                      {getEventTypeLabel(event.type)}
                    </span>
                    {!event.available && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        마감
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-text-primary text-lg">
                    {event.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-text-muted">날짜</p>
                    <p className="font-medium text-text-primary">
                      {new Date(event.date).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">시간</p>
                    <p className="font-medium text-text-primary">
                      {event.time}
                    </p>
                  </div>
                </div>
                
                {event.available && (
                  <button className="bg-badge-bg text-badge-text px-4 py-2 rounded-full text-sm font-medium hover:bg-badge-bg/80 transition-colors">
                    예약하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 