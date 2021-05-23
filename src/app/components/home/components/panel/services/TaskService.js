import axios from 'axios'
import { API_URL } from '@/environment/environment'
import store from '@/app/store'

const httpTaskService = axios.create({
  baseURL: new URL('todo', API_URL).toString(),
  withCredentials: true
})

const taskService = {
  getAll (categoryId) {
    return new Promise((resolve, reject) =>
      httpTaskService.get(`category/${categoryId}/tasks`,
        { headers: store.getters.authHeader })
        .then(({ data }) => resolve(data))
        .catch(reject))
  },
  add (categoryId, task) {
    return new Promise((resolve, reject) =>
      httpTaskService.post(`category/${categoryId}/task`,
        task,
        { headers: store.getters.authHeader })
        .then(({ headers: { location } }) => resolve(
          location.substr(
            location.lastIndexOf('/') + 1))
        )
        .catch(reject))
  },
  change (taskId, task) {
    return httpTaskService.put(`task/${taskId}`,
      task,
      { headers: store.getters.authHeader })
  },
  changeCompleted (taskId, completed) {
    return httpTaskService.patch(`task/${taskId}/completed`,
      { completed },
      { headers: store.getters.authHeader })
  },
  remove (taskId) {
    return httpTaskService.delete(`task/${taskId}`,
      { headers: store.getters.authHeader })
  }
}

export default taskService
