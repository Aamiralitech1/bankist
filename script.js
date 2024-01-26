'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
console.log(accounts)


// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// App part 

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov} INR</div>
    </div>  
    `
    containerMovements.insertAdjacentHTML("afterbegin", html)

  });
}

// displayMovement(account1.movements);


// UPDATING Total Balance 

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} INR`;
}

// calcPrintBalance(account1.movements);

// ----- Calculate the withdrawal and deposite ammount -----

const calcDisplaySummary = function (acc) {
  const incomeIn = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomeIn} INR`;

  const incomeOut = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(incomeOut)} INR`;

  const intrest = acc.movements.filter(mov => mov > 0).map(deposite => deposite * acc.interestRate / 100).filter(int => int >= 1).reduce((acc, int) => acc + int, 0)

  labelSumInterest.textContent = `${intrest} INR`
}

// calcDisplaySummary(account1.movements)

// ----- User Create ------

const createUserName = function (accs) {

  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUserName(accounts);
// console.log(accounts);

// ------- Implementing Login Functinality --------

const updateUI = function (currentAccount) {
  // Display Movements
  displayMovement(currentAccount.movements);
  // Display Balance
  calcDisplayBalance(currentAccount);
  // Display Summary
  calcDisplaySummary(currentAccount);
}

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.username);
  console.log(currentAccount)

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Empty the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // this will blur the focus filed cursor will not show

    // Update UI 
    updateUI(currentAccount);

  }
});

// Transfer amount to another user

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferTo.value = inputTransferAmount.value = '';

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

// ----- Close Account ------

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    inputCloseUsername.value = inputClosePin.value = '';
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

// ------ Request a Loan -------

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

// Sorting Movements 

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// array slice method

const arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2)) // this will creat a new array ['c', 'd', 'e']
console.log(arr.slice(2, 4)) // this will creat a new array ['c', 'd'] not include 4
console.log(arr.slice(-2)); // this will creat a new array ['d', 'e']
console.log(arr.slice(1, -2)); // this will creat a new array ['b', 'c'] not include last 2

// SPLICE Method

console.log(arr.splice(2)); // This will change the original array this will remove the item from original array and create a new array
console.log(arr)


// REVERSE Method

const arr2 = ['j', 'm', 'k', 'n', 'l'];
console.log(arr2.reverse())

// CONCAT Method to join two arrays
const letters = arr.concat(arr2);
console.log(letters)

// JOIN Method

console.log(arr.join('-')); // This will produce the result like a-b-c-d-e;

// -------------Javascript MAP FILTER REDUCED----------------

// MAP Method

const movementsList = [200, 400, 150, 450, 250];

const euroToUsd = 1.1;

const movementUSD = movementsList.map(move => move * euroToUsd);

console.log(movementsList);
console.log(movementUSD);

// const movDescription = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1} deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1} withdraw ${Math.abs(mov)}`;
//   };
// });
console.log('-------MAP--------')
const movDescription = movements.map((mov, i) =>
  `Movement ${i + 1} You ${mov > 0 ? 'deposited' : 'withdrew'}  ${mov}`)

console.log(movDescription);


// FILTER Method

const deposite = movements.filter(function (mov) {
  return mov > 0
});

console.log(deposite);

const withdrawal = movements.filter(mov => mov < 0);
console.log(withdrawal)

// -- for of mehtod --
const depositFor = [];

for (const mov of movements) if (mov > 0) {
  depositFor.push(mov)
}

console.log(depositFor)

// --- REDUCE Method ---
// const balance = movements.reduce((accumulator, firstItemOfArray) => accumulator + firstItemOfArray, 0) // 0 means accumalter eqaul to 0)
// console.log(balance)

// find  maximum value 


const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

console.log(max)


// ---- Find Method in Javscript is like filter method the only difference is return only a single elements which is matches the condition and fileter retun the whole array

const firtsWithDrawal = movements.find(mov => mov < 0);
console.log(movements)
console.log(firtsWithDrawal)

// ----- Some and Every Method -----

// for equality check we use includes method
console.log(movements.includes(200)); // This will return true

// for condition check we use some method

console.log(movements.some(mov => mov > 200)); // This will also return true and we can pass condition as well


// Every Method : If all the conditions pass the test then return true

console.log(movements.every(mov => mov > 0)); // It will return false because in this array there is also a negative values which is offcourse less then 0 

console.log(account4.movements.every(mov => mov > 0)); // This is return true because in this array all the values greater then 0 all vlaues need to be passe the condition


// ----- flat and flatMap methods -----

// flat method can use to adjust arrays in on single or main array , we can assgin level for that

const anArr = [[1, 2, 3], 4, 5, 6, [7, 8, 9, 10]];

const deepArr = [[1, [2, 3]], 4, 5, 6, [7, [8, 9, 10]]];

console.log(anArr.flat()); // this will return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(deepArr.flat()); // this will return [[1, 2, 3], 4, 5, 6, [7, 8, 9, 10]] on level up
console.log(deepArr.flat(2)); // this will return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] 2 level up

const overAllBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0)
console.log(overAllBalance);


// flatMap method : this is used for only one level up

const overAllBalance2 = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0)
console.log(overAllBalance2);


// ------ Sorting arrya method -------

const owner = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owner.sort()); // this will sort the array like ['Adam', 'Jonas', 'Martha', 'Zach'] and also mutate the original array as well

// Sorting number is little bit different 
console.log(movements);

// return < 0 then a before b
// return > 0 then b before a

movements.sort((a, b) => {
  if (a < b) return 1
  if (a > b) return -1
})

console.log(movements)




