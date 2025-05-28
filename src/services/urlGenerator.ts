interface URLData {
  id: string;
  slug: string;
  name: string;
  origin: string;
  url: string;
  qrCode?: string;
  createdAt: string;
  clicks: number;
}

class URLGeneratorService {
  private readonly BASE_URL = window.location.origin;

  generateURL(coffee: { id: string; name: string; origin: string; slug?: string }): URLData {
    const slug = coffee.slug || this.generateSlug(coffee.name, coffee.origin);
    const url = `${this.BASE_URL}?coffee=${coffee.id}`;
    
    return {
      id: coffee.id,
      slug,
      name: coffee.name,
      origin: coffee.origin,
      url,
      createdAt: new Date().toISOString(),
      clicks: 0
    };
  }

  private generateSlug(name: string, origin: string): string {
    const base = `${name}-${origin}`
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const hash = this.generateHash(base).substring(0, 6);
    return `${base}-${hash}`;
  }

  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  generateQRCode(url: string): string {
    // QR 코드 생성 (실제로는 QR 라이브러리 사용)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }

  saveURL(urlData: URLData): void {
    const existingURLs = this.getAllURLs();
    const updatedURLs = existingURLs.filter(u => u.id !== urlData.id);
    updatedURLs.push(urlData);
    localStorage.setItem('coffee-urls', JSON.stringify(updatedURLs));
  }

  getAllURLs(): URLData[] {
    const stored = localStorage.getItem('coffee-urls');
    return stored ? JSON.parse(stored) : [];
  }

  getURLById(id: string): URLData | null {
    const urls = this.getAllURLs();
    return urls.find(u => u.id === id) || null;
  }

  incrementClick(id: string): void {
    const urls = this.getAllURLs();
    const urlIndex = urls.findIndex(u => u.id === id);
    if (urlIndex !== -1) {
      urls[urlIndex].clicks += 1;
      localStorage.setItem('coffee-urls', JSON.stringify(urls));
    }
  }

  deleteURL(id: string): void {
    const urls = this.getAllURLs();
    const filteredURLs = urls.filter(u => u.id !== id);
    localStorage.setItem('coffee-urls', JSON.stringify(filteredURLs));
  }
}

export const urlGeneratorService = new URLGeneratorService();
export type { URLData }; 