import { create } from 'zustand';
import http from '@api/init.api';
import { employeeTypes } from '@/types';
interface InterfaceState {
  fetchHandleGetEmployees: (payload: employeeTypes.InsertPerson) => Promise<{
    data: employeeTypes.Entity[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  }>;
}

export const useEmployeeStore = create<InterfaceState>(() => ({
  fetchHandleGetEmployees: async (payload: employeeTypes.InsertPerson) => {
    const { data } = await http.asistify.get<{
      data: employeeTypes.Entity[];
      page: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    }>('/employee', {
      params: payload,
    });

    return data;
  },
}));
