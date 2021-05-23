<template>
  <div :class="$style.wrap">
    <div :class="$style.category_panel">
      <p>Категории</p>
      <div :class="$style.list_item" v-for="(category, index) of categories"
           @click="selectCategory(category)"
           v-bind:key="index">
        <input v-if="editCategory === index"
               v-model="category.name"
               @change="changeCategoryName(category)"
               @blur="this.editCategory = -1"
               ref="editCategoryItem">
        <input v-else
               :value="category.name"
               :style="{ cursor: 'pointer' }"
               readonly>
        <button @click="this.editCategory = index">🖍</button>
        <button @click="removeCategory(index)">❌</button>
      </div>
      <button @click="addCategory">➕</button>
    </div>
    <div :class="$style.task_panel">
      <p>Задачи</p>
      <div :class="$style.list_item" v-for="(task, index) of tasks"
           @click="selectTask(task)"
           v-bind:key="index">
        <input v-if="editTask === index"
               v-model="task.title"
               @change="changeTask(task)"
               @blur="this.editTask = -1"
               ref="editTaskItem">
        <input v-else
               :value="task.title"
               :style="{ cursor: 'pointer' }"
               readonly>
        <button @click="this.editTask = index">🖍</button>
        <button @click="toggleCompleted(task)">{{ task.completed ? '✅' : '❎' }}</button>
        <button @click="removeTask(index)">❌</button>
      </div>
      <button @click="addTask">➕</button>
    </div>
    <div :style="{ margin: '10px' }">
      <p>Описание</p>
      <textarea v-model="selectedTask.description"
                :class="$style.area"
                ref="desc"
                @change="changeTask(this.selectedTask)">
      </textarea>
    </div>
  </div>
</template>

<script>
import categoryService from '@/app/components/home/components/panel/services/CategoryService'
import taskService from '@/app/components/home/components/panel/services/TaskService'

export default {
  name: 'Panel',
  data () {
    return {
      categories: [],
      tasks: [],
      editCategory: -1,
      editTask: -1,
      selectedCategory: {
        id: 0,
        name: ''
      },
      selectedTask: {
        id: 0,
        title: '',
        description: '',
        completed: ''
      }
    }
  },
  mounted () {
    categoryService.getAll().then(categories => {
      this.categories = categories
    })
  },
  updated () {
    if (this.editCategory !== -1 && this.$refs.editCategoryItem) {
      this.$refs.editCategoryItem.focus()
    }
    if (this.editTask !== -1 && this.$refs.editTaskItem) {
      this.$refs.editTaskItem.focus()
    }
  },
  methods: {
    addCategory () {
      categoryService.add('').then(categoryId => {
        this.categories.push({
          id: categoryId,
          name: ''
        })
        this.selectedCategory = this.categories[this.categories.length - 1]
        this.editCategory = this.categories.length - 1
      })
    },
    changeCategoryName (category) {
      categoryService.change(category.id, category.name)
      this.editCategory = -1
    },
    removeCategory (index) {
      const category = this.categories.splice(index, 1)[0]
      categoryService.remove(category.id)
    },
    selectCategory (category) {
      if (this.selectedCategory !== category) {
        this.selectedCategory = category
        taskService.getAll(category.id).then(tasks => {
          this.tasks = tasks
        })
      }
    },
    addTask () {
      taskService.add(this.selectedCategory.id, { title: '' }).then(taskId => {
        this.tasks.push({
          id: taskId,
          title: '',
          description: '',
          completed: ''
        })
        this.selectedTask = this.tasks[this.tasks.length - 1]
        this.editTask = this.tasks.length - 1
      })
    },
    changeTask (task) {
      taskService.change(task.id, task)
    },
    toggleCompleted (task) {
      task.completed = !task.completed
      taskService.changeCompleted(task.id, task.completed)
    },
    removeTask (index) {
      const task = this.tasks.splice(index, 1)[0]
      taskService.remove(task.id)
    },
    selectTask (task) {
      if (this.selectedTask !== task) {
        this.selectedTask = task
        this.$refs.desc.focus()
      }
    }
  }
}
</script>

<style module lang="sass">

$panel_width: 300px

p
  text-align: center

.wrap
  z-index: -1
  position: absolute
  top: 0
  left: 0
  height: 100%
  width: 100%
  display: flex
  flex-direction: row
.category_panel, .task_panel
  display: flex
  flex-direction: column
  margin: 10px
  > button
    border-radius: 4px
    outline: none !important
    border: 3px solid transparent
    box-sizing: content-box
    margin: 5px
    &:hover
      border-color: #3c3ca5
  .list_item
    background: #f1d5d5
    display: flex
    flex-direction: row
    margin: 5px
    padding: 5px
    border-radius: 5px
    *
      border-radius: 4px
      outline: none !important
      border: 3px solid transparent
      box-sizing: content-box
      margin: 5px
      &:hover
        border-color: #3c3ca5
.category_panel
  position: relative
  height: 100%
  width: max-content
.task_panel
  height: 100%
  width: max-content
.area
  height: 200px
  border-radius: 4px
  outline: none !important
  border: 3px solid #f1d5d5
</style>
