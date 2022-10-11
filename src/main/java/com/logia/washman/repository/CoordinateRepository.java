package com.logia.washman.repository;

import com.logia.washman.domain.Coordinate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Coordinate entity.
 */
@Repository
public interface CoordinateRepository extends JpaRepository<Coordinate, Long> {
    default Optional<Coordinate> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Coordinate> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Coordinate> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct coordinate from Coordinate coordinate left join fetch coordinate.customer",
        countQuery = "select count(distinct coordinate) from Coordinate coordinate"
    )
    Page<Coordinate> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct coordinate from Coordinate coordinate left join fetch coordinate.customer")
    List<Coordinate> findAllWithToOneRelationships();

    @Query("select coordinate from Coordinate coordinate left join fetch coordinate.customer where coordinate.id =:id")
    Optional<Coordinate> findOneWithToOneRelationships(@Param("id") Long id);
}
