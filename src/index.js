import $ from 'jquery'
import 'normalize.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'
import store from './store'
import bookmarks from './bookmarks'
import api from './api'

const runApp = function(){
	api.getItems()
	.then((item) => {
		item.forEach((item) => {
			store.addItem(item)
		})
		bookmarks.renderList();
	})
  bookmarks.render()
  bookmarks.clickOnNew()
  bookmarks.clickOnSubmit()
  bookmarks.clickOnDelete()  
  bookmarks.clickOnUpdate()
	bookmarks.clickToExpand()
  bookmarks.filterRatings()
//$('.output').html(bookmarks.generateList(store.bookmarks))
}
$(runApp)
