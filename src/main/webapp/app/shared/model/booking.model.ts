import dayjs from 'dayjs';
import { IPayment } from 'app/shared/model/payment.model';
import { ICustomer } from 'app/shared/model/customer.model';
import { LoadSize } from 'app/shared/model/enumerations/load-size.model';
import { ServiceType } from 'app/shared/model/enumerations/service-type.model';

export interface IBooking {
  id?: number;
  description?: string | null;
  pickDate?: string;
  returnDate?: string;
  loadSize?: LoadSize;
  serviceType?: ServiceType | null;
  imageContentType?: string | null;
  image?: string | null;
  status?: string | null;
  created?: string | null;
  payment?: IPayment | null;
  customer?: ICustomer;
}

export const defaultValue: Readonly<IBooking> = {};
