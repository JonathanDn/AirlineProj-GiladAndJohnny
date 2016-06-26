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