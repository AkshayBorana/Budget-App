// BUDGET CONTROLLER..........................................................................
let budgetController = (function () {
  // making custom objects for "expense" and "income"..............................................

  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // calculates the percentage..............
  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }

    // returns the percentage...............
    Expense.prototype.getPercentage = function () { };
    return this.percentage;
  };

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // creating data structure........................................................................
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1 // -1 means something is not exsistent.......................
  };

  // to calculate total income or total expense..........................

  let calculateTotal = function (type) {
    let sum = 0;

    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });

    // adding the sum to the data structure depending on the type i.e inc or expense......
    data.totals[type] = sum;
  };

  return {
    // this method will add an item whethr its income or expense.................................................
    addItem: function (type, des, val) {
      let newItem, ID;

      //[1,2,3,4,5] next Id = 6;
      //[1,2,4,6,8] next Id = 9;
      // How to get id for new itme.................................................................
      //ID = last ID + 1.............................................................................
      // ".id" to get the last id....................................................................\

      if (data.allItems[type].length > 0) {
        //creating new ID...............................................................
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // cvreating new item based on "inc" or "exp" type...............................
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // after adding Items lets store it in our database...........................................................
      data.allItems[type].push(newItem); //if the type === inc the we will store in the inc[array] else expense[array]......

      //return the new element................................................................
      return newItem; // so that we can use it elsewhere...........................................................
    },

    deleteItem: function (type, id) {
      let ids, index;

      // id = 6
      //data.allItems[type][id];
      //ids = [1,2,4,6,8];
      //index = 3;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        // if index is not equal to 1 then delete.......... for -1 index means itme not found

        data.allItems[type].splice(index, 1); // just delete 1 itme so 1......
      }
    },

    //Creating a public method to calculate budget.................................

    calculateBudget: function () {
      //1. calculate total income and budget........
      calculateTotal("inc");
      calculateTotal("exp");

      //2.  calculate the budget: income - budget......
      data.budget = data.totals.inc - data.totals.exp;

      //3.calculate the percentage of income that we spent.......
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        // console.log("percentage:" + data.percentage);
      } else {
        data.percentage = -1;
      }
    },

    //Calculate percentages................................

    calculatePercentages: function () {
      /*
      a=20,
      b=10
      income= 100
       a = 20/100 = 20%
       b= 10/100 = 10%
       */

      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
    },

    // method to retun the calculateBudget()...............

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
      // console.log("percentage" + this.getBudget.percentage);
    },

    // to check out data base , just for testing purpose.........................................................
    testing: function () {
      console.log(data);
    }
  };
})();

// UI CONTROLLER..............................................................................
let UIController = (function () {
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item-percentage",
    dataLabel: ".budget__title--month"
  };

  return {
    //1. getInput() this method will read the inputs given by the user.....
    getInput: function () {
      //since the controller will call this method we will return an object containing these values
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will either select "inc+" or "exp-"
        description: document.querySelector(DOMstrings.inputDescription).value,
        //converting a sting number into number.............
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    //2. To return DOMstrings since it is also used in the controller module.....
    getDOMstrings: function () {
      return DOMstrings;
    },

    //3. obj is the object that we get from newItem.................................................
    addListItem: function (obj, type) {
      let html, newHtml, element;

      //1. Creating HTML string with placeholder text................................................
      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%">  <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
      }

      //2. Replacing the place holder text with some actual data........................................
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      //3. insert html into DOM using insetrAdjacentHtml property.......................................

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    //4. To clear the fields, once the user has entered values..........
    clearFields: function () {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );

      // Method to convert list into an array.............
      fieldsArr = Array.prototype.slice.call(fields);

      //using forEach() to loop an array................
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      //To set the focus back to the Description field..........
      fieldsArr[0].focus();
    },

    //5. To display the budget, total income, total expense and percentage in the UI.............
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "--";
      }
    },

    //6. To delete items from UI............................................

    deleteListItem: function (selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    //7. To display % on each expense in the UI..............................
    displayPercentages: function (percentages) {

      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function (current, index) {

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "--";
        }
      });



    },

    // To display current month.................................................
    displayMonth: function() {
      let now, year, months;

      months = ['January', 'February', 'March', 'April', 'May', 'June', "July","August", "September","October", "November", "December"];
      now =  new Date();
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dataLabel).textContent = months[month] + ' ' +year;
    }

  };
})();

// GLOBAL APP CONTROLLER.......................................................................
let controller = (function (budgetCtrl, UICtrl) {
  // making a function in which we will ad  all the event listeners
  setupEventListeners = function () {
    let DOM = UICtrl.getDOMstrings(); // to get the DOMstrings from the UIController.......

    // when user clicks the right button......................................
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    // when user presses ENTER key............................................
    document.addEventListener("Keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    //To remove items from expense or income by using event delegation.................
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  let updateBudget = function () {
    //1. Calculate the budget.........
    budgetCtrl.calculateBudget();

    //2. return the budget.........
    // since we are returning something so we will store it in a variable.......
    let budget = budgetCtrl.getBudget();
    console.log(budget);
    //   /home/akshay/Desktop/Budget-App/index.html
    //3. Display the budget on the UI.............
    UICtrl.displayBudget(budget);
  };

  // To update percentages...............
  let updatePercentages = function () {
    //1.Calculate percentage............
    budgetCtrl.calculatePercentages();
    //2.Read percentages from the budget controller.........
    let percentages = budgetCtrl.getPercentages();
    //3.Update the UI with the new percentages............
    UICtrl.displayPercentages(percentages)
  };

  let ctrlAddItem = function () {
    let input, newItem;

    //1. Get the field input data........
    input = UICtrl.getInput();
    console.log(input);

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller.......
      newItem = budgetCtrl.addItem(input.type, input.description, input.value); //since it return an item so we store it in newItem

      //3. Add the item to the UI...........
      UICtrl.addListItem(newItem, input.type);

      //4. to clear the fields.......
      UICtrl.clearFields();

      //5. Calculate and Update budget.......
      updateBudget();

      //6.Calculate and update percentages........
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (event) {
    let itemID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // if itmeID is true then..........................
      splitID = itemID.split("-");
      type = splitID[0]; //putting "inc" or "exp" in the type........
      ID = parseInt(splitID[1]); // 0,1,2,3,4,5................................

      //1. DElete the item fro the data structure........
      budgetCtrl.deleteItem(type, ID);

      //2. Delete the item from UI.......................

      UICtrl.deleteListItem(itemID);
      //3. Update and show the new budget................
      updateBudget();

      //4. calculate and update percentages............
      updatePercentages();
    }
  };

  //  make an init( that inititalises the app, also we want to acces it from outside so we will return it.).................
  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });

      //  i'll call the setupEventListeners function here...........................................................
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// the event listeners are only going to be setup as soon as we call the init(), so lets call it here...................
controller.init(); // with out this line of code nothing is going to ever happen........................................
