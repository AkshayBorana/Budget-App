// BUDGET CONTROLLER..........................................................................
var budgetController = (function() {})();




// UI CONTROLLER..............................................................................
var UIController = (function() {
  var DOMstrings ={
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  }

  return {
    //1. getInput() this method will read the inputs given by the user.....
    getInput: function() {
      //since the controller will call this method we will return an object containing these values
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will either select "inc+" or "exp-"
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },

    //2. To return DOMstrings since it is also used in th econtroller module.....
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();




// GLOBAL APP CONTROLLER.......................................................................
var controller = (function(budgetCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings();// to get the DOMstrings from the UIController.......

  var ctrlAddItem = function() {
    //1. Get the field input data........
        var input = UICtrl.getInput();
        console.log(input);

    //2. Add the item to the budget controller.......
    //3. Add the item to the UI...........
    //4. Calculate the budget.........
    //5. Display the budget on the UI.............
  };

  // when user clicks the right button......................................
  document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

  // when user presses ENTER key............................................
  document.addEventListener("Keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
