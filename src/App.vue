<template>
  <div id="app">
    <div>
      <b-form-input v-model="textSearch" placeholder="Поиск"></b-form-input>
<!--      <div class="mt-2">Value: {{ textSearch }}</div>-->
    </div>
    <div>
      <b-table small :fields="fields" :items="usersObjFilter" responsive="sm"  show-empty>
        <div> </div>
        <template v-slot:cell(index)="date">
          {{  date.index + 1 }}
        </template>

        <template v-slot:cell(name-first)="date">
          {{ date.item.name.first }}
          <b-icon-pencil v-on:click="editAll(date.item.name.first)"></b-icon-pencil>
        </template>

        <template v-slot:cell(name-last)="date">
          {{ date.item.name.last }}
          <b-icon-pencil v-on:click="editAll(date.item.name.last)"></b-icon-pencil>
        </template>

        <template v-slot:cell(dob)="date">
          {{ new Date(date.item.dob.date) }}
        </template>

        <template v-slot:cell(link-foto)="date">
          <b-avatar v-bind:src="date.item.picture.thumbnail" v-if="date.item.picture.thumbnail != undefined"></b-avatar>
          <b-avatar variant="secondary" v-else></b-avatar>
        </template>

        <template v-slot:cell(delete)="date">
<!--          {{ date.item }}-->
<!--          <b-button pill variant="outline-danger" >Удалить</b-button>-->
          <b-icon-trash-fill v-on:click="deleteAll(date.item)"></b-icon-trash-fill>
        </template>

      </b-table>
    </div>
<!--    <div>{{ usersObj }}</div>-->
<!--    <div>{{ usersObjFilter }}</div>-->
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { BIconTrashFill, BIconPencil } from 'bootstrap-vue'
export default {
  name: 'App',
  components: {
    // HelloWorld
    BIconTrashFill,
    BIconPencil
  },
  data() {
    return {
      fields: [
        { key: 'index', label: '№' },
        { key: 'name-first', label: 'Имя' },
        { key: 'name-last', label: 'Фамилия' },
        { key: 'dob', label: 'Дата рождения'},
        { key: 'link-foto', label: 'Фото'},
        { key: 'delete', label: ''},
      ],
      textSearch: '',
      usersObj: this.$root.users,
      usersObjFilter: this.$root.users
    }
  },
  watch: {
    textSearch: {
      handler: function() {
        // console.log(this.textSearch)
        // console.log(this.$root.users)
        // console.log(this.textSearch)
        if (this.textSearch === ""){
          this.usersObjFilter = this.usersObj
        }
        else{
          this.usersObjFilter = this.usersObj.filter(obj => {
            let flag = false
            Object.values(obj).forEach(() => {
              const nameFirst = obj.name.first
              const nameLast = obj.name.last
              let valArr = this.textSearch.split(' ')
              let valArr2 = valArr.filter(element => element !== "");
              for (const valOb of valArr2) {
                if (
                        String(nameFirst.toLowerCase()).includes(valOb.toLowerCase()) ||
                        String(nameLast.toLowerCase()).includes(valOb.toLowerCase())
                ) {

                  flag = true
                  return
                }
              }
            })
            if (flag) {
              return obj
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    deleteAll: function (item) {
      let i=0
      let index=0
      this.usersObj.forEach(function(itemObj) {
        if (itemObj===item){
          index=i
        }
        i++
      })
      this.usersObj.splice(index, 1)
    },
    editAll:function (item) {
      console.log(item)
      let i=0
      let index=0
      this.usersObj.forEach(function(itemObj) {
        if (itemObj===item){
          index=i
        }
        i++
      })
      console.log(index)
    }
  }
}
</script>

<style>

</style>
