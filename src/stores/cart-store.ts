import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ProductWithGame } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  addItem: (product: ProductWithGame) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      addItem: (product: ProductWithGame) => {
        const items = get().items;
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || '',
            gameId: product.gameId,
            gameName: product.game?.name || '',
            quantity: 1,
          };
          
          set(state => ({
            items: [...state.items, newItem],
          }));
        }

        // Recalculate totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total: newTotal, itemCount: newItemCount });
      },

      removeItem: (productId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== productId),
        }));

        // Recalculate totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total: newTotal, itemCount: newItemCount });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));

        // Recalculate totals
        const newItems = get().items;
        const newTotal = newItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const newItemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
        
        set({ total: newTotal, itemCount: newItemCount });
      },

      clearCart: () => {
        set({ 
          items: [], 
          total: 0, 
          itemCount: 0,
          isOpen: false 
        });
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }),
    }
  )
); 