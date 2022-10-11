import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { openFile, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './payment.reducer';

export const PaymentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const paymentEntity = useAppSelector(state => state.payment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="paymentDetailsHeading">Payment</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{paymentEntity.id}</dd>
          <dt>
            <span id="type">Type</span>
          </dt>
          <dd>{paymentEntity.type}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{paymentEntity.status}</dd>
          <dt>
            <span id="updated">Updated</span>
          </dt>
          <dd>{paymentEntity.updated ? <TextFormat value={paymentEntity.updated} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="amount">Amount</span>
          </dt>
          <dd>{paymentEntity.amount}</dd>
          <dt>
            <span id="reference">Reference</span>
          </dt>
          <dd>{paymentEntity.reference}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {paymentEntity.image ? (
              <div>
                {paymentEntity.imageContentType ? (
                  <a onClick={openFile(paymentEntity.imageContentType, paymentEntity.image)}>
                    <img src={`data:${paymentEntity.imageContentType};base64,${paymentEntity.image}`} style={{ maxHeight: '30px' }} />
                  </a>
                ) : null}
                <span>
                  {paymentEntity.imageContentType}, {byteSize(paymentEntity.image)}
                </span>
              </div>
            ) : null}
          </dd>
        </dl>
        <Button tag={Link} to="/payment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/payment/${paymentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default PaymentDetail;
