import { create } from 'zustand';
import http from '@api/init.api';
import { organizationTypes } from '@/types';
import { AxiosResponse } from 'axios';
import cookies from 'js-cookie';

interface InterfaceState {
  organizations: organizationTypes.Entity[];
  get: () => Promise<
    AxiosResponse<
      {
        organizations: organizationTypes.Entity[];
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >
  >;
}

export const useOrganizationMemberStore = create<InterfaceState>(() => ({
  organizations: [],
  get: async () => {
    const _id_user = cookies.get('_asistify_gsid');
    return await http.asistify.get<{
      organizations: organizationTypes.Entity[];
    }>('/organization_member', { params: { _id_user } });
  },
}));
