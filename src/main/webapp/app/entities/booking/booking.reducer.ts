import axios from 'axios';
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils';
import { IBooking, defaultValue } from 'app/shared/model/booking.model';

const initialState: EntityState<IBooking> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

const apiUrl = 'api/bookings';
const adminApi = 'api/manage/bookings';

// Actions

export const getEntities = createAsyncThunk('booking/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}?cacheBuster=${new Date().getTime()}`;
  return axios.get<IBooking[]>(requestUrl);
});

export const getAdminEntities = createAsyncThunk('booking/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${adminApi}/COMPLETED?cacheBuster=${new Date().getTime()}`;
  return axios.get<IBooking[]>(requestUrl);
});

export const getEntity = createAsyncThunk(
  'booking/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`;
    return axios.get<IBooking>(requestUrl);
  },
  { serializeError: serializeAxiosError }
);

export const createEntity = createAsyncThunk(
  'booking/create_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.post<IBooking>(apiUrl, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const updateEntity = createAsyncThunk(
  'booking/update_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.put<IBooking>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const partialUpdateEntity = createAsyncThunk(
  'booking/partial_update_entity',
  async (entity: IBooking, thunkAPI) => {
    const result = await axios.patch<IBooking>(`${apiUrl}/${entity.id}`, cleanEntity(entity));
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const deleteEntity = createAsyncThunk(
  'booking/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`;
    const result = await axios.delete<IBooking>(requestUrl);
    thunkAPI.dispatch(getEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

export const progressEntityStatus = createAsyncThunk(
  'booking/progress_entity_status',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/progress/${id}`;
    const result = await axios.get<IBooking>(requestUrl);
    thunkAPI.dispatch(getAdminEntities({}));
    return result;
  },
  { serializeError: serializeAxiosError }
);

// slice

export const BookingSlice = createEntitySlice({
  name: 'booking',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload.data;
      })
      .addCase(deleteEntity.fulfilled, state => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = {};
      })
      .addMatcher(isFulfilled(getEntities, getAdminEntities), (state, action) => {
        const { data } = action.payload;

        return {
          ...state,
          loading: false,
          entities: data,
        };
      })
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false;
        state.loading = false;
        state.updateSuccess = true;
        state.entity = action.payload.data;
      })
      .addMatcher(isPending(getEntities, getEntity, getAdminEntities), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.loading = true;
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), state => {
        state.errorMessage = null;
        state.updateSuccess = false;
        state.updating = true;
      });
  },
});

export const { reset } = BookingSlice.actions;

// Reducer
export default BookingSlice.reducer;
