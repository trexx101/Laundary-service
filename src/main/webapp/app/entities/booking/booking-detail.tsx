import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './booking.reducer';

export const BookingDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const bookingEntity = useAppSelector(state => state.booking.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bookingDetailsHeading">Booking</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{bookingEntity.id}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{bookingEntity.description}</dd>
          <dt>
            <span id="pickDate">Pick Date</span>
          </dt>
          <dd>
            {bookingEntity.pickDate ? <TextFormat value={bookingEntity.pickDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="returnDate">Return Date</span>
          </dt>
          <dd>
            {bookingEntity.returnDate ? <TextFormat value={bookingEntity.returnDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="loadSize">Load Size</span>
          </dt>
          <dd>{bookingEntity.loadSize}</dd>
          <dt>
            <span id="serviceType">Service Type</span>
          </dt>
          <dd>{bookingEntity.serviceType}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {bookingEntity.image ? (
              <div>
                {bookingEntity.imageContentType ? (
                  <a onClick={openFile(bookingEntity.imageContentType, bookingEntity.image)}>
                    <img src={`data:${bookingEntity.imageContentType};base64,${bookingEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {bookingEntity.imageContentType}, {byteSize(bookingEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{bookingEntity.status}</dd>
          <dt>
            <span id="created">Created</span>
          </dt>
          <dd>{bookingEntity.created ? <TextFormat value={bookingEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>Payment</dt>
          <dd>{bookingEntity.payment ? bookingEntity.payment.id : ''}</dd>
          <dt>Customer</dt>
          <dd>{bookingEntity.customer ? bookingEntity.customer.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/booking" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/booking/${bookingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default BookingDetail;
