import { create } from 'zustand';
import http from '@api/init.api';
import { userTypes } from '@/types';
import cookies from 'js-cookie';
import { Entity } from '@/types/organization.type';

interface AuthState {
  isAuthenticated: boolean;
  user: userTypes.entity | null;
  isLoading: boolean;
  getMe: () => Promise<{
    user: userTypes.entity;
    organizations: Entity[];
  } | void>;
  fetchHandleSignIn: (
    payload: userTypes.SignInInput
  ) => Promise<{ user: userTypes.entity; organizations: Entity[] }>;
  fetchHandleSignUp: (payload: userTypes.SignUpInput) => Promise<{ user: userTypes.entity }>;
  fetchHandleLogOut: () => Promise<void>;
  fetchHandleSaveInitialConfiguration: (
    payload: userTypes.SaveInitialConfigurationInput
  ) => Promise<void>;
  fetchHandleVerifyOTPCode: (_id: string, code: string) => Promise<void>;
}

export const useUserStore = create<AuthState>((set) => ({
  isAuthenticated: !!cookies.get('_asistify_gsid'),
  user: null,
  isLoading: false,

  getMe: async () => {
    const userId = cookies.get('_asistify_gsid');
    if (!userId) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    try {
      set({ isLoading: true });
      const { data } = await http.asistify.get<{
        user: userTypes.entity;
        organizations: Entity[];
      }>('/user/me');
      set({ isAuthenticated: true, user: data.user });
      return data;
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      set({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHandleSignIn: async (payload) => {
    set({ isLoading: true });

    try {
      const { data } = await http.asistify.post<{
        user: userTypes.entity;
        organizations: Entity[];
      }>('/user/sign_in', payload);
      set({
        isAuthenticated: !!data.user.otp_code_to_validate_email,
        user: data.user,
      });

      return data;
    } catch (error) {
      console.error('Error en SignIn:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHandleSignUp: async (payload) => {
    set({ isLoading: true });

    try {
      const { data } = await http.asistify.post('/user/sign_up', payload);
      return data;
    } catch (error) {
      console.error('Error en SignUp:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHandleVerifyOTPCode: async (_id, code) => {
    set({ isLoading: true });

    try {
      const { data } = await http.asistify.get<{ user: userTypes.entity }>(
        `/user/verify_otp_account/${code}`,
        { params: { _id } }
      );
      set({ isAuthenticated: true, user: data.user });
    } catch (error) {
      console.error('Error en verificación de código:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHandleSaveInitialConfiguration: async (payload) => {
    set({ isLoading: true });

    try {
      const { data } = await http.asistify.post('/user/save_initial_configuration', payload);
      set({ isAuthenticated: true, user: data.user });
      return data;
    } catch (error) {
      console.error('Error al guardar configuración inicial:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHandleLogOut: async () => {
    set({ isLoading: true });

    try {
      const { data } = await http.asistify.get('/user/log_out');
      localStorage.clear();
      localStorage.setItem('_asistify_theme_primary_color', 'oklch(0 0 0)');
      localStorage.setItem('_asistify_theme', 'light');
      set({ isAuthenticated: false, user: null });
      return data;
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
