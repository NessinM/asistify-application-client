import { create } from 'zustand';
import { organizationTypes } from '@/types';

interface InterfaceState {
  organizations: organizationTypes.Entity[];
  organization: organizationTypes.Entity | null;
  setOrganizations: (list: organizationTypes.Entity[]) => Promise<void>;
}

export const useOrganizationStore = create<InterfaceState>((set) => ({
  organizations: [],
  organization: null,
  setOrganizations: async (list: organizationTypes.Entity[]) => {
    const select = list.length ? list[0] : null;
    set({ organizations: list, organization: select });
  },
}));
