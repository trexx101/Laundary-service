import { IUser } from 'app/shared/model/user.model';
import { IBooking } from 'app/shared/model/booking.model';
import { ICoordinate } from 'app/shared/model/coordinate.model';
import { Gender } from 'app/shared/model/enumerations/gender.model';

export interface ICustomer {
  id?: number;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  email?: string;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  country?: string | null;
  user?: IUser;
  bookings?: IBooking[] | null;
  location?: ICoordinate | null;
}

export const defaultValue: Readonly<ICustomer> = {};
