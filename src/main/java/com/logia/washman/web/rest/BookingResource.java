package com.logia.washman.web.rest;

import com.logia.washman.domain.Booking;
import com.logia.washman.repository.BookingRepository;
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
 * REST controller for managing {@link com.logia.washman.domain.Booking}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BookingResource {

    private final Logger log = LoggerFactory.getLogger(BookingResource.class);

    private static final String ENTITY_NAME = "booking";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BookingRepository bookingRepository;

    public BookingResource(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    /**
     * {@code POST  /bookings} : Create a new booking.
     *
     * @param booking the booking to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new booking, or with status {@code 400 (Bad Request)} if the booking has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody Booking booking) throws URISyntaxException {
        log.debug("REST request to save Booking : {}", booking);
        if (booking.getId() != null) {
            throw new BadRequestAlertException("A new booking cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Booking result = bookingRepository.save(booking);
        return ResponseEntity
            .created(new URI("/api/bookings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bookings/:id} : Updates an existing booking.
     *
     * @param id the id of the booking to save.
     * @param booking the booking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated booking,
     * or with status {@code 400 (Bad Request)} if the booking is not valid,
     * or with status {@code 500 (Internal Server Error)} if the booking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bookings/{id}")
    public ResponseEntity<Booking> updateBooking(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Booking booking
    ) throws URISyntaxException {
        log.debug("REST request to update Booking : {}, {}", id, booking);
        if (booking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, booking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Booking result = bookingRepository.save(booking);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, booking.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /bookings/:id} : Partial updates given fields of an existing booking, field will ignore if it is null
     *
     * @param id the id of the booking to save.
     * @param booking the booking to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated booking,
     * or with status {@code 400 (Bad Request)} if the booking is not valid,
     * or with status {@code 404 (Not Found)} if the booking is not found,
     * or with status {@code 500 (Internal Server Error)} if the booking couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/bookings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Booking> partialUpdateBooking(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Booking booking
    ) throws URISyntaxException {
        log.debug("REST request to partial update Booking partially : {}, {}", id, booking);
        if (booking.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, booking.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!bookingRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Booking> result = bookingRepository
            .findById(booking.getId())
            .map(existingBooking -> {
                if (booking.getDescription() != null) {
                    existingBooking.setDescription(booking.getDescription());
                }
                if (booking.getPickDate() != null) {
                    existingBooking.setPickDate(booking.getPickDate());
                }
                if (booking.getReturnDate() != null) {
                    existingBooking.setReturnDate(booking.getReturnDate());
                }
                if (booking.getLoadSize() != null) {
                    existingBooking.setLoadSize(booking.getLoadSize());
                }
                if (booking.getServiceType() != null) {
                    existingBooking.setServiceType(booking.getServiceType());
                }
                if (booking.getImage() != null) {
                    existingBooking.setImage(booking.getImage());
                }
                if (booking.getImageContentType() != null) {
                    existingBooking.setImageContentType(booking.getImageContentType());
                }
                if (booking.getStatus() != null) {
                    existingBooking.setStatus(booking.getStatus());
                }
                if (booking.getCreated() != null) {
                    existingBooking.setCreated(booking.getCreated());
                }

                return existingBooking;
            })
            .map(bookingRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, booking.getId().toString())
        );
    }

    /**
     * {@code GET  /bookings} : get all the bookings.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bookings in body.
     */
    @GetMapping("/bookings")
    public List<Booking> getAllBookings(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Bookings");
        if (eagerload) {
            return bookingRepository.findAllWithEagerRelationships();
        } else {
            return bookingRepository.findAll();
        }
    }

    /**
     * {@code GET  /bookings/:id} : get the "id" booking.
     *
     * @param id the id of the booking to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the booking, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        log.debug("REST request to get Booking : {}", id);
        Optional<Booking> booking = bookingRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(booking);
    }

    /**
     * {@code DELETE  /bookings/:id} : delete the "id" booking.
     *
     * @param id the id of the booking to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        log.debug("REST request to delete Booking : {}", id);
        bookingRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
