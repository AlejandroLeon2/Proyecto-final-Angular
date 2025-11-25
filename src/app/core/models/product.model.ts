import { Category } from './category.model';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  createdAt?: number;
  updatedAt?: number;
  stock: number;
  category: { id: string } & Partial<Omit<Category, 'id'>>;
  status: 'active' | 'inactive';
  image: string | File;
}
