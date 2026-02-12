type AppConfigType = {
  name: string;
  github: {
    title: string;
    url: string;
  };
  author: {
    name: string;
    url: string;
  };
};

export const appConfig: AppConfigType = {
  name: import.meta.env.VITE_APP_NAME ?? 'TaskFlow',
  github: {
    title: 'AI Task Manager',
    url: 'https://github.com/xmarkurion/TUS2026-MASTERS',
  },
  author: {
    name: 'A00300334_A00316053_A00325738_A00279813',
    url: 'https://github.com/xmarkurion/TUS2026-MASTERS',
  },
};

export const baseUrl = import.meta.env.VITE_BASE_URL ?? '';
