import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './customer.reducer';

export const CustomerDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const customerEntity = useAppSelector(state => state.customer.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="customerDetailsHeading">Customer</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{customerEntity.id}</dd>
          <dt>
            <span id="firstName">First Name</span>
          </dt>
          <dd>{customerEntity.firstName}</dd>
          <dt>
            <span id="lastName">Last Name</span>
          </dt>
          <dd>{customerEntity.lastName}</dd>
          <dt>
            <span id="gender">Gender</span>
          </dt>
          <dd>{customerEntity.gender}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{customerEntity.email}</dd>
          <dt>
            <span id="phone">Phone</span>
          </dt>
          <dd>{customerEntity.phone}</dd>
          <dt>
            <span id="addressLine1">Address Line 1</span>
          </dt>
          <dd>{customerEntity.addressLine1}</dd>
          <dt>
            <span id="addressLine2">Address Line 2</span>
          </dt>
          <dd>{customerEntity.addressLine2}</dd>
          <dt>
            <span id="city">City</span>
          </dt>
          <dd>{customerEntity.city}</dd>
          <dt>
            <span id="country">Country</span>
          </dt>
          <dd>{customerEntity.country}</dd>
          <dt>User</dt>
          <dd>{customerEntity.user ? customerEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/customer" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/customer/${customerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default CustomerDetail;
