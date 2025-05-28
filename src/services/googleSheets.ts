interface CoffeeData {
  id: string;
  name: string;
  origin: string;
  slug: string;
  description: string;
  farmer: string;
  altitude: string;
  processingMethod: string;
  roastLevel: string;
  harvestDate: string;
  price: number;
  badges: string[];
  tastingNotes: string[];
  active: boolean;
  createdAt: string;
}

class GoogleSheetsService {
  private readonly SHEET_ID = '1EsBV8SM_90ZLPS0g4BLEhBm4nE';
  private readonly API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;

  async fetchCoffeeData(): Promise<CoffeeData[]> {
    try {
      if (!this.API_KEY) {
        console.warn('Google Sheets API key not found, using mock data');
        return this.getMockData();
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/Sheet1!A:O?key=${this.API_KEY}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }

      const data = await response.json();
      return this.parseSheetData(data.values);
    } catch (error) {
      console.error('Error fetching from Google Sheets:', error);
      return this.getMockData();
    }
  }

  private parseSheetData(values: string[][]): CoffeeData[] {
    if (!values || values.length < 2) return [];

    const [, ...rows] = values;
    
    return rows.map((row, index) => ({
      id: row[0] || `coffee-${index + 1}`,
      name: row[1] || '',
      origin: row[2] || '',
      slug: this.generateSlug(row[1], row[2]),
      description: row[3] || '',
      farmer: row[4] || '',
      altitude: row[5] || '',
      processingMethod: row[6] || '',
      roastLevel: row[7] || '',
      harvestDate: row[8] || '',
      price: parseInt(row[9]) || 0,
      badges: row[10] ? row[10].split(',').map(b => b.trim()) : [],
      tastingNotes: row[11] ? row[11].split(',').map(n => n.trim()) : [],
      active: row[12] === 'TRUE',
      createdAt: row[13] || new Date().toISOString()
    }));
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

  private getMockData(): CoffeeData[] {
    return [
      {
        id: 'eth-001',
        name: 'Addisu Hulichaye',
        origin: 'Sidamo, Ethiopia',
        slug: 'addisu-hulichaye-ethiopia-abc123',
        description: '에티오피아 시다모 지역의 특별한 커피입니다.',
        farmer: 'Addisu Hulichaye',
        altitude: '1,800-2,000m',
        processingMethod: 'Natural',
        roastLevel: 'Medium',
        harvestDate: '2024년 1월',
        price: 25000,
        badges: ['Single Origin', 'Natural Process'],
        tastingNotes: ['Blueberry', 'Chocolate', 'Wine'],
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'col-001',
        name: 'Colombian Supremo',
        origin: 'Huila, Colombia',
        slug: 'colombian-supremo-huila-def456',
        description: '콜롬비아 우일라 지역의 프리미엄 커피입니다.',
        farmer: 'Carlos Rodriguez',
        altitude: '1,600-1,800m',
        processingMethod: 'Washed',
        roastLevel: 'Medium-Dark',
        harvestDate: '2024년 2월',
        price: 22000,
        badges: ['Fair Trade', 'Organic'],
        tastingNotes: ['Caramel', 'Nuts', 'Orange'],
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
  }

  async syncData(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      const data = await this.fetchCoffeeData();
      localStorage.setItem('coffee-data', JSON.stringify(data));
      localStorage.setItem('coffee-data-sync', new Date().toISOString());
      
      return {
        success: true,
        message: '데이터 동기화가 완료되었습니다.',
        count: data.length
      };
    } catch (error) {
      return {
        success: false,
        message: '동기화 중 오류가 발생했습니다.'
      };
    }
  }

  getLastSyncTime(): string | null {
    return localStorage.getItem('coffee-data-sync');
  }
}

export const googleSheetsService = new GoogleSheetsService();
export type { CoffeeData }; 