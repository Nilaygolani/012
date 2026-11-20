import { create } from 'zustand';
import { eventBus, EVENTS } from '../eventBus/bus';
import { API_BASE_URL } from '../../config/api';

const API_BASE = `${API_BASE_URL}/api`;

export const useAuthStore = create((set, get) => {
  const savedToken = localStorage.getItem('nailmores_token');
  const savedUser = localStorage.getItem('nailmores_user');

  return {
    token: savedToken || null,
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null,
    pendingAction: null,

    setPendingAction: (action) => set({ pendingAction: action }),

    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Invalid credentials.');

        localStorage.setItem('nailmores_token', data.token);
        localStorage.setItem('nailmores_user', JSON.stringify(data.user));

        set({ token: data.token, user: data.user, loading: false });
        eventBus.emit(EVENTS.CLOSE_AUTH_MODAL);

        // Smart Role-Based Navigation:
        if (data.user.role === 'admin') {
          // If Admin logs in -> Automatically launch Admin Panel!
          eventBus.emit(EVENTS.OPEN_ADMIN_PANEL);
        } else {
          // Regular Customer -> If was buying, open Cart; else open User Profile & Order Tracking!
          const { pendingAction } = get();
          if (pendingAction === 'checkout') {
            eventBus.emit(EVENTS.OPEN_CART);
            set({ pendingAction: null });
          } else {
            eventBus.emit(EVENTS.OPEN_USER_ACCOUNT);
          }
        }

        return { success: true, user: data.user };
      } catch (err) {
        set({ loading: false, error: err.message });
        return { success: false, error: err.message };
      }
    },

    register: async (formData) => {
      set({ loading: true, error: null });
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        localStorage.setItem('nailmores_token', data.token);
        localStorage.setItem('nailmores_user', JSON.stringify(data.user));

        set({ token: data.token, user: data.user, loading: false });
        eventBus.emit(EVENTS.CLOSE_AUTH_MODAL);

        const { pendingAction } = get();
        if (pendingAction === 'checkout') {
          eventBus.emit(EVENTS.OPEN_CART);
          set({ pendingAction: null });
        } else {
          eventBus.emit(EVENTS.OPEN_USER_ACCOUNT);
        }

        return { success: true, user: data.user };
      } catch (err) {
        set({ loading: false, error: err.message });
        return { success: false, error: err.message };
      }
    },

    logout: () => {
      localStorage.removeItem('nailmores_token');
      localStorage.removeItem('nailmores_user');
      set({ token: null, user: null, pendingAction: null });
      eventBus.emit(EVENTS.CLOSE_ADMIN_PANEL);
      eventBus.emit(EVENTS.CLOSE_USER_ACCOUNT);
    },

    updateProfile: async (updates) => {
      const { token } = get();
      if (!token) return { success: false, error: 'Not authenticated' };

      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');

        localStorage.setItem('nailmores_user', JSON.stringify(data.user));
        set({ user: data.user });
        return { success: true, user: data.user };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }
  };
});
