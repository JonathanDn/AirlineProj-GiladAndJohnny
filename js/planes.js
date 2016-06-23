'use strict';

// This is a constructor function
function Plane(model, seatCount, id) {
    this.model = model;
    this.seatCount = seatCount;
    this.id = (id) ? id : Plane.nextId();
}