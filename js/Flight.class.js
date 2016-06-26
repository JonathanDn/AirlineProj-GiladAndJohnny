'use strict';

const KEY_FLIGHTS = 'flights';

// This is a constructor function
function Flight(src, dest, date, planeId, id) {
    this.src = src;
    this.dest = dest;
    this.date = new Date(date);
    this.planeId = planeId;
    this.id = (id) ? id : Flight.nextId();
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
    console.log('QUERY: Flight.flights: ', Flight.flights);
    
    if (Flight.flights) return Flight.flights;
    let jsonFlights = Flight.loadJSONFromStorage();
    console.log('QUERY: jsonFlights: ', jsonFlights);
    
    Flight.flights = jsonFlights.map(jsonFlight => {
        return new Flight(jsonFlight.src, jsonFlight.dest, jsonFlight.date, jsonFlight.id, jsonFlight.planeId);
    })

    return Flight.flights;
}

// saves the flight object to localStorage.
Flight.save = function (formObj) {
    let flights = Flight.query();
    console.log('flights: ', flights)
    let flight;
    // console.log('formObj.fId: ', formObj.fId)
    // console.log('formObj.fPlaneCode: ', formObj.fPlaneCode);
    if (formObj.fId) {
        flight = Flight.findById(formObj.fId);
        flight.src = formObj.fSrc;
        flight.dest = formObj.fDest;
        flight.date = new Date(formObj.fDate);
        flight.planeId = formObj.fPlaneCode;
        // not sure what this functionality looks like
        console.log('formObj.fDate', formObj.fDate);
    } else {
        // console.log('IN ELSE');
        
        flight = new Flight(formObj.fSrc, formObj.fDest, formObj.fDate, formObj.fPlaneCode);
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
        console.log('f.planeId: ', f.planeId);
        console.log('f: ', f);
        
        let plane = Plane.findById(f.planeId);
        
        console.log('plane: ', plane);
        // console.log('plane.model: ', plane.model);
        
        // console.log('f.planeId: ', f.planeId)

        // ADD TO planeid ${plane.model}-${plane.seatCount}
        return `<tr onclick="Flight.select(${f.id}, this)">
            <td>${f.id}</td>
            <td>${f.src}</td>
            <td>${f.dest}</td>
            <td>${moment(f.date).format('DD-MM-YYYY')}</td>
            <td>
                PA-${f.planeId}-${plane.model}-${plane.seatCount}
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

// collects all the flight data from modal and turns to an obj
Flight.saveFlight = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);

    Flight.save(formObj);
    Flight.render();
    $('#modalFlight').modal('hide');
}


Flight.editFlight = function (fId, event) {
    if (event) event.stopPropagation();
    // get planeId array from local storage.
    // replace it with the tempArr

    // print planes array to modal dropdown.
    // let temparr = ['a', 'b', 'c'];
    // let arr = renderDropDown(temparr);
    //     console.log(arr);
    // let planeIds = Plane.createPlaneIdArray();
    
    // console.log('planeIds: ', planeIds);
    // console.log('Plane.loadJSONFromStorage(): ', Plane.loadJSONFromStorage());

    let planeIds = renderDropDown(Plane.loadJSONFromStorage());
    
        $('.selectPlane').html(planeIds);
    if (fId) {
        let flight = Flight.findById(fId);
        $('#fId').val(flight.id);
        $('#fSrc').val(flight.src);
        $('#fDest').val(flight.dest);
        $('#fDate').val(moment(flight.date).format('YYYY-MM-DD'));
        $('#fPlaneId').val(flight.plane);
    } else {
        $('#fId').val('');
        $('#fSrc').val('');
        $('#fDest').val('');
        $('#fDate').val('');
        $('#fPlaneId').val('');
    }
    
    $('#modalFlight').modal('show');
}


// test
// var test = Plane.findById(2);
// console.log('test: ', test);