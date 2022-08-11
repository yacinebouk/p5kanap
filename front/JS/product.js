////////////////////////////////////////////////////////////////
// Afficher le produit ////////////////////
////////////////////////////////////////////////////////////////

// On récupere l'id dans l'url
let urlParam = (new URL(location)).searchParams
let productId = urlParam.get("id")


// On récupère les elements pour injecter les infos du produit

const titleId = document.getElementById("title")
const colorId = document.getElementById("colors")
const imgId = document.querySelector(".item__img")
const descriptionId = document.getElementById("description")
const priceId = document.getElementById("price")

// Appel api pour récupérer les infos du produit à afficher

fetch("http://localhost:3000/api/products/" + productId)
    .then((response) => {
        if (response.ok) {
            response.json()
                .then((product) => {
                    // On injecte les infos dans le HTML
                    titleId.innerHTML = `${product.name}`
                    descriptionId.innerHTML = `${product.description}`
                    priceId.innerHTML = `${product.price}`
                    imgId.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`
                    const colorArray = product.colors
                    for (let color of colorArray) {
                        colorId.innerHTML += `<option value="${color}"> ${color}</option>`
                    }


                })


        }

    })

////////////////////////////////////////////////////////////////
// Ajout du produit et ses infos au localstorage ////////////////////
////////////////////////////////////////////////////////////////

// On sélectionne les infos à envoyé au localstorage
const btnAdd = document.querySelector("#addToCart")
const color = document.querySelector("#colors")
const quantity = document.querySelector("#quantity")

// Au clic de btnAdd on ajoute l'objet productOptions au ls avec la fonction addToCart
btnAdd.addEventListener('click', e => {


    if (color.value === "") {
        alert("Veuillez choisir une couleur")
    } else if (quantity.value > 0 && quantity.value < 100) {
        // On définit l'objet à envoyé dans le ls
        const productOptions = {
            id: productId,
            color: color.value,
            quantity: quantity.value,


        }
        // Fonction récupérer dans le fichier localStorage.js
        addToCart(productOptions)

    } else if (quantity.value > 100) {
        alert("Vous ne pouvez pas commander plus de 100 produits par commande")

    }


})


