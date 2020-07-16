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
  }
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

const generateList = function(bookmarkArray){
  const buttons = `
      <div class="form-group">
      <button class="btn btn-primary" id="js-new-bookmark">New</button>

      <select id="js-filter-ratings" name="js-rating-filter">
				<option value="0" disabled selected>Minimum Rating</option>
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


const clickOnNew = function(){
  $('.output').on('click', '#js-new-bookmark', function(event){
    event.preventDefault()
    store.adding = true;
    $('.output').html(addNewItemSnippit())
//    console.log(event)
//    console.log(store.adding)
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
  })
}

export default {
  clickOnNew,
  clickOnSubmit,
	render
}
