import { Status } from './status.model';

export interface Category {
  id: string;
  name: string;
  description: string;
  status: Status;
}
