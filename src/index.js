const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollectionEl = document.querySelector('#toy-collection')
const toyName = document.querySelector('#input-one')
const toyImage = document.querySelector('#input-two')
const state = {
  toys: []
}
let addToy = false

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})
// server stuff
let getToys = () => {
  return fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
}

let persistNewToy = (newToy) => {
  return fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify(newToy)
  })
}

let increaseToyLikes = (toy) => {
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers:{
      'Content-type':'application/json'
    },
    body: JSON.stringify({
      likes: toy.likes
    })
  })
}

// render toys

let showToy = (toy) => {
  let cardEl = document.createElement('div')
  cardEl.className = 'card'
  cardEl.innerHTML =
  `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p>${toy.likes} Likes </p>
  <button class="like-btn" id="${toy.id}">Like <3</button>
  `
  toyCollectionEl.appendChild(cardEl)
}

let showToys = () => {
  toyCollectionEl.innerHTML = ''
  state.toys.forEach(toy => showToy(toy))
}

// new toy

let createToy = (name, image) => {
  let newToy = {name: name, image: image, likes: 0}
  persistNewToy(newToy)
  .then(getToys)
  .then(toys => state.toys = toys)
  .then(showToys)
}

// increase toy likes

let incrementLikes = (toyId) => {
  let toy = state.toys.find(toy => toy.id === toyId)
  toy.likes++
  increaseToyLikes(toy)
  .then(showToys)
}

// app handler

let listenToBody = () => {
  document.body.addEventListener('click', eve => {
    console.log(eve)
    if (eve.target.className === 'submit') {
      eve.preventDefault()
      createToy(toyName.value, toyImage.value)
    }
    if (eve.target.className === 'like-btn') {
      incrementLikes(parseInt(eve.target.id))
      
    }
  })
}

// init(app start up)
let initialise = () => {
  getToys()
  .then(toys => state.toys = toys)
  .then(showToys)
  .then(listenToBody)
}

initialise()