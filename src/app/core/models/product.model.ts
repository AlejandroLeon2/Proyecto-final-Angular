export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  createdAt?: number;
  updatedAt?: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image: string | File;
}
