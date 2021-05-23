import axios from 'axios'
import { API_URL } from '@/environment/environment'
import store from '@/app/store'

const httpCategoryService = axios.create({
  baseURL: new URL('todo', API_URL).toString(),
  withCredentials: true
})

const categoryService = {
  getAll () {
    return new Promise((resolve, reject) =>
      httpCategoryService.get('categories',
        { headers: store.getters.authHeader })
        .then(({ data }) => resolve(data))
        .catch(reject))
  },
  add (name) {
    return new Promise((resolve, reject) =>
      httpCategoryService.post('category',
        { name },
        { headers: store.getters.authHeader })
        .then(({ headers: { location } }) => resolve(
          location.substr(
            location.lastIndexOf('/') + 1))
        )
        .catch(reject))
  },
  change (categoryId, newName) {
    return httpCategoryService.patch(`category/${categoryId}/name`,
      { name: newName },
      { headers: store.getters.authHeader })
  },
  remove (categoryId) {
    return httpCategoryService.delete(`category/${categoryId}`,
      { headers: store.getters.authHeader })
  }
}

export default categoryService
