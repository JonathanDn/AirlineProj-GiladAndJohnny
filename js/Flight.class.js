'use strict';

const KEY_FLIGHTS = 'flights';

// This is a constructor function
function Flight(id, src, dest, date) {
    this.id = (id) ? id : Flight.nextId();
    this.src = src;
    this.dest = dest;
    this.date = new Date(date);
} 

// static methods:   

Flight.nextId = function () {
    let result = 1;
    let jsonFlights = Flight.loadJSONFromStorage();
    if (jsonFlights.length) result = jsonFlights[jsonFlights.length - 1].id + 1;
    return result;
}

Flight.findById = function (fId) {
    let result = null;
    let flights = Flight.query()
        .filter(f => f.id === fId);
    if (flights.length) result = flights[0];
    return result;
}

Flight.loadJSONFromStorage = function () {
    let flights = getFromStorage(KEY_FLIGHTS);
    if (!flights) flights = [];
    return flights;
}


Flight.query = function () {

    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();

    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.model, jsonFlight.seatCount, jsonFlight.id);
    })

    return Flight.flights;
}

Flight.save = function (formObj) {
    let flights = Flight.query();
    let flight;
    if (formObj.fId) {
        flight = Flight.findById(+formObj.fId);
        flight.model = formObj.fModel;
        flight.seatCount = formObj.fSeatCount;
        // not sure what this functionality looks like
        console.log('formObj.fSeatCount', formObj.fSeatCount);
    } else {
        flight = new Flight(formObj.fModel, formObj.fSeatCount);
        flights.push(flight);
    }
    Flight.flights = flights;
    saveToStorage(KEY_FLIGHTS, flights);
}


Flight.remove = function (fId, event) {
    event.stopPropagation();
    let flights = Flight.query();
    flights = flights.filter(f => f.id !== fId)
    saveToStorage(KEY_FLIGHTS, flights);
    Flight.flights = flights;
    Flight.render();
}


Flight.render = function () {

    let flights = Flight.query();
    var strHtml = flights.map(f => {
        return `<tr onclick="Flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.model}</td>
            <td>
                ${f.seatCount}
            </td>
            <td>
                <button class="btn btn-danger" onclick="Flight.remove(${f.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Flight.editFlight(${f.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblFlights').html(strHtml);
}

Flight.select = function (fId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let f = Flight.findById(fId);
    $('.fDetailsModel').html(f.model);
}

Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);

    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}


Flight.editFlight = function (fId, event) {
    if (event) event.stopPropagation();
    if (fId) {
        let flight = Flight.findById(fId);
        $('#fId').val(flight.id);
        $('#fModel').val(flight.model);
        $('#fSeatCount').val(flight.seatCount);
    } else {
        $('#fId').val('');
        $('#fModel').val('');
        $('#fSeatCount').val('');
    }

    $('#modalFlight').modal('show');
}
