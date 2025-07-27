import { create } from 'zustand';

interface UIState {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Modal states
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;
  modalTitle: string;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  openModal: (content: React.ReactNode, title?: string) => void;
  closeModal: () => void;
  addToast: (toast: Omit<UIState['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isLoading: false,
  loadingMessage: '',
  isModalOpen: false,
  modalContent: null,
  modalTitle: '',
  toasts: [],
  isMobileMenuOpen: false,

  // Actions
  setLoading: (loading: boolean, message = '') => {
    set({ isLoading: loading, loadingMessage: message });
  },

  openModal: (content: React.ReactNode, title = '') => {
    set({ 
      isModalOpen: true, 
      modalContent: content, 
      modalTitle: title 
    });
  },

  closeModal: () => {
    set({ 
      isModalOpen: false, 
      modalContent: null, 
      modalTitle: '' 
    });
  },

  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = { 
      ...toast, 
      id,
      duration: toast.duration || 5000 
    };
    
    set(state => ({ 
      toasts: [...state.toasts, newToast] 
    }));

    // Auto remove toast after duration
    setTimeout(() => {
      get().removeToast(id);
    }, newToast.duration);
  },

  removeToast: (id: string) => {
    set(state => ({ 
      toasts: state.toasts.filter(toast => toast.id !== id) 
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  toggleMobileMenu: () => {
    set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },
})); 