const weatherForm = document.querySelector('form')
const searchInput = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

weatherForm.addEventListener('submit', (e) => {
 e.preventDefault();
 
 const location = searchInput.value;

 messageOne.textContent = 'Loading... Please wait'
 messageTwo.textContent = ''
 const url = 'http://localhost:3000/weather?address=' + encodeURIComponent(location);

 fetch(url).then((response) => {
    response.json().then(({error,...data}= {})=> {
        if (error) {
            return messageOne.textContent = error;
        }
        messageOne.textContent = data.location;
        messageTwo.textContent = data.forecast;
    })
})


})