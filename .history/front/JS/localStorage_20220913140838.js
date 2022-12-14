////////////////////////////////////////////////////////////////
// Fonction lié au local storage : ////////////////////
////////////////////////////////////////////////////////////////


const storageAccess = localStorage

//////  Récupérer le tableau des produits présent dans le localstorage //////
function getProductsFromLocalStorage() {
    const products = storageAccess.getItem("productCart")
    if (!products) {
        return {}
    }
    return JSON.parse(products)
}

///////  Mettre à jour les produis présent dans le localstorage ///////
function updateLocalStorage(products) {
    storageAccess.setItem("productCart", JSON.stringify(products))
}

/////// Ajouter les produits au localStorage ////////
function addToCart(product) {
    // On récupère les produits du ls
    let products = getProductsFromLocalStorage()
    const quantity = document.querySelector("#quantity")

    // Si l'id du produit est déjà présent dans le ls
    if (products[product.id]) {
        //Si même id et même color alors on additionne la quantité
        if (products[product.id][product.color]) {
            products[product.id][product.color] = parseInt(products[product.id][product.color]) + parseInt(quantity.value)

        } else {
            products[product.id][product.color] = parseInt(quantity.value)

        }
    }
    // S'il n'y a pas de produit avec le même id, on injecte tout
    if (!products[product.id]) {
        products[product.id] = {
            [product.color]: parseInt(quantity.value)
        }
    }
    console.log(products)
    updateLocalStorage(products)

}

////// Supprimer un produit du ls ///////
function removeProductFromLs(id, color) {
    let products = getProductsFromLocalStorage()
        // Si on trouve le même id et la même color
    if (products[id][color]) {
        // Si il y a plus d'une itération, on supprime seulement la color
        if (Object.keys(products[id]).length > 1) {
            delete products[id][color]

            //Sinon on supprime le produit
        } else {
            delete products[id]
        }
    }

    updateLocalStorage(products)
    location.reload()

}

////// Changer la quantité d'un produit au ls //////
function changeProductQuantity(id, color, quantity) {
    let products = getProductsFromLocalStorage()
    if (products[id][color]) {
        products[id][color] = quantity
    }

    updateLocalStorage(products)
    location.reload()
}