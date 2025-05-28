interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  topCoffees: Array<{
    id: string;
    name: string;
    views: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

interface ViewEvent {
  coffeeId: string;
  timestamp: string;
  userAgent: string;
  sessionId: string;
}

class AnalyticsService {
  private readonly STORAGE_KEY = 'coffee-analytics';
  private readonly SESSION_KEY = 'coffee-session';

  trackView(coffeeId: string): void {
    const sessionId = this.getOrCreateSession();
    const event: ViewEvent = {
      coffeeId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId
    };

    const events = this.getEvents();
    events.push(event);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  }

  private getOrCreateSession(): string {
    let sessionId = sessionStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem(this.SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getEvents(): ViewEvent[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getAnalytics(): AnalyticsData {
    const events = this.getEvents();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 최근 30일 이벤트만 필터링
    const recentEvents = events.filter(event => 
      new Date(event.timestamp) >= thirtyDaysAgo
    );

    return {
      totalViews: recentEvents.length,
      uniqueVisitors: new Set(recentEvents.map(e => e.sessionId)).size,
      topCoffees: this.getTopCoffees(recentEvents),
      dailyStats: this.getDailyStats(recentEvents),
      deviceStats: this.getDeviceStats(recentEvents)
    };
  }

  private getTopCoffees(events: ViewEvent[]): Array<{ id: string; name: string; views: number }> {
    const coffeeViews = events.reduce((acc, event) => {
      acc[event.coffeeId] = (acc[event.coffeeId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(coffeeViews)
      .map(([id, views]) => ({
        id,
        name: this.getCoffeeName(id),
        views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  private getCoffeeName(coffeeId: string): string {
    // 실제로는 커피 데이터에서 이름을 가져와야 함
    const coffeeData = localStorage.getItem('coffee-data');
    if (coffeeData) {
      const coffees = JSON.parse(coffeeData);
      const coffee = coffees.find((c: any) => c.id === coffeeId);
      return coffee ? coffee.name : coffeeId;
    }
    return coffeeId;
  }

  private getDailyStats(events: ViewEvent[]): Array<{ date: string; views: number; visitors: number }> {
    const dailyData = events.reduce((acc, event) => {
      const date = event.timestamp.split('T')[0];
      if (!acc[date]) {
        acc[date] = { views: 0, visitors: new Set() };
      }
      acc[date].views += 1;
      acc[date].visitors.add(event.sessionId);
      return acc;
    }, {} as Record<string, { views: number; visitors: Set<string> }>);

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7); // 최근 7일
  }

  private getDeviceStats(events: ViewEvent[]): { mobile: number; desktop: number; tablet: number } {
    const deviceCounts = events.reduce((acc, event) => {
      const userAgent = event.userAgent.toLowerCase();
      if (userAgent.includes('mobile')) {
        acc.mobile += 1;
      } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
        acc.tablet += 1;
      } else {
        acc.desktop += 1;
      }
      return acc;
    }, { mobile: 0, desktop: 0, tablet: 0 });

    return deviceCounts;
  }

  clearAnalytics(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportAnalytics(): string {
    const analytics = this.getAnalytics();
    return JSON.stringify(analytics, null, 2);
  }
}

export const analyticsService = new AnalyticsService();
export type { AnalyticsData, ViewEvent }; 