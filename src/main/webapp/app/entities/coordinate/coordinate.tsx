import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ICoordinate } from 'app/shared/model/coordinate.model';
import { getEntities } from './coordinate.reducer';

export const Coordinate = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const coordinateList = useAppSelector(state => state.coordinate.entities);
  const loading = useAppSelector(state => state.coordinate.loading);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  const handleSyncList = () => {
    dispatch(getEntities({}));
  };

  return (
    <div>
      <h2 id="coordinate-heading" data-cy="CoordinateHeading">
        Coordinates
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Refresh list
          </Button>
          <Link to="/coordinate/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Coordinate
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {coordinateList && coordinateList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Longitude</th>
                <th>Latitude</th>
                <th>Verified</th>
                <th>Customer</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {coordinateList.map((coordinate, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/coordinate/${coordinate.id}`} color="link" size="sm">
                      {coordinate.id}
                    </Button>
                  </td>
                  <td>{coordinate.longitude}</td>
                  <td>{coordinate.latitude}</td>
                  <td>{coordinate.verified ? 'true' : 'false'}</td>
                  <td>{coordinate.customer ? <Link to={`/customer/${coordinate.customer.id}`}>{coordinate.customer.login}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/coordinate/${coordinate.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                      </Button>
                      <Button tag={Link} to={`/coordinate/${coordinate.id}/edit`} color="primary" size="sm" data-cy="entityEditButton">
                        <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                      </Button>
                      <Button tag={Link} to={`/coordinate/${coordinate.id}/delete`} color="danger" size="sm" data-cy="entityDeleteButton">
                        <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && <div className="alert alert-warning">No Coordinates found</div>
        )}
      </div>
    </div>
  );
};

export default Coordinate;
