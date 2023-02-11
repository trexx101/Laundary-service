package com.logia.washman.service;

import com.logia.washman.domain.Booking;
import com.logia.washman.domain.enumeration.Status;
import com.logia.washman.repository.BookingRepository;
import com.logia.washman.repository.UserRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public BookingService(UserRepository userRepository, BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public Optional<Booking> progressBookingStatus(Booking booking) {
        log.info("progress booking for id {}", booking.getId());
        if (booking != null) {
            Status stat = Status.valueOf(booking.getStatus());
            switch (stat) {
                case STARTED:
                    updateStatus(setStatus(booking, Status.PENDING_PICKUP.getVal()));
                case PENDING_PICKUP:
                    updateStatus(setStatus(booking, Status.PENDING_WASH.getVal()));
                case PENDING_WASH:
                    updateStatus(setStatus(booking, Status.CLEANING.getVal()));
                case CLEANING:
                    updateStatus(setStatus(booking, Status.PENDING_DELIVERY.getVal()));
                case PENDING_DELIVERY:
                    updateStatus(setStatus(booking, Status.COMPLETED.getVal()));
                default:
                    updateStatus(setStatus(booking, Status.STARTED.getVal()));
            }
            log.info("updated booking to {}", booking.getStatus());
        }
        return Optional.of(booking);
    }

    private Booking setStatus(Booking booking, String valueOf) {
        booking.setStatus(valueOf);
        return booking;
    }

    private void updateStatus(Booking pendingPickup) {
        bookingRepository.save(pendingPickup);
    }
}
