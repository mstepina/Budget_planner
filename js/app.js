/*

Simple one-user budget web application.
Stack: JavaScript, jQuery, bootstrap.
Data storage : Firebase/ Firestore
Main functionality: 
 - adding/changing budget
 - creating the list of expenses
 - calculating total expenses and balance
 - editing and deleting expenses
 - saving all the changes in the app

*/

//reference to the document to store all the data
let ref = db.collection("budget").doc("ppZKVuPTGStPWSXrZOaq");

// one and only class to manipulate all the data
class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
 //show data from the database
  showData(doc){
    this.budgetAmount.textContent = doc.data().budget;
    this.expenseAmount.textContent = doc.data().totalExpense;
    this.balanceAmount.textContent = doc.data().budget - doc.data().totalExpense;
    ref.update({balance: parseInt(this.balanceAmount.textContent)})
    let total = this.balanceAmount.textContent;
    if (total < 0){
      this.balance.classList.remove('showGreen', 'showBlack');
      this.balance.classList.add('showRed');
    }
    else if (total > 0){
      this.balance.classList.remove('showRed', 'showBlack');
      this.balance.classList.add('showGreen');
    }
    else if (total === 0){
      this.balance.classList.remove('showGreen', 'showRed');
      this.balance.classList.add('showBlack');
    }
    this.itemID = doc.data().itemID;
  }
  // show expenses when refreshing the page
  dataExpenses(doc){
    this.itemList = doc.data().expenses;
    let i = this.itemList.length;
    while(i > 0) {
      i--;
      this.addExpense(this.itemList[i]);
    }
  }
  //submit budget method
  submitBudgetForm(){
    const value = this.budgetInput.value;
    if (value ==='' || value <= 0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p> value cannot be empty or negative</p>`;
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 5000);
    }
    else{
      ref.update({budget: parseInt(value)});
      this.budgetInput.value = '';
      let self = this;
      ref.get().then(function(doc){
        if(doc.exists){
          self.showData(doc);
        }else{
          self.budgetFeedback.classList.add('showItem');
          self.budgetFeedback.innerHTML = `<p> Connection error: please refresh the page</p>`;
        }
      })
    }
  }
  //submit expense form
  submitExpenseForm(){
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === '' || amountValue === '' || amountValue <= 0){
      this.expenseFeedback.classList.add('showItem');
      this.expenseFeedback.innerHTML = `<p> values cannot be empty or negative</p>`;
      setTimeout(() => {
        this.expenseFeedback.classList.remove("showItem");
      }, 5000);
    }
    else{
      let amount = parseInt(amountValue);
      this.expenseInput.value = '';
      this.amountInput.value = '';
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      this.itemID++;
      this.itemList.push(expense);
      let newID = this.itemID;
      ref.update({itemID: newID});
      let expValue = parseInt(this.expenseAmount.textContent) + amount;    
      ref.update({totalExpense: expValue});
      ref.update({expenses: this.itemList});
      let balValue = parseInt(this.budgetAmount.textContent) - expValue;
      ref.update({balance: balValue});
      let self = this;
      ref.get().then(function(doc){
        if(doc.exists){
          self.showData(doc);
        }else{
          self.expenseFeedback.classList.add('showItem');
          self.expenseFeedback.innerHTML = `<p> Connection error: please refresh the page</p>`;
        }
      })
      this.addExpense(expense);
      console.log(this.itemList.textContent);
    }
  }
  //add expense
  addExpense(expense){
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
    `
    this.expenseList.appendChild(div);
  }
  //total expense
  totalExpense(){
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce((acc, curr) =>{
        acc += curr.amount;
        return acc;
      }, 0)
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense
  editExpense(element){
    let id = parseInt(element.dataset.id);
    console.log(id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);
    
    let expense = this.itemList.filter((item) =>{
      return item.id === id; // returns an array with the edited item(one)
    })
    //show value
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //remove from the list
    let tempList = this.itemList.filter((item) =>{
      return item.id !== id;
    })
    this.itemList = tempList;
    this.expenseAmount.textContent -= this.amountInput.value;
    this.balanceAmount.textContent = parseInt(this.balanceAmount.textContent) + parseInt(this.amountInput.value);
  }
  //delete expense
  deleteExpense(element){
    let id = parseInt(element.dataset.id);
    let parent = element.parentElement.parentElement.parentElement;
    //remove from DOM
    this.expenseList.removeChild(parent);

    let expense = this.itemList.filter((item) =>{
     return item.id === id; // returns an array with the edited item(one)
    })
    let tempList = this.itemList.filter((item) =>{
      return item.id !== id;
    })
    this.itemList = tempList;
    this.expenseAmount.textContent -= expense[0].amount;
    this.balanceAmount.textContent = parseInt(this.balanceAmount.textContent) + expense[0].amount;
    ref.update({balance:  parseInt(this.balanceAmount.textContent)});
    ref.update({totalExpense:  parseInt(this.expenseAmount.textContent)}); 
    ref.update({expenses: this.itemList});
  }
}
function eventListeners(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //new instance of UI class
  const ui = new UI();
  ref.get().then(function(doc){
    ui.showData(doc);
    ui.dataExpenses(doc);
  })

  //budget form submit
  budgetForm.addEventListener('submit', function(event){
    event.preventDefault(); // prevent form automatically submitting
    ui.submitBudgetForm();
  })

  //expense form submit
  expenseForm.addEventListener('submit', function(event){
    event.preventDefault();
    ui.submitExpenseForm();
  })

  //expense list click
  expenseList.addEventListener('click', function(event){
    if(event.target.parentElement.classList.contains('edit-icon')){
      ui.editExpense(event.target.parentElement);
    }
    else if(event.target.parentElement.classList.contains('delete-icon')){
      ui.deleteExpense(event.target.parentElement);
    }
    
  })
}
document.addEventListener('DOMContentLoaded', function(){
  eventListeners();
})