var budgetController = (function() {
	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		}else{
			this.percentage = -1;
		}
		
	};

	Expense.prototype.getPercentage = function(){
		return this.percentage;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};
	var calculateTotal = function(type){
		var sum = 0;

		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;

	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		}, 
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			//[1,2,3,4,5] last ID = 6
			//[1,2,4,6,8] last ID = 9
			//Last ID + 1

			//Create new ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			

			//Create new item based on type 'inc' or 'exp'
			if (type === 'exp'){
				newItem = new Expense(ID, des, val);	
			} else if (type === 'inc'){
				newItem = new Income(ID, des, val);	
			};

			// push data into our data structiure
			data.allItems[type].push(newItem);

			//return the new element

			return newItem;
			
		},

		calculateBudget:function(){
			//1. calculate total income and expenses

			
			calculateTotal('inc');
			calculateTotal('exp');

			//2. calculate the budget: Income - expense

			data.budget = data.totals.inc - data.totals.exp;

			//3. percentage of the Income that we spent
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
			}else{
				data.percentage = -1;
			}
			
		},

		calculatePercentages: function(){

			data.allItems.exp.forEach(function(cur){
				cur.calcPercentage(data.totals.inc);

			});

		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(cur){
				return cur.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalIncome: data.totals.inc,
				totalExpense: data.totals.exp,
				percentage: data.percentage
			};

		},

		deleteItem: function(type, id){
			var ids, index, ID;

			ids = data.allItems[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){

				data.allItems[type].splice(index, 1);
			
			}

		},

		
		testing: function(){
			console.log(data);
		}

	};



})();



var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetContainer: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel:'.item__percentage',
		dateLabel:'.budget__title--month'
	};

	var formatNumber = function(num, type){
			var numSplit, integer, dec, type;
		/*

		+ or - before the number

		exactly 2 decimal points

		comma if the number is in thousands

		*/
		num = Math.abs(num);

		num = num.toFixed(2);

		numSplit = num.split('.');

		integer = numSplit[0];

		if(integer.length > 3){
			integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + integer + '.' + dec;
	};

	var nodeListforEach = function(list, callback){
				for(var i = 0; i < list.length; i++){
					callback(list[i], i);
				}
	};


	return{
		getInput: function(){

			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		}, 

		addListItems: function(obj, type) {
			//obj is from ctrlAddItem that creats input and newItem is the object where input item is stored. Here we used that obj as parameter.
			var html, element;

			//create HTML string with placeholder

			if (type === 'inc'){
				element = DOMstrings.incomeContainer;

				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}else if (type === 'exp'){
				element = DOMstrings.expensesContainer; 

				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace HTML string with Actual data

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));



			//Insert the HTML to the DOM
			 
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';

		},

		deleteListItem: function(selectorID){
			var el = document.getElementById(selectorID);

			el.parentNode.removeChild(el);

		},

		clearFields: function(){
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', '+ DOMstrings.inputValue);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array){
				current.value = "";

			});
				fieldsArr[0].focus();


		},
		displayBudget: function(obj){

			var type;

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetContainer).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalIncome,'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExpense, 'exp');

			if(obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}else{
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';	
			}
			


		},

		displayMonth:function(){

			var now, months, month, year;

			now = new Date();

			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

			month = now.getMonth();



			year = now.getFullYear();

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},

		displayPercentage:function(percentages){
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			
			nodeListforEach(fields, function(current, index){
				if (percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				} else{
					current.textContent = '---';
				}

			});
		},

		changedType: function(){
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ', ' +
				DOMstrings.inputDescription + ', '+
				DOMstrings.inputValue);

			nodeListforEach(fields, function(cur){
				cur.classList.toggle('red-focus');

			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},


		getDOMstrings: function(){
			return DOMstrings;
		}
	};

})();



var controller = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function() {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event){

			if(event.which === 13 || event.keycode === 13){

				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

	};
	
	var updateBudget = function(){
		//1. Calculate the budget
		budgetCtrl.calculateBudget();
		//2. Return Budget

		var budget = budgetCtrl.getBudget();
		//3. Display budget on the UI
		UICtrl.displayBudget(budget);
	};
	var updatePercentages = function(){
		//1. calculate percentages
		budgetCtrl.calculatePercentages();
		//2. Read percentages from Budget controller
		var percentages = budgetCtrl.getPercentages();
		//3. Update UI with new percentages
		UICtrl.displayPercentage(percentages);
	};

	var ctrlAddItem = function(){
		var input, newItem;
		//1. Get the field input data

		input = UICtrl.getInput();
		
		if(input.description !== "" && !isNaN(input.value) && input.value > 0){

		//2. Add item to the budget controller

		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		//3. Add item to the UI
		UICtrl.addListItems(newItem, input.type);

		//4. Clear all input data after adding them into UI
		UICtrl.clearFields();

		//5. Calculate and update Budget
		updateBudget();

		//6. calculate and update percentages

		updatePercentages();
		}

	}; 

	var ctrlDeleteItem = function(event){
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		console.log(itemID);

		if(itemID){
			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]); 

		//1. Delete the item from data structure

			budgetCtrl.deleteItem(type, ID);


		//2. Delete the item from UI
			
			UICtrl.deleteListItem(itemID);

		//3. Update and show new budget
			
			updateBudget();
		
		}
	};

	return {
		init: function(){
			console.log('application started');

			UICtrl.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExpense: 0,
				percentage: -1
			});

			UICtrl.displayMonth();
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();












