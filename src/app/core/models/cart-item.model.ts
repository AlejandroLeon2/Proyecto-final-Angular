import { Product } from './product.model';
type cartexclude =Omit<Product,'description'|'status'>

export interface CartItem extends cartexclude {
  quantity: number;
}
