import { create } from 'zustand';
import { BASE_URL } from '~/constants/api';
import type { NavItem } from '~/constants/navigation';

export type NavbarState =
  | { type: 'closed' }
  | { type: 'expanded' }
  | { type: 'hovered'; navItem: NavItem };

export type Role = 'ROLE_STAFF' | 'ROLE_RESERVATION' | 'ROLE_COUNCIL';

interface Store {
  role?: Role;
  navbarState: NavbarState;
  // Navbar actions
  expandNavbar: () => void;
  closeNavbar: () => void;
  hoverNavItem: (navItem: NavItem) => void;
  // Session actions
  login: () => void;
  logout: () => Promise<void>;
  mockLogin: (role: Role) => Promise<void>;
  mockLogout: () => Promise<void>;
}

export const useStore = create<Store>()((set) => ({
  role: undefined,
  navbarState: { type: 'closed' },
  expandNavbar: () => set({ navbarState: { type: 'expanded' } }),
  closeNavbar: () => set({ navbarState: { type: 'closed' } }),
  hoverNavItem: (navItem: NavItem) =>
    set({ navbarState: { type: 'hovered', navItem } }),
  login: () => {
    window.location.href = `${BASE_URL}/v1/login`;
  },
  logout: async () => {
    await fetch(`${BASE_URL}/v1/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    window.location.reload();
  },
  mockLogin: async (role: Role) => {
    const response = await fetch(`${BASE_URL}/v2/mock-login?role=${role}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (response.ok) set({ role });
  },
  mockLogout: async () => {
    await fetch(`${BASE_URL}/v1/logout`, {
      method: 'GET',
      credentials: 'include',
    }).catch(() => {
      // CORS 에러 무시 (리다이렉트로 인한 에러)
    });

    // TODO: 추후 수정
    window.location.reload();
  },
}));
