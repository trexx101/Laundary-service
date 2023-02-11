import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonGroup, Row, Col, FormText, Label } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm, ValidatedBlobField } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IPayment } from 'app/shared/model/payment.model';
import { getEntities as getPayments } from 'app/entities/payment/payment.reducer';
import { ICustomer } from 'app/shared/model/customer.model';
import { getEntities as getCustomers, getEntityByUser } from 'app/entities/customer/customer.reducer';
import { getEntityByUser as getCustomerByUser } from 'app/entities/customer/customer.reducer';
import { IBooking } from 'app/shared/model/booking.model';
import { LoadSize } from 'app/shared/model/enumerations/load-size.model';
import { ServiceType } from 'app/shared/model/enumerations/service-type.model';
import { getEntity, updateEntity, createEntity, reset } from './booking.reducer';

export const BookingUpdate = () => {
  const [rSelected, setRSelected] = useState(null);
  const [rService, setService] = useState(null);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const payments = useAppSelector(state => state.payment.entities);
  const customers = useAppSelector(state => state.customer.entities);
  const customer = useAppSelector(state => state.customer.entity);
  const account = useAppSelector(state => state.authentication.account);
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
    setRSelected(bookingEntity.loadSize);

    dispatch(getPayments({}));
    dispatch(getCustomers({}));
    dispatch(getEntityByUser(account.id));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.created = convertDateTimeToServer(values.created);
    values.loadSize = rSelected;
    values.serviceType = rService;

    const entity = {
      ...bookingEntity,
      ...values,
      payment: payments.find(it => it.id.toString() === values.payment.toString()),
      customer: customer,
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
          customer: customer?.id,
        }
      : {
          loadSize: 'S',
          serviceType: 'WASH_ONLY',
          ...bookingEntity,
          created: convertDateTimeFromServer(bookingEntity.created),
          payment: bookingEntity?.payment?.id,
          customer: bookingEntity?.customer?.id,
        };

  function updateLoad(loadSizeUnit: string) {
    setRSelected(loadSizeUnit);
  }

  function updateServiceType(serviceType: string) {
    setService(serviceType);
  }

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
                label="Pickup Date"
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
              <Label>Load size </Label>
              <br />
              <ButtonGroup id="booking-loadSize" name="loadSize" data-cy="loadSize">
                {loadSizeValues.map(loadSizeUnit => (
                  <Button color="primary" outline onClick={() => updateLoad(loadSizeUnit)} active={rSelected === loadSizeUnit}>
                    {loadSizeUnit}
                  </Button>
                ))}
              </ButtonGroup>
              <br />
              <Label>Service type </Label>
              <br />
              <ButtonGroup id="booking-serviceType" name="serviceType" data-cy="serviceType">
                {serviceTypeValues.map(serviceType => (
                  <Button color="primary" outline onClick={() => updateServiceType(serviceType)} active={rService === serviceType}>
                    {serviceType}
                  </Button>
                ))}
              </ButtonGroup>
              <ValidatedBlobField label="Image" id="booking-image" name="image" data-cy="image" isImage accept="image/*" />
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
