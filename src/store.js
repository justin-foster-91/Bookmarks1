const bookmarks = [];
let adding = false;
const error = null;
const filter = 0;
const updating = false;



const addItem = function(newBookmark){
  newBookmark.expanded = false;
  this.bookmarks.push(newBookmark);
}

const findById = function(id){
  return bookmarks.find(currentItem => currentItem.id === id);
}

const findAndDelete = function(id){
  this.bookmarks = this.bookmarks.filter(currentItem => currentItem.id !== id);
}

const findAndUpdate = function(id, newData){
  let currentItem = this.findById(id);
  Object.assign(currentItem, newData);
}

const toggleExpand = function(id){
  let currentItem = findById(id);
  currentItem.expanded = !currentItem.expanded

}



export default {
  bookmarks,
  adding,
  error,
  filter,
  findAndDelete,
  addItem,
  toggleExpand,
  findById,
  findAndUpdate
}
