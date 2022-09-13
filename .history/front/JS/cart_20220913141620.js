////////////////////////////////////////////////////////////////
// On affiche tout les produits dans le localstorage ////////////////////
////////////////////////////////////////////////////////////////


// récupérer le panier (l’array) via localStorage.
let productInLocalStorage = JSON.parse(localStorage.getItem("productCart"));
let cartTotalPrice = 0
let cartTotalItems = 0


function innerHTML() {
    //Object.entries permets de transformer un objet en tableau
    //la première boucle va au premier niveau de l'objet
    for (let [id, colors] of Object.entries(productInLocalStorage)) {
        //la deuxième boucle va au deuxième niveau
        //On récupère la couleur et la quantité
        for (let [color, quantity] of Object.entries(colors)) {
            console.log(color)
            fetch("http://localhost:3000/api/products/" + id)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            //faire un return      response.json()
                            //ferme le if, fermer then
                            .then((productData) => {
                                console.log(productData)
                                let item = document.querySelector("#cart__items")
                                    // Insertion des éléments
                                    // document.createelement
                                item.innerHTML += `<article class="cart__item" data-id ="${productData._id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src="${productData.imageUrl}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${productData.name}</h2>
                    <p>${color}</p>
                    <p>${productData.price} €</p> 
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :   </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
                </article>`;
                                //Supprimer un produit du ls
                                //deleteBtns renvoie un objet avec tous les éléments html sous forme de collection
                                let deleteBtns = document.getElementsByClassName("deleteItem")

                                //le forEach permets de boucler sur les boutons récupérés dans deleteBtns
                                //Object.values nous permet d'établir un tableau pour pouvoir boucler sur les éléments
                                Object.values(deleteBtns).forEach(deleteBtn => {
                                    // Au clic de deleteBtn on supprime le produit du ls
                                    deleteBtn.addEventListener('click', function() {
                                        //closest permet de récupérer l'article le plus proche du deleteBtn en question
                                        let article = deleteBtn.closest("article")
                                        let deleteBtnId = article.getAttribute("data-id")
                                        let deleteBtncolor = article.getAttribute("data-color")

                                        //Fonction récupérer dans le fichier localstorage, qui permet de supprimer le produit du ls
                                        removeProductFromLs(deleteBtnId, deleteBtncolor)

                                    })
                                })

                                // Changer la quantité d'un produit dans le ls
                                //quantityItem renvoie un objet avec tous les éléments html sous forme de collection
                                let quantityItem = document.getElementsByClassName("itemQuantity")

                                //Object.values nous permet d'établir un tableau pour pouvoir boucler sur les éléments
                                Object.values(quantityItem).forEach(qty => {
                                    qty.addEventListener('change', function() {
                                        let article = qty.closest("article")
                                        let idData = article.getAttribute("data-id")
                                        let idColor = article.getAttribute("data-color")
                                        let newQuantity = qty.value

                                        changeProductQuantity(idData, idColor, newQuantity)
                                    })
                                })

                                // Calculé le prix total et le nombre d'articles du panier

                                let totalQuantity = document.querySelector('#totalQuantity')
                                let totalPrice = document.querySelector('#totalPrice')
                                    // On additionne la quantité de chaque produit pour trouver le nombre d'articles
                                cartTotalItems += parseInt(quantity)
                                    // On multiplie pour chaque produit son prix par sa quantité, et on additionne
                                cartTotalPrice += productData.price * parseInt(quantity)

                                totalQuantity.innerHTML = cartTotalItems
                                totalPrice.innerHTML = cartTotalPrice


                            })


                    }
                })
        }

    }
}

innerHTML()


////////////////////////////////////////////////////////////////
// Form Control & POST request ////////////////////
////////////////////////////////////////////////////////////////


////////////// Form control ////////////
let email = document.querySelector("#email")

// Verification email value
email.addEventListener("change", function() {

    validEmail(this)

});

const validEmail = function(inputEmail) {
    // On établit un regex pour les adresses mails
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]{1,50}[@]{1}[a-zA-Z0-9.-_]{1,50}[.]{1}[a-z]{2,10}$', 'g')

    // On teste le regex
    let testEmail = emailRegExp.test(inputEmail.value)
    let errorMessage = inputEmail.nextElementSibling

    if (inputEmail.value === "") {
        errorMessage.innerHTML = ""

    } else if (testEmail === false) {
        errorMessage.style.color = "FF8686E5"
        errorMessage.innerHTML = "❌ Adresse mail invalide"

    } else if (testEmail === true) {
        errorMessage.innerHTML = ""

    }

}

// Verification inputInfo

let lastName = document.querySelector("#lastName")
let firstName = document.querySelector("#firstName")
let city = document.querySelector("#city")
let address = document.querySelector('#address')

lastName.addEventListener("input", function() {

    validInfo(this)

});

firstName.addEventListener("input", function() {

    validInfo(this)

});

city.addEventListener("input", function() {

    validInfo(this)

});


const validInfo = function(inputInfo) {
    // On établit un regex pour les autres inputs
    let infoRegExp = new RegExp('^[a-zA-Z-_./]{0,100}$', 'g')
        // On teste le regex
    console.log(typeof inputInfo.value)
    let testInfo = infoRegExp.test(inputInfo.value)
    let errorMessage = inputInfo.nextElementSibling


    //if (inputInfo.value === "") {
    errorMessage.innerHTML = ""

    //}
    if (!testInfo) {
        errorMessage.style.color = "FF8686E5"
        errorMessage.innerHTML = "❌ Nombre ou symbole non autorisé"
        return false;
    } else {
        //errorMessage.innerHTML = ""
        return true;
    }


}


/////////// POST request ////////////

// On crée la fonction qui nous permet de renvoyer un objet au backend, qui contient
// Un tableau product et l'objet contact
function makeJsonData() {
    if (!validInfo()) {
        alert("le formlaire n'est pas correctement remplis");
        return;
    }
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    };
    let items = productInLocalStorage;
    let products = [];

    for (i = 0; i < items.length; i++) {
        // S'il n'y a pas de produit dans le ls
        if (products.find((e) => e === items[i][0])) {
            console.log("not found");
        } else {
            // Sinon on envoie les id des produits du ls dans le tableau products
            products.push(items[i].id);
        }
    }
    // On crée l'objet que le backend attend
    let dataJson = JSON.stringify({ contact, products });

    return dataJson;
}

//// Au clic d'orderButton on envoie l'objet dataJson au backend, pour qu'il nous renvoie l'id de commande
const orderButton = document.getElementById("order");
const postUrl = "http://localhost:3000/api/products/order";
orderButton.addEventListener("click", (e) => {
    e.preventDefault(); //prevent default form button action

    let jsonData = makeJsonData();

    fetch(postUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData,
        })
        .then((res) => res.json())
        // to check res.ok status in the network
        .then((data) => {
            // Si le formulaire n'est pas correctement rempli on envoie un message d'alerte
            if (firstName.value === "" || lastName.value === "" || address.value === "" || email.value === "" || city.value === "") {
                alert("Veuillez remplir correctement le formulaire s'il vous plaît")
            } else {
                // Sinon on renvoie sur la page confirmation, en passant orderID qui nous est retourné par le back dans l'url
                localStorage.clear();
                let confirmationUrl = "./confirmation.html?id=" + data.orderId;
                window.location.href = confirmationUrl;
            }
        })
        .catch(() => {
            alert("Une erreur est survenue, merci de revenir plus tard.");
        }); // catching errors
});