interface AnalyticsEvent {
  type: 'view' | 'click' | 'purchase';
  coffeeId: string;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  trackView(coffeeId: string) {
    this.events.push({
      type: 'view',
      coffeeId,
      timestamp: Date.now(),
    });
    console.log(`Analytics: Coffee ${coffeeId} viewed`);
  }

  trackClick(coffeeId: string) {
    this.events.push({
      type: 'click',
      coffeeId,
      timestamp: Date.now(),
    });
    console.log(`Analytics: Coffee ${coffeeId} clicked`);
  }

  trackPurchase(coffeeId: string) {
    this.events.push({
      type: 'purchase',
      coffeeId,
      timestamp: Date.now(),
    });
    console.log(`Analytics: Coffee ${coffeeId} purchased`);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

export const analyticsService = new AnalyticsService(); 