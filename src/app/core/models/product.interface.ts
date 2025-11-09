export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt?: string;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image: string;
}
