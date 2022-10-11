import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IBooking } from 'app/shared/model/booking.model';
import { getEntities as getBookings } from 'app/entities/booking/booking.reducer';
import { IPayment } from 'app/shared/model/payment.model';
import { getEntity, updateEntity, createEntity, reset } from './payment.reducer';

export const PaymentUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const bookings = useAppSelector(state => state.booking.entities);
  const paymentEntity = useAppSelector(state => state.payment.entity);
  const loading = useAppSelector(state => state.payment.loading);
  const updating = useAppSelector(state => state.payment.updating);
  const updateSuccess = useAppSelector(state => state.payment.updateSuccess);

  const handleClose = () => {
    navigate('/payment');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getBookings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.updated = convertDateTimeToServer(values.updated);

    const entity = {
      ...paymentEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          updated: displayDefaultDateTime(),
        }
      : {
          ...paymentEntity,
          updated: convertDateTimeFromServer(paymentEntity.updated),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="washman2App.payment.home.createOrEditLabel" data-cy="PaymentCreateUpdateHeading">
            Create or edit a Payment
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="payment-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Type" id="payment-type" name="type" data-cy="type" type="text" />
              <ValidatedField
                label="Status"
                id="payment-status"
                name="status"
                data-cy="status"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Updated"
                id="payment-updated"
                name="updated"
                data-cy="updated"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Amount" id="payment-amount" name="amount" data-cy="amount" type="text" />
              <ValidatedField label="Reference" id="payment-reference" name="reference" data-cy="reference" type="text" />
              <ValidatedBlobField label="Image" id="payment-image" name="image" data-cy="image" isImage accept="image/*" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/payment" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PaymentUpdate;
