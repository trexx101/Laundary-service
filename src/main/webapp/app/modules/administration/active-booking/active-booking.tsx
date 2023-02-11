import React, { useState, useEffect } from 'react';
import { Table, Input, Row, Col, Badge, Button } from 'reactstrap';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteEntity, getAdminEntities, getEntities, progressEntityStatus } from 'app/entities/booking/booking.reducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextFormat } from 'react-jhipster';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export const ActiveBookingPage = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const bookingList = useAppSelector(state => state.booking.entities);
  const loading = useAppSelector(state => state.booking.loading);
  const updating = useAppSelector(state => state.booking.updating);

  useEffect(() => {
    dispatch(getAdminEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getAdminEntities({}));
  };

  function confirmProgress(id: number) {
    dispatch(progressEntityStatus(id));
  }

  return (
    <div>
      <h2 id="booking-heading" data-cy="BookingHeading">
        Manage all active bookings
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
                <th>Status</th>
                <th>Created</th>
                <th>Payment</th>
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
                    <div className="btn-group flex-btn-group-container">
                      {booking.status}
                      <Button
                        /*to={`/booking/progress/${booking.id}`}*/ onClick={() => dispatch(progressEntityStatus(booking.id))}
                        color="info"
                        size="sm"
                        disabled={updating}
                      >
                        <FontAwesomeIcon icon="clipboard-list-check" /> <span className="d-none d-md-inline">Next stage</span>
                      </Button>
                    </div>
                  </td>
                  <td>{booking.created ? <TextFormat type="date" value={booking.created} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    {booking.payment ? (
                      <Link to={`/payment/${booking.payment.id}`}>{booking.payment.id}</Link>
                    ) : (
                      <Link to={`/payment/new`}>Make Payment</Link>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/booking/${booking.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
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

export default ActiveBookingPage;
