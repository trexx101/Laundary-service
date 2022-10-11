import { ICustomer } from 'app/shared/model/customer.model';

export interface ICoordinate {
  id?: number;
  longitude?: number;
  latitude?: number;
  verified?: boolean | null;
  customer?: ICustomer | null;
}

export const defaultValue: Readonly<ICoordinate> = {
  verified: false,
};
