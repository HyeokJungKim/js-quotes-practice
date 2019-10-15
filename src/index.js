// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quotesUL = document.getElementById("quote-list")
let newQuotesForm = document.getElementById('new-quote-form')

fetch("http://localhost:3000/quotes?_embed=likes")
  .then(r => r.json())
  .then((responseObj) => {
    responseObj.forEach((quote) => {
      takeOneJSONToLI(quote)
    })
  })

// {} -> <li data-id="2"></li>
function takeOneJSONToLI(quote) {
  quotesUL.innerHTML += `
  <li id="quote-${quote.id}" class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
      <button data-id="${quote.id}" class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  `


  // // ANOTHER POTENTIAL WAY

  // let newLi = document.createElement("li")
  // newLi.id = `quote-${quote.id}`
  // newLi.className = 'quote-card'
  //
  // newLi.innerHTML += `
  //   <blockquote class="blockquote">
  //     <p class="mb-0">${quote.quote}</p>
  //     <footer class="blockquote-footer">${quote.author}</footer>
  //     <br>
  //     <button data-id="${quote.id}" class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
  //     <button data-id="${quote.id}" class='btn-danger'>Delete</button>
  //   </blockquote>
  // `
  //
  // quotesUL.append(newLi)
  //
  // let likeBtn = newLi.querySelector(".btn-success")
  // likeBtn.addEventListener("click", (evt) => {
    // // Blah blah blah
  // })
  // let deleteBtn = newLi.querySelector(".btn-danger")

}

quotesUL.addEventListener("click", (evt) => {
  if (evt.target.className === "btn-danger") {
    // DELETE
    let id = evt.target.dataset.id
    // evt.target["dataset"].id
    // evt.target.getAttribute("data-id")

    // Manipulation of the DOM happens out the then is Optimistic
    let li = document.querySelector(`#quote-${id}`)
    li.remove()

    fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
      // Manipulation of the DOM happens in the then is Pessimistic

      // evt.target.parentElement.parentElement.remove()

      // let li = document.querySelector(`#quote-${id}`)
      // li.remove()
    })



  }
  if (evt.target.className === "btn-success") {
    // Like
    let id = evt.target.dataset.id

    fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: parseInt(id)
      })
    })
    .then(res => res.json())
    .then((response) => {
      let spanTag = evt.target.querySelector("span")
      let newLike = parseInt(spanTag.innerText) + 1
      spanTag.innerText = newLike
    })





  }
  if (evt.target.tagName === "SPAN") {
    let id = evt.target.parentElement.dataset.id
  }
})

newQuotesForm.addEventListener("submit", (evt) => {
  evt.preventDefault()

  let newQuote = evt.target["new-quote"].value
  let newAuthor = evt.target["author"].value

  fetch(`http://localhost:3000/quotes`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      author: newAuthor,
      quote: newQuote
    })
  })
  .then(res => res.json())
  .then((quoteObj) => {

    quoteObj.likes = []
    takeOneJSONToLI(quoteObj)
  })


})
















//
