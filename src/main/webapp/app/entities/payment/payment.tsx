import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { openFile, byteSize, Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPayment } from 'app/shared/model/payment.model';
import { getEntities } from './payment.reducer';

export const Payment = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const paymentList = useAppSelector(state => state.payment.entities);
  const loading = useAppSelector(state => state.payment.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="payment-heading" data-cy="PaymentHeading">
        Payments
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/payment/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Payment
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {paymentList && paymentList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Image</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {paymentList.map((payment, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/payment/${payment.id}`} color="link" size="sm">
                      {payment.id}
                    </Button>
                  </td>
                  <td>{payment.type}</td>
                  <td>{payment.status}</td>
                  <td>{payment.updated ? <TextFormat type="date" value={payment.updated} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.reference}</td>
                  <td>
                    {payment.image ? (
                      <div>
                        {payment.imageContentType ? (
                          <a onClick={openFile(payment.imageContentType, payment.image)}>
                            <img src={`data:${payment.imageContentType};base64,${payment.image}`} style={{ maxHeight: '30px' }} />
                            &nbsp;
                          </a>
                        ) : null}
                        <span>
                          {payment.imageContentType}, {byteSize(payment.image)}
                        </span>
                      </div>
                    ) : null}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/payment/${payment.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/payment/${payment.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/payment/${payment.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Payments found</div>
        )}
      </div>
    </div>
  );
};

export default Payment;
