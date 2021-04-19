'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formateMovementDate = (date,locale) => {
  const calcDaysPassed = (date1,date2) => Math.round(Math.abs(date2-date1)/(1000*3600*24));
  
  const daysPassed = calcDaysPassed(new Date(),date);
  console.log(daysPassed)
  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const years = date.getFullYear();
    // return `${day}/${month}/${years}`;
    return new Intl.DateTimeFormat(locale).format(date);
  
};

const formatCur = (value,locale,currency) => {
  return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value);
};




const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDates = formateMovementDate(date,acc.locale);
    const formattedMov =  formatCur(mov,acc.locale,acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${mov.toFixed(2)}${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out),acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = () => {
  const tick = function(){
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(time%60);

    labelTimer.textContent = `${min}:${sec}`;
   
    if(time === 0){
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }
    time--;
  }
   let time = 300;
   tick();
   const timer = setInterval(tick,1000);
   return timer;
};




///////////////////////////////////////
// Event handlers
let currentAccount,timer;

// // Fake Always Logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// // Experimenting API





btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2,0);
    // const month = `${now.getMonth()+1}`.padStart(2,0);
    // const years = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2,0);
    // const min = `${now.getMinutes()}`.padStart(2,0);
    const now = new Date();
    const options = {
      hour:'numeric',
      minute:'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday:'long',
    };

// const locale = navigator.language

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);

    
    // labelDate.textContent=`${day}/${month}/${years},${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //calling the setInterval() function
    if(timer)clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
    //reset the timer
    clearInterval(timer);
    timer = startLogOutTimer(timer);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);
    
    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);},2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(0.1+0.2===0.3);
// console.log(Number.parseInt('30px',10));
// console.log(Number.parseInt('ef23',10));

// console.log(Number.parseInt(' 2.5rem '));
// console.log(Number.parseFloat(' 2.5rem '));

// console.log(Number.isNaN(20));//false
// console.log(Number.isNaN(+'20X'))
// console.log(Number.isNaN(23/0));

// console.log(Number.isFinite(23/0));

// console.log(Number.isInteger(23));

// console.log(Math.sqrt(25));
// console.log(25 ** (1/2));

// console.log(Math.max(5,18,23,11,2));
// console.log(Math.min(1,2,3,0,5));

// console.log(Math.trunc(Math.random()*6)+1);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const randomInt = (min,max) => Math.trunc(Math.random(max - min) + 1) + min;

// console.log(randomInt(10,20));

// console.log(Math.trunc(22.3));
// //same as
// console.log(Math.round(22.3));

// console.log(Math.floor(23.3));
// console.log("ceil=",Math.ceil(23.9));

// console.log("floor=",Math.floor(23.3));
// console.log("floor@-23.9=",Math.floor(-23.9));

// console.log("trunc=",math.trunc(-23.9));

//Rounding decimals
// console.log((2.7).toFixed(0));//it's always return a string
// console.log((2.745).toFixed(2));

// console.log(+(2.345).toFixed(2));//it's return a Number

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// console.log(Number.MAX_SAFE_INTEGER);

// console.log(1298348348297382948792732794988473878n)//last n to represent BigInt
// console.log(BigInt(1298348348297382948792732794988473878));

// //operations

// console.log(10000n + 10000n);
// console.log(327859823478934n * 237849283748934289384n);

// const huge = 2348165984717408237589345n;

//we can't do
// console.log(Math.sqrt(huge));

//Exceptions
// console.log(20n > 15);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(20n == '20');

// console.log(huge + ' is really big!!!');

// console.log(11n/3n);//answer = 3n ,cut the decimal part
// console.log(10/3);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


//create a Date

// const now = new Date();
// console.log(now);
// console.log(new Date());
// console.log(new Date('December 24, 2015'));

// console.log(new Date(2037,10,19,15,23,5));
// console.log(new Date(2037,10,31));//auto correct the date becoz 10 is nov and nov has no 31st day


// console.log(new Date(0));//0 milisec after unix time
// console.log(new Date(3*24*3600*1000));

//working with dates
// const future = new Date(2037,10,19,15,23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());//week day
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());

// console.log(future.getTime());//time passed since the first date 😀

// console.log(Date.now());//time stamp for now without creating a new date

// future.setFullYear(2040);//set the date
// console.log(future);

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// const future = new Date(2037,10,19,15,23);

// console.log(+future);



// const days1 = daysPassed(new Date(2037,3,14),new Date(2037,3,24));
// console.log(days1);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const num = 3884764.23;

// //unit,percent,currency can be given in the object
// const options = {
//   style:'unit',
//   unit:'mile-per-hour',
//   currency: 'EUR',
//   // useGrouping:false,
// };


// console.log('US:',new Intl.NumberFormat('en-US').format(num));
// console.log('IND:',new Intl.NumberFormat('en-IN').format(num));
// console.log('IND:',new Intl.NumberFormat('en-IN',options).format(num));

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

setTimeout(() => console.log('here is your pizza'),3000);

const ingredients = ['olives','spinach'];

const pizzaTimer = setTimeout((ing1,ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),300,...ingredients);

if(ingredients.includes('spinach'))clearTimeout(pizzaTimer);

//setInterval()

setInterval(() => console.log(new Date()),1000);









