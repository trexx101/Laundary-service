package com.logia.washman.repository;

import com.logia.washman.domain.Booking;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Booking entity.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    default Optional<Booking> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Booking> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Booking> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct booking from Booking booking left join fetch booking.customer",
        countQuery = "select count(distinct booking) from Booking booking"
    )
    Page<Booking> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct booking from Booking booking left join fetch booking.customer")
    List<Booking> findAllWithToOneRelationships();

    @Query("select booking from Booking booking left join fetch booking.customer where booking.id =:id")
    Optional<Booking> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select distinct booking from Booking booking where booking.status <> :status order by booking.created")
    List<Booking> findAllBookingOutsideStatus(@Param("status") String status);
}
