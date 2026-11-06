import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      // Fallback: demo login if backend is down
      if (!err.response) {
        const demoUser = { id: 'demo', name: email.split('@')[0] || 'Scholar', email, role: 'student' };
        localStorage.setItem('accessToken', 'demo_token');
        localStorage.setItem('refreshToken', 'demo_refresh');
        localStorage.setItem('user', JSON.stringify(demoUser));
        set({ user: demoUser, accessToken: 'demo_token', isAuthenticated: true, loading: false });
        return { success: true, demo: true };
      }
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { user, accessToken, refreshToken } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, accessToken, isAuthenticated: true, loading: false });
      return { success: true };
    } catch (err) {
      // Fallback: demo register if backend is down
      if (!err.response) {
        const demoUser = { id: 'demo', name, email, role: role || 'student' };
        localStorage.setItem('accessToken', 'demo_token');
        localStorage.setItem('refreshToken', 'demo_refresh');
        localStorage.setItem('user', JSON.stringify(demoUser));
        set({ user: demoUser, accessToken: 'demo_token', isAuthenticated: true, loading: false });
        return { success: true, demo: true };
      }
      set({ loading: false });
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  updateUser: (userData) => {
    const merged = { ...get().user, ...userData };
    localStorage.setItem('user', JSON.stringify(merged));
    set({ user: merged });
  },
}));

export default useAuthStore;
