import store from './store'
import api from './api'
import $ from 'jquery'

const render = function(){
  if(store.error) {
		errorMessage()    
    store.error === null
  }
  else if(store.adding) {
    addNewItemSnippit()
  }
  else if(!store.adding) {
    renderList();
//		api.getItems()
//			.then((item) => {
//				item.forEach((item) => {
//					store.bookmarks.push(item)
//				})
//				renderList();
//			})
  }
}

const errorMessage = function(){
  message = `<div class="alert alert-danger" role="alert">${store.error}</div>`
  $('.output').append(message)
}

const addNewItemSnippit = function(){
  return `
<form class="container-fluid" id="js-form" name="js-form">
  <div class="form-group">
    <label for="title">Title</label>
    <input class="form-control"type="text" name:"title" id="title" required>
  </div>
  <div class="form-group">
    <label for="url">URL</label>
    <input class="form-control" type="url" name:"url" id="url" required>
  </div>
  <div class="form-group">
    <label for="desc">Description</label>
    <textarea class="form-control" rows="3" name:"desc" id="desc"></textarea>
  </div>
  <div class="form-group">
    <select id="rating" name="rating">
      <option value="5">Rating: 5</option>
      <option value="4">Rating: 4</option>
      <option value="3">Rating: 3</option>
      <option value="2">Rating: 2</option>
      <option value="1">Rating: 1</option>
    </select>
  </div>
    <button class="btn btn-primary" id="js-add-new">Submit</button>
</form>
  `
}

const generateBookmarkItem = function(object) {
  if(object.rating >= store.filter) {
  let itemExpanded = `
        <div class="card-body">
          <p class="js-bookmark-rating card-text">RATING: ${object.rating}</p>
          <p class="js-bookmark-desc card-text">DESCRIPTION: ${object.desc}</p>
          <a href="${object.url}" class="js-bookmark-url card-text"><button id ='js-go-url' class="btn btn-primary">GO!</button>
</a>
          <button class="btn btn-primary" id='js-update-bookmark'>Update</button>
          <button class="btn btn-danger" id='js-delete-bookmark'>Delete</button>
        </div>
  `
  if(object.expanded) {
    return  `
        <section class="js-bookmark card" data-bookmark-id="${object.id}">
          <div class="card-header">
            <h3 class="js-bookmark-title">${object.title}</h3>
          </div>
          ${itemExpanded}
        </section>
      `
	}
  else{
    return  `
        <section class="js-bookmark card" data-bookmark-id="${object.id}">
          <div class="card-header">
            <h3 class="js-bookmark-title card-title">${object.title}</h3>
          </div>
        </section>
        `
  }
}
}

const generateList = function(bookmarkArray){
  const buttons = `
      <div class="form-group">
      <button class="btn btn-primary" id="js-new-bookmark">New</button>

      <select id="js-filter-ratings" name="js-rating-filter">
				<option value="0">Filter Rating</option>
        <option value="5">Rating: 5</option>
        <option value="4">Rating: 4</option>
        <option value="3">Rating: 3</option>
        <option value="2">Rating: 2</option>
        <option value="1">Rating: 1</option>
      </select>
    </div>
  `
  const items = bookmarkArray.map((item) => generateBookmarkItem(item));
  return buttons + items.join('');
}


const renderList = function(){
  $('.output').html(generateList(store.bookmarks))
}

const getIdFromElement = function(item){
  return $(item)
    .closest('.js-bookmark')
    .data('bookmark-id')
}

const clickOnNew = function(){
  $('.output').on('click', '#js-new-bookmark', function(event){
    event.preventDefault()
    store.adding = true;
    $('.output').html(addNewItemSnippit())
//    console.log(event)
//    console.log(store.adding)
  })
}

const serializer = function(formData) {
  const title = formData[0].value
  const url = formData[1].value
  const desc = formData[2].value
  const rating = formData[3].value
//  console.log(`${title} ${url} ${desc} ${rating}`)
  return {
    title,
    url,
    desc,
    rating
  }
}

const clickToExpand = function(){
  $('.output').on('click', '.card-header', event => {
    let id = getIdFromElement(event.currentTarget)
//    console.log(id)
    store.toggleExpand(id)
    render()
  })
}

const clickOnSubmit = function(){
  $('.output').on('submit', '#js-form', event => {
    event.preventDefault()
    console.log(store.updating)
    let id = getIdFromElement(event.currentTarget);
    if(!store.updating){
      let myForm = document.querySelector('#js-form')
      let serObj = serializer(myForm)
      api.createItem(serObj)
        .then(res => {
          store.addItem(res)
          store.adding = false;
          render();
        })
		}
    if(store.updating){
      let myForm = document.querySelector('#js-form')
      let serObj = serializer(myForm)
//      serObj.id = id
      console.log(serObj)
      api.updateItem(id, serObj)
        .then(res => {
          store.findAndUpdate(id, serObj)
          store.updating = false;
          render()
        })
		}
  })
}

const updateSnippit = function(oldObject) {
  return `
<form class="container-fluid" id="js-form" name="js-form">
  <div class="form-group">
    <label for="title">Title</label>
    <input class="form-control"type="text" name:"title" id="title" value="${oldObject.title}" required>
  </div>
  <div class="form-group">
    <label for="url">URL</label>
    <input class="form-control" type="url" name:"url" id="url" value="${oldObject.url}"required>
  </div>
  <div class="form-group">
    <label for="desc">Description</label>
    <textarea class="form-control" rows="3" name:"desc" id="desc" value="">${oldObject.desc}</textarea>
  </div>
  <div class="form-group">
    <select id="rating" name="rating" value="${oldObject.rating}">
      <option value="5">Rating: 5</option>
      <option value="4">Rating: 4</option>
      <option value="3">Rating: 3</option>
      <option value="2">Rating: 2</option>
      <option value="1">Rating: 1</option>
    </select>
  </div>
    <button class="btn btn-primary" id="js-add-new">Submit</button>
</form>
  `
}


const clickOnUpdate = function() {
  $('.output').on('click', '#js-update-bookmark', event => {
    event.preventDefault();
    store.updating = true;
    let id = getIdFromElement(event.currentTarget);
    let target = event.currentTarget  
    let currentObject = store.findById(id);
    target.parentElement.innerHTML = updateSnippit(currentObject)
//    render()
	}
  );
}

const clickOnDelete = function() {
  $('.output').on('click', '#js-delete-bookmark', event => {
    event.preventDefault()
    let id = getIdFromElement(event.currentTarget)
    api.deleteItem(id)
      .then(()=> {
        store.findAndDelete(id)
        render()
      })
//    console.log(event)
  })
}

const filterRatings = function(){
  $('.output').on('change', '#js-filter-ratings', event => {
    store.filter = event.currentTarget.value;
//		console.log(store.filter)
    render()
  })
}

export default {
	generateList,
  renderList,
  addNewItemSnippit,
  clickOnNew,
	render,
  clickOnSubmit,
  clickOnDelete,
  clickToExpand,
  filterRatings,
  clickOnUpdate
}
