import type { Status } from "./status.model";
export interface IResponseError {
  code: string;
  message: string;
}

export interface ICustomResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: IResponseError;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: {
    products: T[];
    moreItems: boolean
  };        
  errorCode?: string; 
  message: string;
}
export interface CartResponse {
  success: boolean;
  message: string;
  data: CartItemResponse[];
}

export interface CartItemResponse {
  productId: string;
  quantity: number;
  name: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: { _seconds: number; _nanoseconds: number };
    updatedAt: { _seconds: number; _nanoseconds: number };
    status: Status;
  };
  stock: number;
  price: number;
  image: string;
}
