<template>
  <div id="app">
    <div>
      <b-form-input v-model="textSearch" placeholder="Поиск"></b-form-input>
<!--      <div class="mt-2">Value: {{ textSearch }}</div>-->
      <div>
        <b-button pill variant="primary" v-on:click="personAdd()"><b-icon-person-plus-fill></b-icon-person-plus-fill></b-button>
        <b-button pill variant="primary" v-on:click="profAdd()"><b-icon-bag-fill></b-icon-bag-fill></b-button>
      </div>
    </div>
    <div>
      <b-table small :fields="fields" :items="usersObjFilter" responsive="sm"  show-empty head-variant='dark'>
        <div> </div>
        <template v-slot:cell(index)="date">
          {{  date.index + 1 }}
        </template>

        <template v-slot:cell(name-first)="date">
          {{ date.item.name.first }}
          <div>
            <b-form-input v-model.lazy="date.item.name.first" v-if="editFirst === date.index && editBool === true"></b-form-input>
          </div>
        </template>

        <template v-slot:cell(name-last)="date">
          {{ date.item.name.last }}
          <div>
            <b-form-input v-model.lazy="date.item.name.last" v-if="editFirst === date.index && editBool === true"></b-form-input>
          </div>
        </template>

        <template v-slot:cell(dob)="date">
          {{ new Date(date.item.dob.date) }}
          <div>
            <b-form-datepicker v-model.lazy="date.item.dob.date" v-if="editFirst === date.index && editBool === true"></b-form-datepicker>
          </div>
        </template>

        <template v-slot:cell(link-foto)="date">
          <b-avatar v-bind:src="date.item.picture.thumbnail" v-if="date.item.picture.thumbnail != undefined"></b-avatar>
          <b-avatar variant="secondary" v-else></b-avatar>
        </template>

        <template v-slot:cell(delete)="date">
<!--          {{ date.item }}-->
          <b-button pill variant="outline-primary" v-on:click="editBool=false" v-if="editFirst === date.index && editBool === true">Сохранить</b-button>
          <b-icon-pencil v-on:click="editAll(date.index)" v-else></b-icon-pencil>
          <b-icon-trash-fill v-on:click="deleteAll(date.item)"></b-icon-trash-fill>
        </template>

      </b-table>
    </div>
<!--    <div>{{ profArr[0].profession }}</div>-->
<!--    <div>{{ usersObjFilter }}</div>-->
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <b-modal id="modal-person-add" title="Добавить человека" @ok="personSave()">
      <label for="newFirst">Имя</label>
      <b-input type="text" id="newFirst" v-model="newFirst"></b-input>
      <label for="newLast">Фамилия</label>
      <b-input type="text" id="newLast" v-model="newLast"></b-input>
      <label for="newDate">Дата рождения</label>
      <b-input type="date" id="newDate" v-model="newDate"></b-input>
      <label for="newLink">Ссылка на фото</label>
      <b-input type="url" id="newLink" v-model="newLink"></b-input>
    </b-modal>
    <b-modal id="modal-prof-add" title="Добавить профессию">
      <b-table small :fields="fieldsProf" :items="profArr[0].profession" responsive="sm"  show-empty head-variant='dark'>
        <div> </div>
        <template v-slot:cell(index)="date">
          {{  date.index + 1 }}
        </template>

        <template v-slot:cell(profession)="date">
          {{ date.item.title }}
        </template>

        <template v-slot:cell(charge)="date">
          <div v-for="charge in date.item.charge" v-bind:key="charge.title">
            {{ charge.title }}
          </div>
          <div v-if="add === date.item && newChargeBool === true"><b-input type="text" v-model='newCharge' id="newProf"></b-input><b-icon-check-circle v-on:click="chargSave(date.item)"></b-icon-check-circle></div>
          <b-icon-plus-square  v-on:click="chargeBool(date.item)" v-else></b-icon-plus-square>
        </template>

      </b-table>
      <label for="newProf">Введите новую профессию</label>
      <b-input type="text" v-model='newProf' id="newProf"></b-input>
      <b-button pill variant="primary" v-on:click="profSave">Добавить профессию</b-button>
    </b-modal>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import { BIconTrashFill, BIconPencil, BIconPersonPlusFill, BIconBagFill, BIconPlusSquare, BIconCheckCircle } from 'bootstrap-vue'
export default {
  name: 'App',
  components: {
    // HelloWorld
    BIconTrashFill,
    BIconPencil,
    BIconPersonPlusFill,
    BIconBagFill,
    BIconPlusSquare,
    BIconCheckCircle
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
      fieldsProf: [
        { key: 'index', label: '№' },
        { key: 'profession', label: 'Профессия' },
        { key: 'charge', label: 'Обязанности' }
      ],
      textSearch: '',
      usersObjFilter: this.$root.users,
      usersObj: this.$root.users,
      editFirst: false,
      name: '',
      nameState: null,
      editBool: false,
      newFirst:'',
      newLast:'',
      newDate:'',
      newLink:'',
      profArr: [{
        profession: [
          {
            title: "Программист",
            charge: [{ title: "Писать код" }, { title: "Отрастить бороду" }]
          },
          {
            title: "Дизайнер",
            charge: [{ title: "Рисовать" }, { title: "Придумывать" }]
          }
        ]
      }
      ],
      newProf: '',
      newCharge:'',
      newChargeBool: false,
      add: ''
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
      this.editBool = true
      this.editFirst = item
    },
    personAdd: function() {
      this.$bvModal.show('modal-person-add')
    },
    profAdd: function() {
      this.$bvModal.show('modal-prof-add')
    },
    personSave: function() {
      this.usersObj.push({
        name: { first: this.newFirst, last: this.newLast },
        dob: { date: this.newDate },
        picture: { thumbnail: this.newLink }
      })
    },
    profSave: function() {
      if (this.professionСheck(this.profArr[0].profession, this.newProf) == false){
        this.profArr[0].profession.push({
          title: this.newProf
        })
      }
    },
    professionСheck: function (obj, val) {
      let flagProf = false
      if (obj) {
        Object.keys(obj).map(function(objectKey) {
          const title = String(obj[objectKey].title)
          if (title.toUpperCase() === val.toUpperCase()) {
            flagProf = true
          }
        })
      }
      return flagProf
    },
    chargSave: function(item) {
      console.log(item)
      this.add = item
      this.newChargeBool = false
      console.log(item.charge === undefined)
      if (item.charge === undefined){
        item.charge = {
          title: this.newCharge
        }
      }
      else {
        item.charge.push({
          title: this.newCharge
        })
      }
    },
    chargeBool: function(item) {
      this.add = item
      this.newChargeBool = true
    }
  }
}
</script>

<style>

</style>
