package com.logia.washman.web.rest;

import com.logia.washman.domain.Coordinate;
import com.logia.washman.repository.CoordinateRepository;
import com.logia.washman.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.logia.washman.domain.Coordinate}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CoordinateResource {

    private final Logger log = LoggerFactory.getLogger(CoordinateResource.class);

    private static final String ENTITY_NAME = "coordinate";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CoordinateRepository coordinateRepository;

    public CoordinateResource(CoordinateRepository coordinateRepository) {
        this.coordinateRepository = coordinateRepository;
    }

    /**
     * {@code POST  /coordinates} : Create a new coordinate.
     *
     * @param coordinate the coordinate to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new coordinate, or with status {@code 400 (Bad Request)} if the coordinate has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/coordinates")
    public ResponseEntity<Coordinate> createCoordinate(@Valid @RequestBody Coordinate coordinate) throws URISyntaxException {
        log.debug("REST request to save Coordinate : {}", coordinate);
        if (coordinate.getId() != null) {
            throw new BadRequestAlertException("A new coordinate cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Coordinate result = coordinateRepository.save(coordinate);
        return ResponseEntity
            .created(new URI("/api/coordinates/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /coordinates/:id} : Updates an existing coordinate.
     *
     * @param id the id of the coordinate to save.
     * @param coordinate the coordinate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coordinate,
     * or with status {@code 400 (Bad Request)} if the coordinate is not valid,
     * or with status {@code 500 (Internal Server Error)} if the coordinate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> updateCoordinate(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Coordinate coordinate
    ) throws URISyntaxException {
        log.debug("REST request to update Coordinate : {}, {}", id, coordinate);
        if (coordinate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coordinate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coordinateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Coordinate result = coordinateRepository.save(coordinate);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, coordinate.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /coordinates/:id} : Partial updates given fields of an existing coordinate, field will ignore if it is null
     *
     * @param id the id of the coordinate to save.
     * @param coordinate the coordinate to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated coordinate,
     * or with status {@code 400 (Bad Request)} if the coordinate is not valid,
     * or with status {@code 404 (Not Found)} if the coordinate is not found,
     * or with status {@code 500 (Internal Server Error)} if the coordinate couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/coordinates/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Coordinate> partialUpdateCoordinate(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Coordinate coordinate
    ) throws URISyntaxException {
        log.debug("REST request to partial update Coordinate partially : {}, {}", id, coordinate);
        if (coordinate.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, coordinate.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coordinateRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Coordinate> result = coordinateRepository
            .findById(coordinate.getId())
            .map(existingCoordinate -> {
                if (coordinate.getLongitude() != null) {
                    existingCoordinate.setLongitude(coordinate.getLongitude());
                }
                if (coordinate.getLatitude() != null) {
                    existingCoordinate.setLatitude(coordinate.getLatitude());
                }
                if (coordinate.getVerified() != null) {
                    existingCoordinate.setVerified(coordinate.getVerified());
                }

                return existingCoordinate;
            })
            .map(coordinateRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, coordinate.getId().toString())
        );
    }

    /**
     * {@code GET  /coordinates} : get all the coordinates.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of coordinates in body.
     */
    @GetMapping("/coordinates")
    public List<Coordinate> getAllCoordinates(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Coordinates");
        if (eagerload) {
            return coordinateRepository.findAllWithEagerRelationships();
        } else {
            return coordinateRepository.findAll();
        }
    }

    /**
     * {@code GET  /coordinates/:id} : get the "id" coordinate.
     *
     * @param id the id of the coordinate to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the coordinate, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/coordinates/{id}")
    public ResponseEntity<Coordinate> getCoordinate(@PathVariable Long id) {
        log.debug("REST request to get Coordinate : {}", id);
        Optional<Coordinate> coordinate = coordinateRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(coordinate);
    }

    /**
     * {@code DELETE  /coordinates/:id} : delete the "id" coordinate.
     *
     * @param id the id of the coordinate to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/coordinates/{id}")
    public ResponseEntity<Void> deleteCoordinate(@PathVariable Long id) {
        log.debug("REST request to delete Coordinate : {}", id);
        coordinateRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
