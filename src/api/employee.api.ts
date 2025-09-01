import { employeeTypes } from '@/types';
import http from '@api/init.api';
import { GetType, InsertPerson } from '@/types/employee.type';

const base = '/employee';

const fetchHandleGet = async (params: GetType) => {
  const { data } = await http.asistify.get<{
    data: employeeTypes.Entity[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  }>(base, {
    params,
  });

  return data;
};
const fetchHandleInsert = async (payload: InsertPerson) => {
  const { data } = await http.asistify.post<{
    _id: string;
  }>(base, payload);

  return data;
};

export default {
  fetchHandleGet,
  fetchHandleInsert,
};
