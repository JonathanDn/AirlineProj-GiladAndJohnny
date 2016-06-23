'use strict';

// This is a constructor function
function Plane(model, seatCount, id) {
    this.model = model;
    this.seatCount = seatCount;
    this.id = (id) ? id : Plane.nextId();
}

// static methods:   

Plane.nextId = function () {
    let result = 1;
    let jsonPassengers = Plane.loadJSONFromStorage();
    if (jsonPassengers.length) result = jsonPassengers[jsonPassengers.length - 1].id + 1;
    return result;
}

Plane.findById = function (pId) {
    let result = null;
    let passengers = Plane.query()
        .filter(p => p.id === pId);
    if (passengers.length) result = passengers[0];
    return result;
}

Plane.loadJSONFromStorage = function () {
    let passengers = getFromStorage(KEY_PASSENGERS);
    if (!passengers) passengers = [];
    return passengers;
}


Plane.query = function () {

    if (Plane.passengers) return Passenger.passengers;
    let jsonPassengers = Plane.loadJSONFromStorage();

    Plane.passengers = jsonPassengers.map(jsonPassenger => {
        return new Plane(jsonPassenger.name, jsonPassenger.birthdate, jsonPassenger.id);
    })

    return Plane.passengers;
}

Plane.save = function (formObj) {
    let passengers = Plane.query();
    let passenger;
    if (formObj.pid) {
        passenger = Plane.findById(+formObj.pid);
        passenger.name = formObj.pname;
        passenger.birthdate = new Date(formObj.pdate);
    } else {
        passenger = new Plane(formObj.pname, formObj.pdate);
        passengers.push(passenger);
    }
    Plane.passengers = passengers;
    saveToStorage(KEY_PASSENGERS, passengers);
}


Plane.remove = function (pId, event) {
    event.stopPropagation();
    let passengers = Plane.query();
    passengers = passengers.filter(p => p.id !== pId)
    saveToStorage(KEY_PASSENGERS, passengers);
    Plane.passengers = passengers;
    Plane.render();
}


Plane.render = function () {

    let passengers = Plane.query();
    var strHtml = passengers.map(p => {
        return `<tr onclick="Plane.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>
                ${moment(p.birthdate).format('DD-MM-YYYY')}
                ${(p.isBirthday()) ? '<i class="glyphicon glyphicon-gift"></i>' : ''}
            </td>
            <td>
                <button class="btn btn-danger" onclick="Plane.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Plane.editPassenger(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPassengers').html(strHtml);
}

Plane.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Plane.findById(pId);
    $('.pDetailsName').html(p.name);
}

Plane.savePlane = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);

    Plane.save(formObj);
    Plane.render();
    $('#modalPassenger').modal('hide');
}


Plane.editPlane = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        let passenger = Plane.findById(pId);
        $('#pid').val(passenger.id);
        $('#pname').val(passenger.name);
        $('#pdate').val(moment(passenger.birthdate).format('YYYY-MM-DD'));
    } else {
        $('#pid').val('');
        $('#pname').val('');
        $('#pdate').val('');
    }

    $('#modalPassenger').modal('show');
}
