import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBooking } from 'app/shared/model/booking.model';
import { getEntities } from './booking.reducer';

export const Booking = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const bookingList = useAppSelector(state => state.booking.entities);
  const loading = useAppSelector(state => state.booking.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="booking-heading" data-cy="BookingHeading">
        Bookings
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/booking/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Booking
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {bookingList && bookingList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Pick Date</th>
                <th>Return Date</th>
                <th>Load Size</th>
                <th>Service Type</th>
                <th>Image</th>
                <th>Status</th>
                <th>Created</th>
                <th>Payment</th>
                <th>Customer</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookingList.map((booking, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/booking/${booking.id}`} color="link" size="sm">
                      {booking.id}
                    </Button>
                  </td>
                  <td>{booking.description}</td>
                  <td>{booking.pickDate ? <TextFormat type="date" value={booking.pickDate} format={APP_LOCAL_DATE_FORMAT} /> : null}</td>
                  <td>
                    {booking.returnDate ? <TextFormat type="date" value={booking.returnDate} format={APP_LOCAL_DATE_FORMAT} /> : null}
                  </td>
                  <td>{booking.loadSize}</td>
                  <td>{booking.serviceType}</td>
                  <td>
                    {booking.image ? (
                      <div>
                        {booking.imageContentType ? (
                          <a onClick={openFile(booking.imageContentType, booking.image)}>
                            <img src={`data:${booking.imageContentType};base64,${booking.image}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {booking.imageContentType}, {byteSize(booking.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td>{booking.status}</td>
                  <td>{booking.created ? <TextFormat type="date" value={booking.created} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{booking.payment ? <Link to={`/payment/${booking.payment.id}`}>{booking.payment.id}</Link> : ''}</td>
                  <td>{booking.customer ? <Link to={`/customer/${booking.customer.id}`}>{booking.customer.login}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/booking/${booking.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/booking/${booking.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/booking/${booking.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Bookings found</div>
        )}
      </div>
    </div>
  );
};

export default Booking;
