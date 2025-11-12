export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt: string; // timestamp ISO
  updatedAt?: string; // timestamp ISO (opcional)
  stock: number;
  category: string;
  status: 'active' | 'inactive';
  image: string;
}
