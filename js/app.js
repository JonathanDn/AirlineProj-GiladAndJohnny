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


const AIRPORTS = ['TLV', 'SYN', 'AUS', 'AUT', 'GER', 'POL', 'JAP', 'USA'];



$(document).ready(()=>{

    renderByPath(location.pathname);

});



function renderByPath(path) {
    switch (path) {
        case '/flights.html':
            Flight.render();
            renderSearchDropDown();
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
    let htmlStr = AIRPORTS.map( loc => `<option value="${loc}"/>` ).join(' ');
    $('#datalist').html(htmlStr);
}

function removeDoublesFromDropDown(value) {
    // if already have the 'dis' class --> remove disabled attr + class 'dis' (RESET)
    $('.dis').attr('disabled', false).toggleClass('dis');

    // onchange --> add disabled attr + class 'dis'
    $(`option[value="${value}"]`).attr('disabled', true).toggleClass('dis');   
}


function searchFlight() {
    let src = $('#srcSearch').val();
    let dest = $('#destSearch').val();
    
    let flights = getFlightsFromLocalStorage();
    console.log(flights);
    let filtered = flights.filter(f => f.src === src && f.dest === dest );
    console.log(filtered);

    renderCards(filtered);
    
}



function getFlightsFromLocalStorage() {
    let flights = Flight.loadJSONFromStorage();
    console.log('flights: ', flights);
    return flights;
}

function renderCards(flights) {

    let cardsHtml = flights.map( f => {
    let strHtml = `<div class="flightCard">
                        <div class="topDateBar">${moment(f.date).format('DD-MM-YYYY')}
                        </div>
                        <div class="midContainer">
                            <div class="pukiLogo"><img class="img-responsive" src="img/pukiLogo.jpg"></div>
                            <div>${f.src}-${f.dest}</div>
                            <div><button onclick="bookFlight(${f.id})" class="btn-warning">Select</button></div>
                        </div>
                    </div>`
    return strHtml;
    }).join(' ');
    $('.cardContainer').html(cardsHtml);
    $(window).animate({scrollTop:$('.cardContainer').offset().top },2000);
}


function bookFlight(fId) {
    // console.log(fId);
    let htmlStr = `<div class="chooseUserCont">
                        <h2>Select User</h2>
                        <div class="selectUserDrop">
                            <label for="userSearch">Select User:</label>
                            <input onchange="updateUserPhoto(value)" class="form-control" 
                                type="text" name="userSearch" id="userSearch" list="userDatalist" 
                                placeholder="Select User"/>
                            <datalist class="here" id="userDatalist"></datalist> 
                        </div>
                        <div class="userImgCont"><img src=""/></div>
                        <button onclick="assignPassenger(${fId})">BOOK</button>
                    </div>` ;
    // reveal pop up
    $('.popupCont').html(htmlStr).css('display','block');
    renderUserSearchDropDown();   
}

// function assignPassenger() {
//     let selectedPassengerName = $('#userSearch').val();
//     console.log('selectedPassengerName: ', selectedPassengerName);
//     let passengers = Passenger.loadJSONFromStorage();
//     // console.log('passengers: ', passengers);
//     for (var i = 0; i < passengers.length; i++) {
//         let userName = $('.here option')[i].value;
        
//         // console.log('userName: ', userName);
//         if (userName === selectedPassengerName) {
//             // passengers.flights.push(passenger Object);
//         }
        
//     }
    
// }


function renderUserSearchDropDown() {
    let users = getFromStorage('passengers');
    console.log(users);
    let usereHtmls = users.map( user => `<option id="${user.id}" value="${user.name}"/>` ).join(' ');
    $('.here').html(usereHtmls);
}


function updateUserPhoto(value) {
    let users = getFromStorage('passengers');
    let user = users.filter( user => user.name === value )[0];
    $('.userImgCont img').attr('src', user.imgSrc);
} 



function assignPassenger(flightId) {
    let inputNameVal = $('#userSearch').val();
    var selectedUserId = $(`option[value="${inputNameVal}"]`).attr('id');
    // console.log(selectedUserId);
    let flights = getFlightsFromLocalStorage();
    let flight = flights.filter(f => f.id === flightId)[0];
    // console.log('flights: ', flights);
    // console.log('flight: ', flight);
    
    let passengers = Passenger.loadJSONFromStorage();
    // console.log('passengers from storage: ', passengers);
    passengers.filter( p => {
        // VERIFY IT'S WORKING THE IF
        // get the passenger selected and push the flight details to he's p object
        if (p.name === inputNameVal ) {
            // console.log('here');

            // Don't push double flights
            // console.log('flight: ', flight);
            for (var i = 0; i < p.flights.length; i++) {
                // console.log('p.flights[i]: ', p.flights[i]);
                if(flight.id === p.flights[i].id) {
                    // console.log('found double');
                    return;
                }
            }
            console.log('p:', p);
            // push the flight to passenger
            p.flights.push(flight);
            // update local storage...
            // saveToStorage('passengers', passengers)
            
        }
    });
}



// function assignPassenger() {
//     let selectedPassengerName = $('#userSearch').val();
    
    
//     console.log('selectedPassengerName: ', selectedPassengerName);
//     let passangers = Passenger.loadJSONFromStorage();
//     // console.log('passangers: ', passangers);
//     for (var i = 0; i < passangers.length; i++) {
//         let userName = $('.here option')[i].value;
        
//         // console.log('userName: ', userName);
//         if (userName === selectedPassengerName) {
//             // passangers.flights.push(passanger Object);
//         }
//     }
// }


// srcs
// function renderLocations() {
//     let srcs = getSrcs();
//     let dests = getDests();
// //   console.log('dropdown srcs',srcs)

//    let srcHtml = srcs.map((src) => {
//              return `<option value="${src}">${src}</option>`
//   }).join(' ');

//   let destHtml = dests.map((dest) => {
//              return `<option value="${dest}">${dest}</option>`
//   }).join(' ');

//   // get elements to show the dropdowns --> show them.
//   $('.selectSrc').html(srcHtml);


//   $('.selectDest').html(destHtml);
// }

// function getSrcs() {
//     let flights = getFlightsFromLocalStorage();
//     // console.log('flights[0].src: ', flights[0].src);
//     let srcs = [];
//     // check for doubles within this dropdown.
//     for (var i = 0; i < flights.length; i++) {
//         let currSrc = flights[i].src;
//         let isSrcs = false;
//         for (var j = 0; j < srcs.length; j++) {
//             if (srcs[j] === currSrc) isSrcs = true;
//         }
//         if (!isSrcs) {
//             srcs.push(currSrc);
//         }
//     }
//     console.log('srcs: ', srcs);
//     return srcs;
// }

// function getDests() {
//     let flights = getFlightsFromLocalStorage();
//     let dests = [];
//     // check for doubles within this dropdown.
//     for (var i = 0; i < flights.length; i++) {
//         let currDest = flights[i].dest;
//         let isDests = false;
//         for (var j = 0; j < dests.length; j++) {
//             if (dests[j] === currDest) isDests = true;
//         }
//         if (!isDests) {
//             dests.push(currDest);
//         }
        
//     }
//     console.log('dests: ', dests);
    
//     return dests;
// }


// tests:
// getSrcs();
// getDests();
// renderLocations();