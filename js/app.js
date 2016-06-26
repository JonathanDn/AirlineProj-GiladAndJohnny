'use strict';

// function init() {

//     console.log('init: About to query()');
//     query();
//     console.log('init: Done query()');
// }

// function query() {
//     console.log('query: About to find()');
//     find('Puki');
//     console.log('query: Done find()');
// }

// function find(what) {
//     let d = new Date()
//     console.log('find: Found!');
// }

// init();



$(document).ready(()=>{

    renderByPath(location.pathname);

});



function renderByPath(path) {
    switch (path) {
        case '/flights.html':
            Flight.render();
            break ;
        case '/passengers.html':
            Passenger.render();
            break ;
        case '/planes.html':
            Plane.render();
            break ;
        default:
            break ;
    }
    
}

// render the planes available in dropdown.
function renderDropDown(planes) {
  console.log('dropdown planes',planes)
  return planes.map((plane) => {
             return `<option value="${plane.id}">PA-${plane.id}-${plane.model}-${plane.seatCount}</option>`
  }).join(' ');
}

// srcs
function renderLocations() {
    let srcs = getSrcs();
    let dests = getDests();
//   console.log('dropdown srcs',srcs)

   let srcHtml = srcs.map((src) => {
             return `<option value="${src}">${src}</option>`
  }).join(' ');

  let destHtml = dests.map((dest) => {
             return `<option value="${dest}">${dest}</option>`
  }).join(' ');

  // get elements to show the dropdowns --> show them.
  $('.selectSrc').html(srcHtml);
  $('.selectDest').html(destHtml);
}


function getFlightsFromLocalStorage() {
    let flights = Flight.loadJSONFromStorage();
    console.log('flights: ', flights);
    return flights;
}

function getSrcs() {
    let flights = getFlightsFromLocalStorage();
    // console.log('flights[0].src: ', flights[0].src);
    let srcs = [];
    for (var i = 0; i < flights.length; i++) {
        let currSrc = flights[i].src;
        srcs.push(currSrc);
    }
    console.log('srcs: ', srcs);
    return srcs;
}

function getDests() {
    let flights = getFlightsFromLocalStorage();
    let dests = [];
    for (var i = 0; i < flights.length; i++) {
        let currDest = flights[i].dest;
        dests.push(currDest);
    }
    console.log('dests: ', dests);
    
    return dests;
}


// tests:
getSrcs();
getDests();
renderLocations();