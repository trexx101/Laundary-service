import customer from 'app/entities/customer/customer.reducer';
import booking from 'app/entities/booking/booking.reducer';
import payment from 'app/entities/payment/payment.reducer';
import coordinate from 'app/entities/coordinate/coordinate.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  customer,
  booking,
  payment,
  coordinate,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
