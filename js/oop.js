'use strict';


const greet = function(from, to, greeting) {
    console.log('from: ', from, 'to:', to, 'greeting:', greeting);
}

const yaronGreet        = greet.bind(null, 'Yaron');
const yaronToYuvalGreet = greet.bind(null, 'Yaron', 'Yuval');


greet('Yaron', 'Daniel', 'Halha!');
yaronGreet('Tsafrir', 'Huhu!');
yaronToYuvalGreet('Boker Tov!');

let person = {
    name: 'Shaul',
    car: null,
    drive: function()  {
        
        if (!!this.car) {
            this.speak('Car', 'Lets Go');
            console.log('Driving my car!', this.car);
        } else {
            console.log('Just walking here...');
            
        }
    },
    speak: function(to, greeting="JUST HELLO"){
        console.log('from: ', this.name, 'to:', to, 'greeting:', greeting);
    }
    
};
//yo!

person.car = {model: 'Audi'};
person.drive();


// Shallow / Deep copy
const isDeep = true;
var person2 = $.extend(true, {}, person );

// Another way to deep copy an object - only Data!
// var person2 = JSON.parse(JSON.stringify(person));

person2.name = 'Arik';
person2.car.model = 'Subaru';
person2.drive();

console.log('person1', person);
console.log('person2', person2);


// Deep copy



// let person2 = person;
// person2.car = {model: 'Fiat'};
// person2.drive();




// person.name = 'Baba';
// person.speak('Batra', 'Hi there!');
// var speakFunc = person.speak.bind({name: 'Lala'}, 'Shuki');
// speakFunc();



