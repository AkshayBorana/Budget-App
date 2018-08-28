// First Module Budget Controller module......................................................
var budgetController = (function() {

    var x = 28;
    var add = function(a){
        return x + a;
    }
    //this IIFE will return an object that will have public access, unlike x and add .
    return {
        publicTest: function(b){
            return add(b);
        }
    }
})();

//Second Module UI Controller module...........................................................

var UIController = (function(){
    //some code.................................

})();


// Third Module Controller module..............................................................

var controller = (function(budgetCtrl, UICtrl){

    var z = budgetCtrl.publicTest(5);

    return {
        anotherPublic: function() {
            console.log(z);
        }
    }

})(budgetController, UIController);