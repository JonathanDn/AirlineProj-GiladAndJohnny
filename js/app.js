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


const AIRPORTS = ['TLV', 'SYN', 'AUS', 'AUT', 'GER', 'POL'];



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
        // index.html is default
        default :
            // renderLocations();
            renderSearchDropDown();
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

function renderSearchDropDown() {
    let idCounter = 1;
    let htmlStr = AIRPORTS.map( loc => {
        console.log('idCounter: ', idCounter);
        let strHtml = `<option id="${idCounter}" value="${loc}"/>` 
        idCounter++;
        return strHtml;
        }).join(' ');
    $('#datalist').html(htmlStr);
}

function removeDoublesFromDropDown(value) {
    // if already have the 'dis' class --> remove disabled attr + class 'dis' (RESET)
    $('.dis').attr('disabled', false).toggleClass('dis');

    // onchange --> add disabled attr + class 'dis'
    $(`option[value="${value}"]`).attr('disabled', true).toggleClass('dis');   
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
    // check for doubles within this dropdown.
    for (var i = 0; i < flights.length; i++) {
        let currSrc = flights[i].src;
        let isSrcs = false;
        for (var j = 0; j < srcs.length; j++) {
            if (srcs[j] === currSrc) isSrcs = true;
        }
        if (!isSrcs) {
            srcs.push(currSrc);
        }
    }
    console.log('srcs: ', srcs);
    return srcs;
}

function getDests() {
    let flights = getFlightsFromLocalStorage();
    let dests = [];
    // check for doubles within this dropdown.
    for (var i = 0; i < flights.length; i++) {
        let currDest = flights[i].dest;
        let isDests = false;
        for (var j = 0; j < dests.length; j++) {
            if (dests[j] === currDest) isDests = true;
        }
        if (!isDests) {
            dests.push(currDest);
        }
        
    }
    console.log('dests: ', dests);
    
    return dests;
}


// tests:
// getSrcs();
// getDests();
// renderLocations();