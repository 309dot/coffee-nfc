import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AppState {
  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // NFC State
  isNFCSupported: boolean;
  checkNFCSupport: () => void;
  
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Favorites State
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI State
  activeTab: 'coffee',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  
  // NFC State
  isNFCSupported: false,
  checkNFCSupport: () => {
    const isSupported = 'NDEFReader' in window;
    set({ isNFCSupported: isSupported });
  },
  
  // Cart State
  cart: [],
  addToCart: (item: CartItem) => {
    const { cart } = get();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      set({
        cart: cart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      });
    } else {
      set({ cart: [...cart, item] });
    }
  },
  removeFromCart: (id: string) => {
    const { cart } = get();
    set({ cart: cart.filter(item => item.id !== id) });
  },
  clearCart: () => set({ cart: [] }),
  
  // Favorites State
  favorites: [],
  addToFavorites: (id: string) => {
    const { favorites } = get();
    if (!favorites.includes(id)) {
      set({ favorites: [...favorites, id] });
    }
  },
  removeFromFavorites: (id: string) => {
    const { favorites } = get();
    set({ favorites: favorites.filter(favId => favId !== id) });
  },
})); 