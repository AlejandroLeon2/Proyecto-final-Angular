export const STATUS = {
  active: 'active',
  inactive: 'inactive',
  deleted: 'deleted',
} as const;
export type Status = (typeof STATUS)[keyof typeof STATUS];
