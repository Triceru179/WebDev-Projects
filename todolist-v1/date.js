exports.getDate = function(){

        let today = new Date().toLocaleString('en-us', {  weekday: 'long', day: "numeric"});
        return today;
    };

exports.getTry = function(){
        return console.log("hello!");
    }