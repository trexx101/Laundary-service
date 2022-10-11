package com.logia.washman.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.logia.washman.IntegrationTest;
import com.logia.washman.domain.Coordinate;
import com.logia.washman.repository.CoordinateRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CoordinateResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CoordinateResourceIT {

    private static final Float DEFAULT_LONGITUDE = 1F;
    private static final Float UPDATED_LONGITUDE = 2F;

    private static final Float DEFAULT_LATITUDE = 1F;
    private static final Float UPDATED_LATITUDE = 2F;

    private static final Boolean DEFAULT_VERIFIED = false;
    private static final Boolean UPDATED_VERIFIED = true;

    private static final String ENTITY_API_URL = "/api/coordinates";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CoordinateRepository coordinateRepository;

    @Mock
    private CoordinateRepository coordinateRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCoordinateMockMvc;

    private Coordinate coordinate;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coordinate createEntity(EntityManager em) {
        Coordinate coordinate = new Coordinate().longitude(DEFAULT_LONGITUDE).latitude(DEFAULT_LATITUDE).verified(DEFAULT_VERIFIED);
        return coordinate;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coordinate createUpdatedEntity(EntityManager em) {
        Coordinate coordinate = new Coordinate().longitude(UPDATED_LONGITUDE).latitude(UPDATED_LATITUDE).verified(UPDATED_VERIFIED);
        return coordinate;
    }

    @BeforeEach
    public void initTest() {
        coordinate = createEntity(em);
    }

    @Test
    @Transactional
    void createCoordinate() throws Exception {
        int databaseSizeBeforeCreate = coordinateRepository.findAll().size();
        // Create the Coordinate
        restCoordinateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coordinate)))
            .andExpect(status().isCreated());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeCreate + 1);
        Coordinate testCoordinate = coordinateList.get(coordinateList.size() - 1);
        assertThat(testCoordinate.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testCoordinate.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testCoordinate.getVerified()).isEqualTo(DEFAULT_VERIFIED);
    }

    @Test
    @Transactional
    void createCoordinateWithExistingId() throws Exception {
        // Create the Coordinate with an existing ID
        coordinate.setId(1L);

        int databaseSizeBeforeCreate = coordinateRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoordinateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coordinate)))
            .andExpect(status().isBadRequest());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLongitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = coordinateRepository.findAll().size();
        // set the field null
        coordinate.setLongitude(null);

        // Create the Coordinate, which fails.

        restCoordinateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coordinate)))
            .andExpect(status().isBadRequest());

        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLatitudeIsRequired() throws Exception {
        int databaseSizeBeforeTest = coordinateRepository.findAll().size();
        // set the field null
        coordinate.setLatitude(null);

        // Create the Coordinate, which fails.

        restCoordinateMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coordinate)))
            .andExpect(status().isBadRequest());

        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllCoordinates() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        // Get all the coordinateList
        restCoordinateMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coordinate.getId().intValue())))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE.doubleValue())))
            .andExpect(jsonPath("$.[*].verified").value(hasItem(DEFAULT_VERIFIED.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCoordinatesWithEagerRelationshipsIsEnabled() throws Exception {
        when(coordinateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCoordinateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(coordinateRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCoordinatesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(coordinateRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCoordinateMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(coordinateRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCoordinate() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        // Get the coordinate
        restCoordinateMockMvc
            .perform(get(ENTITY_API_URL_ID, coordinate.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(coordinate.getId().intValue()))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE.doubleValue()))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE.doubleValue()))
            .andExpect(jsonPath("$.verified").value(DEFAULT_VERIFIED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingCoordinate() throws Exception {
        // Get the coordinate
        restCoordinateMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCoordinate() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();

        // Update the coordinate
        Coordinate updatedCoordinate = coordinateRepository.findById(coordinate.getId()).get();
        // Disconnect from session so that the updates on updatedCoordinate are not directly saved in db
        em.detach(updatedCoordinate);
        updatedCoordinate.longitude(UPDATED_LONGITUDE).latitude(UPDATED_LATITUDE).verified(UPDATED_VERIFIED);

        restCoordinateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCoordinate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCoordinate))
            )
            .andExpect(status().isOk());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
        Coordinate testCoordinate = coordinateList.get(coordinateList.size() - 1);
        assertThat(testCoordinate.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testCoordinate.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testCoordinate.getVerified()).isEqualTo(UPDATED_VERIFIED);
    }

    @Test
    @Transactional
    void putNonExistingCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, coordinate.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coordinate))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(coordinate))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(coordinate)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCoordinateWithPatch() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();

        // Update the coordinate using partial update
        Coordinate partialUpdatedCoordinate = new Coordinate();
        partialUpdatedCoordinate.setId(coordinate.getId());

        partialUpdatedCoordinate.longitude(UPDATED_LONGITUDE).verified(UPDATED_VERIFIED);

        restCoordinateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoordinate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoordinate))
            )
            .andExpect(status().isOk());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
        Coordinate testCoordinate = coordinateList.get(coordinateList.size() - 1);
        assertThat(testCoordinate.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testCoordinate.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testCoordinate.getVerified()).isEqualTo(UPDATED_VERIFIED);
    }

    @Test
    @Transactional
    void fullUpdateCoordinateWithPatch() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();

        // Update the coordinate using partial update
        Coordinate partialUpdatedCoordinate = new Coordinate();
        partialUpdatedCoordinate.setId(coordinate.getId());

        partialUpdatedCoordinate.longitude(UPDATED_LONGITUDE).latitude(UPDATED_LATITUDE).verified(UPDATED_VERIFIED);

        restCoordinateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoordinate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCoordinate))
            )
            .andExpect(status().isOk());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
        Coordinate testCoordinate = coordinateList.get(coordinateList.size() - 1);
        assertThat(testCoordinate.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testCoordinate.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testCoordinate.getVerified()).isEqualTo(UPDATED_VERIFIED);
    }

    @Test
    @Transactional
    void patchNonExistingCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, coordinate.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coordinate))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(coordinate))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCoordinate() throws Exception {
        int databaseSizeBeforeUpdate = coordinateRepository.findAll().size();
        coordinate.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoordinateMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(coordinate))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coordinate in the database
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCoordinate() throws Exception {
        // Initialize the database
        coordinateRepository.saveAndFlush(coordinate);

        int databaseSizeBeforeDelete = coordinateRepository.findAll().size();

        // Delete the coordinate
        restCoordinateMockMvc
            .perform(delete(ENTITY_API_URL_ID, coordinate.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Coordinate> coordinateList = coordinateRepository.findAll();
        assertThat(coordinateList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
