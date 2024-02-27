'use strict';

// document.querySelector('.buy--plain').addEventListener('click', function (e) {
//     e.preventDefault();

//     let value = parseInt(document.querySelector('.itemValue').value);
//     console.log(value++);

//     document.querySelector('.itemValue').value = value;

// })
document.querySelector('.btn').addEventListener('click', function () {
    document.querySelector('.tapped').classList.remove('hidden');
    document.querySelector('.overlay').classList.remove('hidden');

});

document.querySelector('.close').addEventListener('click', function () {
    document.querySelector('.tapped').classList.add('hidden');
    document.querySelector('.overlay').classList.add('hidden');
});


let username = ''

const sliceList = "Sayyed Amair ALi".split(" ").map(name => name[0]).join('');

username = sliceList

console.log(username)