export const ROLE = {
  admin: 'admin',
  usuario: 'usuario',
  unknown: 'unknown',
} as const;
export type Role = (typeof ROLE)[keyof typeof ROLE];
