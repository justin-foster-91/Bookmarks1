import store from './store'
import bookmarks from './bookmarks'
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/brahyt'

const apiFetch = function(url, method, newData){
  let error = ''
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: newData
  })
    .then(res => {
      if(!res.ok) {
        error = {code: res.status};
        store.error = true
      }
      return res.json();
    })
    .then( data => {
      if (error){
        error.message = data.message;
        bookmarks.render()
      }
      return data;
    });
};

const getItems = function() {
  return apiFetch(`${BASE_URL}/bookmarks`)
}

const createItem = function(newObject){
  return apiFetch(`${BASE_URL}/bookmarks`, 'POST', JSON.stringify(newObject))
}

const updateItem = function(id, updateObject){
  return apiFetch(`${BASE_URL}/bookmarks/${id}`, 'PATCH', JSON.stringify(updateObject))
}

const deleteItem = function(id){
  return apiFetch(`${BASE_URL}/bookmarks/${id}`, 'DELETE')
}

export default {
  getItems,
  createItem,
  updateItem,
  deleteItem
}
