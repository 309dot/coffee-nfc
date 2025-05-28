import { useState } from 'react';
import { MenuIcon, CoffeeIcon } from '../components/icons';
import { GoogleSheetsSync } from '../components/admin/GoogleSheetsSync';
import { URLManager } from '../components/admin/URLManager';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { BeansManagement } from '../components/admin/BeansManagement';

interface StatsCard {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
  textColor: string;
}

interface MenuOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function Menu() {
  const [userName] = useState('Daniel');
  const [activeTab, setActiveTab] = useState<'menu' | 'admin'>('menu');

  const statsCards: StatsCard[] = [
    {
      id: '1',
      title: 'Current task',
      value: 'You have 3 tasks for today',
      subtitle: '2 completed',
      color: 'bg-green-200',
      textColor: 'text-green-900'
    },
    {
      id: '2',
      title: 'Statistics',
      value: 'Hello 👋 Daniel',
      subtitle: 'Your overall score is above average',
      color: 'bg-orange-200',
      textColor: 'text-orange-900'
    },
    {
      id: '3',
      title: 'Your progress',
      value: '78%',
      subtitle: 'You are doing well! 😊',
      color: 'bg-blue-200',
      textColor: 'text-blue-900'
    }
  ];

  const menuOptions: MenuOption[] = [
    {
      id: '1',
      title: '주문 내역',
      description: '지난 주문들을 확인하세요',
      icon: '📋'
    },
    {
      id: '2',
      title: '즐겨찾기',
      description: '자주 주문하는 메뉴',
      icon: '⭐'
    },
    {
      id: '3',
      title: '포인트',
      description: '적립된 포인트 확인',
      icon: '🎁'
    },
    {
      id: '4',
      title: '설정',
      description: '앱 설정 및 알림',
      icon: '⚙️'
    },
    {
      id: '5',
      title: '고객센터',
      description: '문의사항 및 도움말',
      icon: '💬'
    },
    {
      id: '6',
      title: '이벤트',
      description: '진행 중인 이벤트',
      icon: '🎉'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <section className="bg-white px-6 pt-6 pb-4 rounded-b-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <MenuIcon size={24} className="text-badge-text" />
          <h1 className="text-2xl font-bold text-text-primary">
            마이페이지
          </h1>
        </div>
        <p className="text-text-muted text-sm">
          안녕하세요, {userName}님! 오늘도 좋은 하루 되세요 ☕
        </p>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'menu'
                ? 'bg-badge-bg text-badge-text'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            일반 메뉴
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'admin'
                ? 'bg-badge-bg text-badge-text'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            NFC 관리
          </button>
        </div>
      </section>

      {activeTab === 'menu' ? (
        <>
          {/* Stats Cards */}
          <section className="px-6 py-4">
            <h2 className="text-lg font-bold text-text-primary mb-3">오늘의 현황</h2>
            <div className="space-y-3">
              {statsCards.map((card) => (
                <div
                  key={card.id}
                  className={`${card.color} rounded-2xl p-4 ${card.textColor}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-xs font-medium opacity-70 mb-1">
                        {card.title}
                      </p>
                      <h3 className="text-base font-bold mb-1">
                        {card.value}
                      </h3>
                      {card.subtitle && (
                        <p className="text-xs opacity-70">
                          {card.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <CoffeeIcon size={16} className="opacity-70" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Menu Options */}
          <section className="px-6 flex-1">
            <h2 className="text-lg font-bold text-text-primary mb-3">메뉴</h2>
            <div className="grid grid-cols-2 gap-3">
              {menuOptions.map((option) => (
                <div
                  key={option.id}
                  className="bg-white rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer border border-gray-100"
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="text-2xl mb-1">
                      {option.icon}
                    </div>
                    <h3 className="font-bold text-text-primary text-sm">
                      {option.title}
                    </h3>
                    <p className="text-text-muted text-xs leading-tight">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* NFC 관리 섹션 */
        <section className="px-6 py-4 flex-1">
          <h2 className="text-lg font-bold text-text-primary mb-4">NFC 커피 관리</h2>
          <div className="space-y-4">
            {/* 구글 시트 동기화 */}
            <GoogleSheetsSync />
            
            {/* 원두 관리 */}
            <BeansManagement />
            
            {/* URL 관리 */}
            <URLManager />
            
            {/* 분석 대시보드 */}
            <AnalyticsDashboard />
          </div>
        </section>
      )}

      {/* Bottom Spacing */}
      <div className="h-6"></div>
    </div>
  );
} 