// Budget Controller

const budgetController = (function () {
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.calcPercentages = function (totalIncome) {
    this.percentage = totalIncome > 0 ? 'Math.round((this.value / totalIncome) * 100)' : '-1';
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  const data = {
    allItems: {
      income: [],
      expense: [],
    },

    totals: {
      income: [],
      expense: [],
    },

    budget: 0,
    percentage: -1, // for purpose of non existenece when income and expense is nothing.
  };

  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      // Creating a new ID

      // ID = last ID + 1;
      //checking if length is more than 0 or not
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Creating a new Item
      if (type === 'income') {
        newItem = new Income(ID, des, val);
        // data.allItems.type.income.push(newItem);
      } else if (type === 'expense') {
        newItem = new Expense(ID, des, val);
        // data.allItems.type.expense.push(newItem);
      }

      // Push it to a data structure
      data.allItems[type].push(newItem);

      //return a new Element
      return newItem;
    },

    deleteItem: function (type, id) {
      // id =6;
      // data.allItems[type][id];
      // ids = [1,2,4,6];
      // index = 3;

      const ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      const index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    claculateBudget: function () {
      // calculating total income and expense
      calculateTotal('income');
      calculateTotal('expense');

      // calculating income - expense
      data.budget = data.totals.income - data.totals.expense;

      // calculate the percent of expense
      if (data.totals.income > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.expense.forEach(function (current) {
        current.calcPercentage(data.totals.income);
      });
    },

    getPercentages: function () {
      // assume that we have 5 items in Expense:[], then we rare calling getPercentage() , 5 times and string the result in allPercentages.
      const allPercentages = data.allItems.expense.map((current) => {
        return current.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentage,
      };
    },
  };
})();

// UI Controller

const UIController = (function () {
  // private object
  const DOMStrings = {
    container: '.container',
    inputType: '.add-type',
    inputDescription: '.add-description',
    inputValue: '.add-value',
    addButton: '.add-btn',
    incomeList: '.income-list',
    expenseList: '.expenses-list',
    budgetValue: '.budget-value',
    totalIncomeValue: '.budget-income-value',
    totalExpenseValue: '.budget-expenses-value',
    pecentageValue: '.budget-expenses-percentage',
    expensePercentage: '.item-percentage',
    monthLabel: '.budget-title-month',
  };

  const formatNumber = function (num, type) {
    var num, type;
    num = Math.abs(num);
    num = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return (type === 'income' ? '+' : '-') + ' ' + num;
  };

  return {
    getInputs: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: +document.querySelector(DOMStrings.inputValue).value,
      };
    },

    get domStrings() {
      // making DOMStrings public for use in another controller
      return DOMStrings;
    },

    addListItems: function (obj, type) {
      let html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'income') {
        element = DOMStrings.incomeList;

        html =
          '<div class="item clearfix" id="income-id%"> <div class="item-description">description%</div><div class="right clearfix"><div class="item-value">value%</div><div class="item-delete"><button class="item-delete-btn"><i class="far fa-times-circle"></i></button></div></div></div>';
      } else if (type === 'expense') {
        element = DOMStrings.expenseList;

        html =
          '<div class="item clearfix" id="expense-id%"><div class="item-description">description%</div><div class="right clearfix"><div class="item-value">value%</div><div class="item-delete"><button class="item-delete-btn"><i class="far fa-times-circle"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('id%', obj.id);
      newHtml = newHtml.replace('description%', obj.description);
      newHtml = newHtml.replace('value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      let inputFields, fieldsArray;

      inputFields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

      // querySelectorAll() always returns a list and we can convert it to array
      fieldsArray = Array.from(inputFields).slice.call(inputFields);

      fieldsArray.forEach((current) => {
        current.value = '';
      });
      // bring cursor in first input field.
      fieldsArray[0].focus();
    },

    deleteListItem: function (selectorId) {
      const element = document.getElementById(selectorId);
      element.parentNode.removeChild(element);
    },

    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? type = 'income' : type = 'expense';
      document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.totalIncomeValue).textContent = formatNumber(obj.totalIncome, 'income');
      document.querySelector(DOMStrings.totalExpenseValue).textContent = formatNumber(obj.totalExpense, 'expense');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.pecentageValue).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.pecentageValue).textContent = '---';
      }
    },

    displayPercentages: function (percentages) {
      const nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(percentageFields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = ' ';
        }
      });
    },

    displayMonth: function () {
      const today = new Date();
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = today.getMonth();
      const year = today.getFullYear();

      const label = document.querySelector(DOMStrings.monthLabel);
      label.textContent = months[month] + ',' + ' ' + year;
    },
  };
})();

//Global app-Cotroller

const appController = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.domStrings;
    const addButton = document.querySelector(DOM.addButton);
    addButton.addEventListener('click', controlAddItem);

    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        // console.log('Enter was pressed');
        e.preventDefault();
        controlAddItem();
      }
    });

    const container = document.querySelector(DOM.container);
    container.addEventListener('click', contorlDeleteItem);
  };

  const updateBudget = function () {
    // calculating the budget
    budgetCtrl.claculateBudget();

    // returning the budget
    const budget = budgetCtrl.getBudget();
    console.log(budget);

    // Display the budget in UI
    UICtrl.displayBudget(budget);
  };

  const updatePercentage = function () {
    // Calculate Percentage
    budgetCtrl.calculatePercentages();

    // get the percentage from budget controller
    const percentages = budgetCtrl.getPercentages();

    // Update the UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  const controlAddItem = function () {
    let input, newItem;
    input = UICtrl.getInputs();
    // console.log(input);

    if (input.value) {
      // add newItem to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //add newItem to the UI via addListItems()
      UICtrl.addListItems(newItem, input.type);

      // clear the fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudget();
    }
  };

  const contorlDeleteItem = function (e) {
    const itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      const splitID = itemID.split('-'); // it will give you an array of strings.
      // 1st will be type, 2nd will be id.
      const type = splitID[0];
      const ID = +splitID[1]; // here we are getting strings from splitID, so we have to convert to a number.

      // delete the item from data
      budgetCtrl.deleteItem(type, ID);

      // delete the item from UI
      UICtrl.deleteListItem(itemID);

      // Update and show the budget
      updateBudget();

      // Calculate and Update percentages
      updatePercentage();
    }
  };

  return {
    init: function () {
      UICtrl.displayMonth(),
        UICtrl.displayBudget({
          budget: 0,
          totalIncome: 0,
          totalExpense: 0,
          percentage: 0,
        });
      setupEventListeners();
    },
  };
})(budgetController, UIController);

appController.init();
