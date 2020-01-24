let ref = db.collection("budget").doc("ppZKVuPTGStPWSXrZOaq");

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

  /* 
  db.collection('budget').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
      renderBudget(doc);
    })
  })
  */
 
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
    //this.showBalance();
  }
  //submit budget method
  submitBudgetForm(){
    //console.log('hello it's working');
    const value = this.budgetInput.value;
    if (value ==='' || value <= 0){
      this.budgetFeedback.classList.add('showItem');
      this.budgetFeedback.innerHTML = `<p> value cannot be empty or negative</p>`;
      //const self = this;
      //console.log(this);
      setTimeout(() => {
        this.budgetFeedback.classList.remove("showItem");
      }, 5000);
    }
    else{
      ref.update({budget: parseInt(value)});
      //this.budgetAmount.textContent = value;
      // db.collection("budget").get().then(snapshot =>{
      //   snapshot.docs.forEach(doc =>{
      //     console.log(doc.data().budget);
      //     this.saveBudget(doc);
      //   });
      // });
      const self = this;
      ref.onSnapshot(function(doc) {
        //console.log("Current data: ", doc.data());
        self.showData(doc);
      });
      this.budgetInput.value = '';
      //self.showBalance();
    }
  }
  //show balance 
  //showBalance(){
    //const expense = this.totalExpense();
    // const expense = this.totalExpense();
    // const total = parseInt(this.budgetAmount.textContent) - expense;
  //   this.balanceAmount.textContent = total;
  //   if (total < 0){
  //     this.balance.classList.remove('showGreen', 'showBlack');
  //     this.balance.classList.add('showRed');
  //   }
  //   else if (total > 0){
  //     this.balance.classList.remove('showRed', 'showBlack');
  //     this.balance.classList.add('showGreen');
  //   }
  //   else if (total === 0){
  //     this.balance.classList.remove('showGreen', 'showRed');
  //     this.balance.classList.add('showBlack');
  //   }
  // }
  //showExpenseList(itemList){

  //}
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
      this.addExpense(expense);
      let expValue = parseInt(this.expenseAmount.textContent) + amount;
      
      ref.update({totalExpense: expValue});
      console.log(this.expenseAmount.textContent);
      let balValue = parseInt(this.budgetAmount.textContent) - expValue;
      //console.log(balValue);
      //ref.update({balance: balValue});
      // ref.onSnapshot(function(doc) {
      //   //console.log("Current data: ", doc.data());
      //   self.showData(doc);
      // });
      
      //const total = parseInt(this.budgetAmount.textContent) - expense;
      // ref.onSnapshot(function(doc) {
      //   //console.log("Current data: ", doc.data());
      //   self.showData(doc);
      // });
      // let newExpenseAmount = parseInt(this.expenseAmount.value) + amount;
      // console.log(newExpenseAmount);
      // ref.update({totalExpense: newExpenseAmount});   
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
      //console.log(this.itemList);
      total = this.itemList.reduce((acc, curr) =>{
        //console.log(`Total is ${acc} and current is ${curr.amount}`)
        acc += curr.amount;
        return acc;
      }, 0)
    
      //total = this.itemList
    }
    this.expenseAmount.textContent = total;
    return total;
  }
  //edit expense
  editExpense(element){
    let id = parseInt(element.dataset.id);
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
    //this.showBalance();
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
    //show value
    //this.expenseInput.value = expense[0].title;
    //this.amountInput.value = expense[0].amount;
    //remove from the list
    let tempList = this.itemList.filter((item) =>{
      return item.id !== id;
    })
    this.itemList = tempList;
    //this.showBalance();
    this.expenseAmount.textContent -= expense[0].amount;
    this.balanceAmount.textContent = parseInt(this.balanceAmount.textContent) + expense[0].amount;
    ref.update({balance:  parseInt(this.balanceAmount.textContent)});
    ref.update({totalExpense:  parseInt(this.expenseAmount.textContent)});
  }
}
function eventListeners(){
  const budgetForm = document.getElementById('budget-form');
  const expenseForm = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  //new instance of UI class
  const ui = new UI();
  ref.onSnapshot(function(doc) {
    //console.log("Current data: ", doc.data());
    ui.showData(doc);
  });

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