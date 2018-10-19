// let allergens = fetch("http://localhost:8088/food")
//                 .then((foodData) => foodData.json())
//                 .then((foodArray) => foodArray[4].barcode)
//                 .then((urlBarcode)=> {
//                   return fetch(`https://world.openfoodfacts.org/api/v0/product/${urlBarcode}.json`)
//                           .then((soupData)=> soupData.json())
//                           .then((soupArray)=> {
//                             return allergens = soupArray.product.allergens;
//                           })
//                           .then((allergens) => console.log(allergens))        
//                 })
//   console.log("allergens outside of fetch", allergens);

let consoleCounter = 0
let fragment = document.createDocumentFragment();
let printContainer = document.createElement("div")
printContainer.classList.add("container")
let printList = document.querySelector("#foodList")

let localFoodArray =[];

fetch("http://localhost:8088/food")
  .then((foodData) => foodData.json())
  .then((foodArray) => {
    foodArray.forEach((food) => {
      localFoodArray.push(food);
      fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`).then((itemRaw) => itemRaw.json())
       .then((remoteFood)=>{  
         Promise.all(remoteFood);
         console.log(remoteFood);
      })
        console.log(localFoodArray);
    })
  })


  let buildElement = (element, claz, id, content ) => {
      let newelement = document.createElement(element);
      newelement.classList.add(claz);
      newelement.classList.add(id);
      newelement.innerHTML = content
      return newelement
  }
  
