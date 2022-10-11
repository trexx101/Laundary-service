package com.logia.washman.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.logia.washman.domain.enumeration.LoadSize;
import com.logia.washman.domain.enumeration.ServiceType;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Type;

/**
 * A Booking.
 */
@Entity
@Table(name = "booking")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Booking implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "pick_date", nullable = false)
    private LocalDate pickDate;

    @NotNull
    @Column(name = "return_date", nullable = false)
    private LocalDate returnDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "load_size", nullable = false)
    private LoadSize loadSize;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type")
    private ServiceType serviceType;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "status")
    private String status;

    @Column(name = "created")
    private Instant created;

    @JsonIgnoreProperties(value = { "booking" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Payment payment;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "bookings", "location" }, allowSetters = true)
    private Customer customer;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Booking id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Booking description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getPickDate() {
        return this.pickDate;
    }

    public Booking pickDate(LocalDate pickDate) {
        this.setPickDate(pickDate);
        return this;
    }

    public void setPickDate(LocalDate pickDate) {
        this.pickDate = pickDate;
    }

    public LocalDate getReturnDate() {
        return this.returnDate;
    }

    public Booking returnDate(LocalDate returnDate) {
        this.setReturnDate(returnDate);
        return this;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public LoadSize getLoadSize() {
        return this.loadSize;
    }

    public Booking loadSize(LoadSize loadSize) {
        this.setLoadSize(loadSize);
        return this;
    }

    public void setLoadSize(LoadSize loadSize) {
        this.loadSize = loadSize;
    }

    public ServiceType getServiceType() {
        return this.serviceType;
    }

    public Booking serviceType(ServiceType serviceType) {
        this.setServiceType(serviceType);
        return this;
    }

    public void setServiceType(ServiceType serviceType) {
        this.serviceType = serviceType;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Booking image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Booking imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getStatus() {
        return this.status;
    }

    public Booking status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreated() {
        return this.created;
    }

    public Booking created(Instant created) {
        this.setCreated(created);
        return this;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public Payment getPayment() {
        return this.payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Booking payment(Payment payment) {
        this.setPayment(payment);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Booking customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Booking)) {
            return false;
        }
        return id != null && id.equals(((Booking) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Booking{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", pickDate='" + getPickDate() + "'" +
            ", returnDate='" + getReturnDate() + "'" +
            ", loadSize='" + getLoadSize() + "'" +
            ", serviceType='" + getServiceType() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            "}";
    }
}
