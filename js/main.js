const createElement = function(elName, className) {
  const createdElement = document.createElement(elName);
  createdElement.className = className;
  return createdElement;  
}

const addZero = function(number) {
  return number < 10 ? "0" + number : number;
}

const showDate = function(dateString) {
  const date = new Date(dateString);
  
  return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
}

let showingProducts = products.slice();

const elProductsWrapper = document.querySelector(".products-wrapper");
const elCount = document.querySelector(".count")

// -------------- > RenderProducts < ------------------

const renderProducts = function() {
  elProductsWrapper.innerHTML = "";
  elCount.textContent = `Count: ${showingProducts.length}`
  
  showingProducts.forEach(function(student) {
    const elProduct = renderProduct(student);
    
    elProductsWrapper.append(elProduct);
  });
}

// ------------- > RenderProduct < ---------------

const renderProduct = function(product) {
  
  // const productTemplate = document.querySelector(".product-template");
  
  const elProduct = createElement("li", "col-4");
  // const elProduct = productTemplate.content.cloneNode(true);
  
  const elProductDiv = createElement("div", "card");      // ----------------------- >
  
  const elProductImg = createElement("img", "card-img-top");
  elProductImg.src = product.img;
  elProductDiv.append(elProductImg);
  
  const elCardBody = createElement("div", "card-body");     // -------------------------- >
  
  // ------- Title --------
  const elCardBodyTitle = createElement("h3", "card-title");
  elCardBodyTitle.textContent = product.title;
  elCardBody.append(elCardBodyTitle);
  
  // -------- New Price --------
  const elCardBodyPrice = createElement("p", "card-text fw-bold");
  const elCardBodyMark = createElement("mark");
  elCardBodyMark.textContent = product.price;
  elCardBodyPrice.append(elCardBodyMark);
  elCardBody.append(elCardBodyPrice);
  
  
  // -------- Current Price --------
  const elCardBodyCurrentPrice = createElement("p", "card-text");
  const elCardBodyCurrentDel = createElement("s");
  elCardBodyCurrentDel.textContent = product.price;
  elCardBodyCurrentPrice.append(elCardBodyCurrentDel);
  elCardBody.append(elCardBodyCurrentPrice);
  
  // ------- Badge -------
  const elCardBodyBadge = createElement("p", "badge bg-success");
  elCardBodyBadge.textContent = product.model;
  elCardBody.append(elCardBodyBadge);
  
  // ------- Data -------
  const elCardBodyDate = createElement("p", "card-text");
  elCardBodyDate.textContent = showDate( product.addedDate);
  elCardBody.append(elCardBodyDate);
  
  // -------- Benefits -------
  const elCardBodyBenefits = createElement("ul", "d-flex flex-wrap list-unstyled");
  for (let j = 0; j < product.benefits.length; j++){
    const elCardBodyBenefitsItem = createElement("li", "badge bg-primary me-1 mb-1");
    elCardBodyBenefitsItem.textContent = product.benefits[j];
    elCardBodyBenefits.append(elCardBodyBenefitsItem);
  }
  elCardBody.append(elCardBodyBenefits);
  
  
  // -------- Btn -------
  const elCardBodyBtnWrapper = createElement("div", "position-absolute top-0 end-0 d-flex");
  
  // ------- Edit --------
  const elCardBodyBtnEdit = createElement("button", "btn rounded-0 btn-secondary");
  const elCardBodyBtnEditI = createElement("i", "fa-solid fa-pen");
  elCardBodyBtnEdit.setAttribute("data-bs-toggle", "modal"),
  elCardBodyBtnEdit.setAttribute("data-bs-target", "#edit-student-modal"),
  elCardBodyBtnEdit.setAttribute("data-id", product.id),
  elCardBodyBtnEditI.style.pointerEvents = "none";
  elCardBodyBtnEdit.append(elCardBodyBtnEditI);
  elCardBodyBtnWrapper.append(elCardBodyBtnEdit);
  
  // ------- Delete --------
  const elCardBodyBtnDelete = createElement("button", "btn rounded-0 btn-danger");
  const elCardBodyBtnDeleteI = createElement("i", "fa-solid fa-trash");
  elCardBodyBtnDelete.setAttribute("data-id", product.id);  
  elCardBodyBtnDeleteI.style.pointerEvents = "none";
  elCardBodyBtnDelete.append(elCardBodyBtnDeleteI);
  elCardBodyBtnWrapper.append(elCardBodyBtnDelete);
  
  
  
  // --------- Appends ---------
  elCardBody.append(elCardBodyBtnWrapper);
  elProductDiv.append(elCardBody);
  elProduct.append(elProductDiv);
  
  return elProduct;
}

// ------------ Wrapper ------------

for (let i = 0; i < products.length; i++) {
  const elProduct = renderProduct(products[i]);
  
  elProductsWrapper.append(elProduct);
}

// --------------  Add Student  ---------------

const addForm = document.querySelector("#add-form");
const addProductModalEL = document.querySelector("#add-student-modal");
const addProductModal = new bootstrap.Modal(addProductModalEL);


addForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  
  const elements = evt.target.elements;
  
  const productTitleInput = elements["product-title"];
  const priceInput = elements["price"];
  const manufacturerSelect = elements["product-manufacturer"];
  
  const productTitleInputValue = productTitleInput.value;
  const priceInputValue = priceInput.value;
  const manufacturerSelectValue = manufacturerSelect.value;
  
  if (productTitleInputValue.trim() && priceInputValue.trim() && manufacturerSelectValue.trim()) {
    const newCard = {
      id: Math.floor(Math.random() * 1000),
      title: productTitleInputValue,
      img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-pro-family-hero?wid=300&hei=200&fmt=png-alpha&.v=1644969385433",
      price: priceInputValue,
      benefits: [],
      model: manufacturerSelectValue,
      addedDate: new Date().toISOString(),
    }
    
    products.push(newCard);
    localStorage.setItem("products", JSON.stringify(products));
    addForm.reset();
    addProductModal.hide();
    
    const product = renderProduct(newCard);
    elProductsWrapper.append(product);
  }
});

// -------> Add Form Select <----------

const selectAdd = document.querySelector("#product-manufacturer");
const editManufacturer = document.querySelector("#edit-product-manufacturer");

const manufacturerAppend = function(select) {
  for (let k = 0; k < manufacturers.length; k++) {
    const option = createElement("option");
    option.textContent = manufacturers[k].name;
    select.append(option);
  }
}
manufacturerAppend(selectAdd);
manufacturerAppend(editManufacturer);


// ------------- Filter product ------------

const filterForm = document.querySelector(".form-filter");

filterForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  
  const elements = evt.target.elements;
  
  const searchValue = elements.search.value;
  
  const fromValue = elements.from.value; 
  const toValue = elements.to.value;
  
  const sortValue = elements.sortby.value
  
  showingProducts = products
  .sort(function(a, b) {
    switch (sortValue) {
      case "1":
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
      case "2":
      return b.price - a.price
      case "3":
      return a.price - b.price
      case "4":
      default:
      break;
    }
  })
  .filter(function(parrot) {
    const productPercent = parrot.price;
    
    const searchRegExp = new RegExp(searchValue, "gi");
    const nameLastName = parrot.title;
    
    const toCondition = !toValue ? true : productPercent <= toValue;
    
    return productPercent >= fromValue && toCondition && nameLastName.match(searchRegExp)
  })
  
  renderProducts(); 
  
}); 

// --------------- Delete and Edit product -----------------

const editForm = document.querySelector("#edit-form");
const editProductModalEL = document.querySelector("#edit-student-modal");
const editProductModal = new bootstrap.Modal(editProductModalEL);

const editTitle = document.querySelector("#edit-product-title");
const editPrice = document.querySelector("#edit-price");
const editSelect = document.querySelector("#edit-product-manufacturer")

elProductsWrapper.addEventListener("click", function(evt) {
  if (evt.target.matches(".btn-danger")) {
    const clickedItemIndexId = +evt.target.dataset.id;
    
    const clickedItemIndex = products.findIndex(function (element) {
      return element.id === clickedItemIndexId; 
    });
    products.splice(clickedItemIndex, 1);
    localStorage.setItem("products", JSON.stringify(products));
    
    elProductsWrapper.innerHTML = "";
    
    products.forEach(function (product) {
      const elProduct = renderProduct(product);
      elProductsWrapper.append(elProduct);
    });
    
  } else if (evt.target.matches(".btn-secondary")) {
    const clickedId = +evt.target.dataset.id;
    
    const clickedItemIndex = products.find(function (element) {
      return element.id === clickedId; 
    });
    
    editTitle.value = clickedItemIndex.title;
    editPrice.value = clickedItemIndex.price;
    editSelect.value = clickedItemIndex.manufacturers;
    
    editForm.setAttribute("data-editing-id", clickedItemIndex)
  }
  
});

editForm.addEventListener("submit", function(evt) {
  evt.preventDefault();
  
  
  const editingItemId = +evt.target.dataset.editingId;
  
  const editTitleValue = editTitle.value;
  const editPriceValue = editPrice.value;
  const editSelectValue = editSelect.value;
  
  if (editTitleValue.trim() && editPriceValue.trim() && editSelectValue) {
    const EditedCard = {
      id: editingItemId,
      title: editTitleValue,
      img: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-pro-family-hero?wid=300&hei=200&fmt=png-alpha&.v=1644969385433",
      price: editPriceValue,
      benefits: [],
      model: editSelectValue,
      addedDate: new Date().toISOString(),
    }
      
      const editingItemIndex = products.findIndex(function (element) {
          return element.id == editingItemId; 
      });
      
      products.splice(editingItemIndex, 1, EditedCard);
      showingProducts.splice(editingItemIndex, 1, EditedCard);
      localStorage.setItem("products", JSON.stringify(products));
      editForm.reset();
      editProductModal.hide();
      
      renderProducts();
  }
});





