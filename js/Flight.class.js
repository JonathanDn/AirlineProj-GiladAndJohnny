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

Plane.nextId = function () {
    let result = 1;
    let jsonPlanes = Plane.loadJSONFromStorage();
    if (jsonPlanes.length) result = jsonPlanes[jsonPlanes.length - 1].id + 1;
    return result;
}

Plane.findById = function (pId) {
    let result = null;
    let planes = Plane.query()
        .filter(p => p.id === pId);
    if (planes.length) result = planes[0];
    return result;
}

Plane.loadJSONFromStorage = function () {
    let planes = getFromStorage(KEY_PLANES);
    if (!planes) planes = [];
    return planes;
}


Plane.query = function () {

    if (Plane.planes) return Plane.planes;
    let jsonPlanes = Plane.loadJSONFromStorage();

    Plane.planes = jsonPlanes.map(jsonPlane => {
        return new Plane(jsonPlane.model, jsonPlane.seatCount, jsonPlane.id);
    })

    return Plane.planes;
}

Plane.save = function (formObj) {
    let planes = Plane.query();
    let plane;
    if (formObj.pId) {
        plane = Plane.findById(+formObj.pId);
        plane.model = formObj.pModel;
        plane.seatCount = formObj.pSeatCount;
        // not sure what this functionality looks like
        console.log('formObj.pSeatCount', formObj.pSeatCount);
    } else {
        plane = new Plane(formObj.pModel, formObj.pSeatCount);
        planes.push(plane);
    }
    Plane.planes = planes;
    saveToStorage(KEY_PLANES, planes);
}


Plane.remove = function (pId, event) {
    event.stopPropagation();
    let planes = Plane.query();
    planes = planes.filter(p => p.id !== pId)
    saveToStorage(KEY_PLANES, planes);
    Plane.planes = planes;
    Plane.render();
}


Plane.render = function () {

    let planes = Plane.query();
    var strHtml = planes.map(p => {
        return `<tr onclick="Plane.select(${p.id}, this)">
            <td>${p.id}</td>
            <td>${p.model}</td>
            <td>
                ${p.seatCount}
            </td>
            <td>
                <button class="btn btn-danger" onclick="Plane.remove(${p.id}, event)">
                    <i class="glyphicon glyphicon-trash"></i>
                </button>
                 <button class="btn btn-info" onclick="Plane.editPlane(${p.id}, event)">
                    <i class="glyphicon glyphicon-edit"></i>
                </button>
            </td>
        </tr>`

    }).join(' ');
    $('.tblPlanes').html(strHtml);
}

Plane.select = function (pId, elRow) {
    $('.active').removeClass('active success');
    $(elRow).addClass('active success');
    $('.details').show();
    let p = Plane.findById(pId);
    $('.pDetailsModel').html(p.model);
}

Plane.savePlane = function () {
    var formObj = $('form').serializeJSON();
    console.log('formObj', formObj);

    Plane.save(formObj);
    Plane.render();
    $('#modalPlane').modal('hide');
}


Plane.editPlane = function (pId, event) {
    if (event) event.stopPropagation();
    if (pId) {
        let plane = Plane.findById(pId);
        $('#pId').val(plane.id);
        $('#pModel').val(plane.model);
        $('#pSeatCount').val(plane.seatCount);
    } else {
        $('#pId').val('');
        $('#pModel').val('');
        $('#pSeatCount').val('');
    }

    $('#modalPlane').modal('show');
}
