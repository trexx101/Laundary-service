import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './coordinate.reducer';

export const CoordinateDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const coordinateEntity = useAppSelector(state => state.coordinate.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="coordinateDetailsHeading">Coordinate</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{coordinateEntity.id}</dd>
          <dt>
            <span id="longitude">Longitude</span>
          </dt>
          <dd>{coordinateEntity.longitude}</dd>
          <dt>
            <span id="latitude">Latitude</span>
          </dt>
          <dd>{coordinateEntity.latitude}</dd>
          <dt>
            <span id="verified">Verified</span>
          </dt>
          <dd>{coordinateEntity.verified ? 'true' : 'false'}</dd>
          <dt>Customer</dt>
          <dd>{coordinateEntity.customer ? coordinateEntity.customer.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/coordinate" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/coordinate/${coordinateEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default CoordinateDetail;
