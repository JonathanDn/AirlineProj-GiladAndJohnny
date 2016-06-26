'use strict';

const KEY_PLANES = 'planes';

// This is a constructor function
function Plane(model, seatCount, id) {
    this.model = model;
    this.seatCount = seatCount;
    this.id = (id) ? id : Plane.nextId();
}

// static methods:   

Plane.nextId = function () {
    let result = 1;
    let jsonPlanes = Plane.loadJSONFromStorage();
    if (jsonPlanes.length) result = jsonPlanes[jsonPlanes.length - 1].id + 1;
    return result;
}

Plane.findById = function (pId) {
    // console.log('pId: ', pId)
    let result = null;
    // console.log('Plane.query(): ', Plane.query());    
    let planes = Plane.query()
        .filter(p => p.id === pId);
    if (planes.length) result = planes[0];
    // console.log('result: ', result);
    return result;
}

Plane.loadJSONFromStorage = function () {
    let planes = getFromStorage(KEY_PLANES);
    if (!planes) planes = [];
    // this is the fix in plane
    for (var i = 0; i < planes.length; i++) {
        planes[i].seatCount = +planes[i].seatCount;
        planes[i].id = +planes[i].id
    }
    return planes;
}

Plane.createPlaneIdArray = function () {
    let planes = Plane.loadJSONFromStorage();
    // console.log('planes: ', planes);
    let planesArr = planes.map(function(plane){
         return plane.id;
    });
    // console.log('planesArr: ', planesArr);
    return planesArr;
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
        // console.log('formObj.pSeatCount', formObj.pSeatCount);
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

// test2
// var test2 = Plane.findById(2);
// console.log('test2: ', test2);