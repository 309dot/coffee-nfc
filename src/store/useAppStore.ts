import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // User preferences
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  
  // Cart functionality
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // NFC functionality
  nfcSupported: boolean;
  checkNFCSupport: () => void;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeTab: 'coffee',
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // User preferences
      favorites: [],
      addToFavorites: (id) => 
        set((state) => ({ 
          favorites: [...state.favorites, id] 
        })),
      removeFromFavorites: (id) => 
        set((state) => ({ 
          favorites: state.favorites.filter(fav => fav !== id) 
        })),
      
      // Cart functionality
      cart: [],
      addToCart: (item) => 
        set((state) => {
          const existingItem = state.cart.find(cartItem => cartItem.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map(cartItem =>
                cartItem.id === item.id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              )
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (id) => 
        set((state) => ({ 
          cart: state.cart.filter(item => item.id !== id) 
        })),
      clearCart: () => set({ cart: [] }),
      
      // NFC functionality
      nfcSupported: false,
      checkNFCSupport: () => {
        const supported = 'NDEFReader' in window;
        set({ nfcSupported: supported });
      },
    }),
    {
      name: 'coffee-app-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        cart: state.cart,
      }),
    }
  )
); 