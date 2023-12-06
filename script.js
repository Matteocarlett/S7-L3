const booksColumn = document.querySelector("#booksColumn")
const shoppingCart = document.querySelector("#shopping-cart")

let libri = []
let shoppingCartList = JSON.parse(localStorage.getItem("shoppingCart")) || []

window.onload = () => {
    shopBooks()
    booksColumn.addEventListener('click', handleButtonClick)
}

const handleButtonClick = (event) => {
    const target = event.target

    if (target.classList.contains('btn-success')) {
        addToCart(event, target.dataset.asin)
    } else if (target.classList.contains('btn-danger')) {
        skipMe(event)
    }
}

const shopBooks = () => {
    fetch("https://striveschool-api.herokuapp.com/books")
        .then(resp => resp.json())
        .then(books => {
            displayBooks(books)
            libri = books
        })
        .catch(err =>
            console.error(err.message)
        )
}

function displayBooks(books) {
    booksColumn.innerHTML = ""

    books.forEach((book) => {
        let bookShopped = shoppingCartList.some(cartBook => cartBook.title === book.title)

        booksColumn.innerHTML += `
        <div class="col">
            <div class="card h-100 ${bookShopped ? 'selected' : ''}">
                <img src="${book.img}" class= alt="${book.title}">
                <div class="card-body">
                    <p class="fw-bold">${book.title}</p>
                    <p class="badge bg-warning p-2">${book.category}</p>
                    <p class="fs-3 fw-bold">${book.price}€</p>
                    <div>
                        <button class="btn btn-success p-2 fs-5" data-asin="${book.asin}">Compra ora</button>
                        <button class="btn btn-danger p-2 fs-5">Scarta</button>
                    </div>
                </div>
            </div>
        </div>`
    })
}

const skipMe = (event) => {
    event.target.closest('.col').remove()
}

const addToCart = (event, asin) => {
    const book = libri.find((book) => book.asin === asin)
    shoppingCartList.push(book)
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCartList))

    event.target.closest(".card").classList.add("selected")
}
