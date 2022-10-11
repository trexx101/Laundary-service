package com.logia.washman.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Coordinate.
 */
@Entity
@Table(name = "coordinate")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Coordinate implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "longitude", nullable = false)
    private Float longitude;

    @NotNull
    @Column(name = "latitude", nullable = false)
    private Float latitude;

    @Column(name = "verified")
    private Boolean verified;

    @JsonIgnoreProperties(value = { "user", "bookings", "location" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Coordinate id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getLongitude() {
        return this.longitude;
    }

    public Coordinate longitude(Float longitude) {
        this.setLongitude(longitude);
        return this;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public Float getLatitude() {
        return this.latitude;
    }

    public Coordinate latitude(Float latitude) {
        this.setLatitude(latitude);
        return this;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }

    public Boolean getVerified() {
        return this.verified;
    }

    public Coordinate verified(Boolean verified) {
        this.setVerified(verified);
        return this;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Coordinate customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Coordinate)) {
            return false;
        }
        return id != null && id.equals(((Coordinate) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Coordinate{" +
            "id=" + getId() +
            ", longitude=" + getLongitude() +
            ", latitude=" + getLatitude() +
            ", verified='" + getVerified() + "'" +
            "}";
    }
}
