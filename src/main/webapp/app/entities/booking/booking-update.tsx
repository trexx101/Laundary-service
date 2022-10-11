import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPayment } from 'app/shared/model/payment.model';
import { getEntities as getPayments } from 'app/entities/payment/payment.reducer';
import { ICustomer } from 'app/shared/model/customer.model';
import { getEntities as getCustomers } from 'app/entities/customer/customer.reducer';
import { IBooking } from 'app/shared/model/booking.model';
import { LoadSize } from 'app/shared/model/enumerations/load-size.model';
import { ServiceType } from 'app/shared/model/enumerations/service-type.model';
import { getEntity, updateEntity, createEntity, reset } from './booking.reducer';

export const BookingUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const payments = useAppSelector(state => state.payment.entities);
  const customers = useAppSelector(state => state.customer.entities);
  const bookingEntity = useAppSelector(state => state.booking.entity);
  const loading = useAppSelector(state => state.booking.loading);
  const updating = useAppSelector(state => state.booking.updating);
  const updateSuccess = useAppSelector(state => state.booking.updateSuccess);
  const loadSizeValues = Object.keys(LoadSize);
  const serviceTypeValues = Object.keys(ServiceType);

  const handleClose = () => {
    navigate('/booking');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getPayments({}));
    dispatch(getCustomers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.created = convertDateTimeToServer(values.created);

    const entity = {
      ...bookingEntity,
      ...values,
      payment: payments.find(it => it.id.toString() === values.payment.toString()),
      customer: customers.find(it => it.id.toString() === values.customer.toString()),
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
          created: displayDefaultDateTime(),
        }
      : {
          loadSize: 'S',
          serviceType: 'WASH_ONLY',
          ...bookingEntity,
          created: convertDateTimeFromServer(bookingEntity.created),
          payment: bookingEntity?.payment?.id,
          customer: bookingEntity?.customer?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="washman2App.booking.home.createOrEditLabel" data-cy="BookingCreateUpdateHeading">
            Create or edit a Booking
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="booking-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Description" id="booking-description" name="description" data-cy="description" type="textarea" />
              <ValidatedField
                label="Pick Date"
                id="booking-pickDate"
                name="pickDate"
                data-cy="pickDate"
                type="date"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Return Date"
                id="booking-returnDate"
                name="returnDate"
                data-cy="returnDate"
                type="date"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Load Size" id="booking-loadSize" name="loadSize" data-cy="loadSize" type="select">
                {loadSizeValues.map(loadSize => (
                  <option value={loadSize} key={loadSize}>
                    {loadSize}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField label="Service Type" id="booking-serviceType" name="serviceType" data-cy="serviceType" type="select">
                {serviceTypeValues.map(serviceType => (
                  <option value={serviceType} key={serviceType}>
                    {serviceType}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedBlobField label="Image" id="booking-image" name="image" data-cy="image" isImage accept="image/*" />
              <ValidatedField label="Status" id="booking-status" name="status" data-cy="status" type="text" />
              <ValidatedField
                label="Created"
                id="booking-created"
                name="created"
                data-cy="created"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField id="booking-payment" name="payment" data-cy="payment" label="Payment" type="select">
                <option value="" key="0" />
                {payments
                  ? payments.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="booking-customer" name="customer" data-cy="customer" label="Customer" type="select" required>
                <option value="" key="0" />
                {customers
                  ? customers.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>This field is required.</FormText>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/booking" replace color="info">
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

export default BookingUpdate;
