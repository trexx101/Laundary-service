package com.logia.washman.domain.enumeration;

public enum Status {
    STARTED("STARTED"),
    PENDING_PICKUP("STARTED"),
    PENDING_WASH("STARTED"),
    CLEANING("STARTED"),
    PENDING_DELIVERY("STARTED"),
    COMPLETED("STARTED");

    private String status;

    Status(String status) {
        this.status = status;
    }

    /*public Status getStatus(String status){
        return new Status(status);

    }*/

    public String getVal() {
        return status;
    }
}
