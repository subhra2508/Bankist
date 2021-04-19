- Number()
- parseINT()
- parseFloat()
- isNaN()
- isFinite()
- isInteger()
- randomInt()
- trunc()
- ceil()
- floor()
- min() , max()
- tofixed()
- BigInt()

- Javascript dates
```js
const future = new Date(2037,10,19,15,23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());//week day
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

console.log(future.toISOString());

console.log(future.getTime());//time passed since the first date 😀

console.log(Date.now());//time stamp for now without creating a new date

future.setFullYear(2040);//set the date
console.log(future);
```

- Intl()
```js
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
``` 
```js
const num = 3884764.23;

//unit,percent,currency can be given in the object
const options = {
  style:'unit',
  unit:'mile-per-hour',
};


console.log('US:',new Intl.NumberFormat('en-US').format(num));
console.log('IND:',new Intl.NumberFormat('en-IN').format(num));
console.log('IND:',new Intl.NumberFormat('en-IN',options).format(num));
```
- setTimeout() //setTimeout(function(),time,...parameters);
- setInterval()