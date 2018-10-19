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
let printList = document.querySelector("#foodList")
let printItem;
let localFoodArray = [];
let remoteFoodArray = [];

fetch("http://localhost:8088/food")
  .then((foodData) => foodData.json())
  .then((foodArray) => {
    foodArray.forEach((food) => {
      let url = food.barcode
      localFoodArray.push(food);
      remoteFoodArray.push(fetch(`https://world.openfoodfacts.org/api/v0/product/${url}.json`)
        .then((itemRaw) => itemRaw.json()))
    })
    return Promise.all(remoteFoodArray)
  })
  .then(promisedFoodArray => {
    localFoodArray.forEach((food, index) => {
      // create an array that contains ingredients, 1 per index
      let ingredientArray = []
      promisedFoodArray[index].product.ingredients.forEach((ingredient) => {
        ingredientArray.push(ingredient.text);
      })
      // create an array of countries of origin for each item
      let originArray = []
      originArray.push(promisedFoodArray[index].product.countries);

      // print element for each array item(each country)
      let infoPoints = document.createElement("div");
      infoPoints.classList.add("basic-info")
      originArray.forEach((country)=>{
        let countryTitle = buildElement("h2", "food__country", country);
        infoPoints.appendChild(countryTitle);
      })

      // populate an object with the basic nutritional values of each food.
      let basicNutrition = {}
      basicNutrition.Fats = promisedFoodArray[index].product.nutriments.fat
      basicNutrition.Sugars = promisedFoodArray[index].product.nutriments.sugars
      basicNutrition.Energy = promisedFoodArray[index].product.nutriments.energy_value
      basicNutrition.Unit = promisedFoodArray[index].product.nutriments.energy_unit
      console.log(basicNutrition);

      // iterate through the basic nutrition object to create a list of the basic info
      let nutritionList = document.createElement("ul");
      nutritionList.classList.add("nutrition__list")
      
      for (info in basicNutrition) {
        let nutritionLi = buildElement("li", "food__nutrition--listItem",`${info}: ${basicNutrition[info]}`)
        nutritionList.appendChild(nutritionLi)
      }
      infoPoints.appendChild(nutritionList);
      
      // create container for generated list items
      // iterate over the array of ingredients and create a li for each
      let ingListUL = document.createElement("ul");
      ingListUL.classList.add("ingredients__list")
      
      ingredientArray.forEach((ingredient) =>{
        let ingredientLi  = buildElement("li", "food__ingredient", ingredient)
        ingListUL.appendChild(ingredientLi);
      })
      
      let itemContainer = buildElement("div", "food__container", null)
      let printTitle = buildElement("h1", "food__title", food.name)
      // let printIngredients = buildElement("p", "ingredient", promisedFoodArray)
      itemContainer.appendChild(printTitle);
      // itemContainer.appendChild(printIngredients);
      itemContainer.appendChild(infoPoints);
      itemContainer.appendChild(ingListUL);
      fragment.appendChild(itemContainer);
      
    })
    printList.appendChild(fragment);
  })



let buildElement = (element, claz, content) => {
  let newelement = document.createElement(element);
  newelement.classList.add(claz);
  newelement.innerHTML = content
  return newelement
}




