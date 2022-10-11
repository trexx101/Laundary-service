import dayjs from 'dayjs';
import { IBooking } from 'app/shared/model/booking.model';

export interface IPayment {
  id?: number;
  type?: string | null;
  status?: string;
  updated?: string | null;
  amount?: number | null;
  reference?: string | null;
  imageContentType?: string | null;
  image?: string | null;
  booking?: IBooking | null;
}

export const defaultValue: Readonly<IPayment> = {};
