import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Coordinate from './coordinate';
import CoordinateDetail from './coordinate-detail';
import CoordinateUpdate from './coordinate-update';
import CoordinateDeleteDialog from './coordinate-delete-dialog';

const CoordinateRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Coordinate />} />
    <Route path="new" element={<CoordinateUpdate />} />
    <Route path=":id">
      <Route index element={<CoordinateDetail />} />
      <Route path="edit" element={<CoordinateUpdate />} />
      <Route path="delete" element={<CoordinateDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CoordinateRoutes;
