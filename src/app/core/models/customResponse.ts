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