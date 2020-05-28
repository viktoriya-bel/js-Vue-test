<template>
  <div id="app">
    <div class="head">
      <b-form-input v-model="textSearch" placeholder="Поиск"></b-form-input>
      <div class="head__but">
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

        <template v-slot:cell(prof)="date">
          <div v-if="date.item.profession === undefined">Безработный</div>
          <div v-else  v-for="item in  date.item.profession" v-bind:key="item.title">{{ item.title }}</div>
          <b-icon-window v-on:click="profPeople(date.item)"></b-icon-window>
        </template>


        <template v-slot:cell(delete)="date" class="table__but">
          <b-button pill variant="outline-primary" v-on:click="editBool=false" v-if="editFirst === date.index && editBool === true">Сохранить</b-button>
          <b-icon-pencil v-on:click="editAll(date.index)" v-else></b-icon-pencil>
          <b-icon-trash-fill v-on:click="deleteAll(date.item, usersObjFilter)"></b-icon-trash-fill>
        </template>

      </b-table>
    </div>

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
          <b-form-input v-model.lazy="date.item.title" v-if="editFirst === date.item.title && editBool === true"></b-form-input>
        </template>

        <template v-slot:cell(charge)="date">
          <div v-for="charge in date.item.charge" v-bind:key="charge.title">
            {{ charge.title }}
            <b-icon-trash-fill v-on:click="deleteAll(charge, date.item.charge)" v-if="charge.title != ''"></b-icon-trash-fill>
          </div>
          <div class="charge__add-input" v-if="add === date.item.title && newChargeBool === true"><b-input type="text" v-model='newCharge' id="newProf"></b-input><b-icon-check-circle class="charge__add-input-icon" v-on:click="chargSave(date.item)"></b-icon-check-circle></div>
          <b-icon-plus-square v-on:click="chargeBool(date.item)" v-else></b-icon-plus-square>
        </template>
        <template v-slot:cell(del)="date"  class="table__but">
          <b-button pill variant="outline-primary" v-on:click="editBool=false" v-if="editFirst === date.item.title && editBool === true">Сохранить</b-button>
          <b-icon-pencil v-on:click="editAll(date.item.title)" v-else></b-icon-pencil>
            <b-icon-trash-fill v-on:click="deleteAll(date.item, profArr[0].profession)"></b-icon-trash-fill>
        </template>

      </b-table>
      <label for="newProf">Введите новую профессию</label>
      <b-input type="text" v-model='newProf' id="newProf"></b-input>
      <b-button pill variant="primary" v-on:click="profSave(profArr[0], newProf)" class="modal__btn-add">Добавить профессию</b-button>
      <div class="errorText" v-if="errorText">Такая запись уже есть!</div>
    </b-modal>
    <b-modal id="modal-prof-people" title="Добавить профессию">
      <b-table id="modal-prof-people-table" small :fields="fieldsProf" items="profPeopleArr.profession" responsive="sm"  show-empty head-variant='dark'>
        <div> </div>
        <template v-slot:cell(index)="date">
          {{  date.index + 1 }}
        </template>

        <template v-slot:cell(profession)="date">
          {{ date.item.title }}
        </template>

        <template v-slot:cell(charge)="date">
          <div v-for="prof in profArr[0].profession" v-bind:key="prof.title">
            <div v-if="prof.title === date.item.title">
              <div v-for="charge in prof.charge" v-bind:key="charge.title">
                {{ charge.title }}
              </div>
            </div>
          </div>

        </template>
        <template v-slot:cell(del)="date">
          <b-icon-trash-fill v-on:click="deleteAll(date.item, profPeopleArr.profession)"></b-icon-trash-fill>
        </template>

      </b-table>
      <label for="newProf">Выберите профессию</label>
      <b-form-select v-model="selectedProf" :options="profArr[0].profession.title">
        <b-form-select-option v-for="item in profArr[0].profession" v-bind:key="item.title" v-bind:value="item.title">{{ item.title }}</b-form-select-option>
      </b-form-select>
      <b-button pill variant="primary" v-on:click="profSave(profPeopleArr, selectedProf)" class="modal__btn-add">Добавить</b-button>
      <div class="errorText" v-if="errorText">Такая запись уже есть!</div>
    </b-modal>
  </div>
</template>

<script>
import { BIconTrashFill, BIconPencil, BIconPersonPlusFill, BIconBagFill, BIconPlusSquare, BIconCheckCircle, BIconWindow } from 'bootstrap-vue'
export default {
  name: 'App',
  components: {
    BIconTrashFill,
    BIconPencil,
    BIconPersonPlusFill,
    BIconBagFill,
    BIconPlusSquare,
    BIconCheckCircle,
    BIconWindow
  },
  data() {
    return {
      fields: [
        { key: 'index', label: '№' },
        { key: 'name-first', label: 'Имя' },
        { key: 'name-last', label: 'Фамилия' },
        { key: 'dob', label: 'Дата рождения'},
        { key: 'link-foto', label: 'Фото'},
        { key: 'prof', label: 'Профессия'},
        { key: 'delete', label: ''},
      ],
      fieldsProf: [
        { key: 'index', label: '№' },
        { key: 'profession', label: 'Профессия' },
        { key: 'charge', label: 'Обязанности' },
        { key: 'del', label: '' }
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
      add: '',
      errorText: false,
      profPeopleArr: '',
      selectedProf: ""
    }
  },
  watch: {
    textSearch: {
      handler: function() {
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
    },
    profPeopleArr:{
      handler: function() {
        console.log("obпn")
        this.$root.$emit('bv::refresh::table', 'modal-prof-people-table')
      },
      deep: true
    }
  },
  methods: {
    deleteAll: function (item, obj) {
      let i=0
      let index=0
      obj.forEach(function(itemObj) {
        if (itemObj===item){
          index=i
        }
        i++
      })
      obj.splice(index, 1)
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
    profPeople: function(item){
      this.$bvModal.show('modal-prof-people')
      this.profPeopleArr = item
    },
    personSave: function() {
      this.usersObj.push({
        name: { first: this.newFirst, last: this.newLast },
        dob: { date: this.newDate },
        picture: { thumbnail: this.newLink }
      })
    },
    profSave: function(obj,  val) {
      if(obj.profession === undefined){
        obj.profession = [
          {
            title: val
          }
        ]
        this.newProf = ''
        this.errorText = false
      }
      else {
        if (this.professionСheck(obj.profession, val) == false){
          obj.profession.push({
            title: val,
            charge: [{ title: "" }]
          })
          this.newProf = ''
          this.errorText = false
        }
        else {
          this.errorText = true
        }
      }
      console.log(obj)
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
      this.add = item
      this.newChargeBool = false
      if (item.charge.title === ''){
        item.charge.title = this.newCharge
      }
      else {
        item.charge.push({
          title: this.newCharge
        })
      }
      this.newCharge = ''
    },
    chargeBool: function(item) {
      this.add = item.title
      this.newChargeBool = true
    }
  },
  mounted() {
    this.$root.$on('bv::modal::hide', () => {
      this.errorText = false
    })
  }
}
</script>

<style>
  .head{
    display: flex;
    margin: 20px 10px;
  }
  .head__but{
    display: flex;
    justify-content: space-between;
    width: 130px;
    padding-left: 10px;
  }
  .charge__add-input{
    display: flex;
    align-items: baseline;
    position: relative;
  }
  .charge__add-input-icon{
    position: absolute;
    top: calc(50% - 8px);
    right: 5px;
  }
  .table__but{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .modal__btn-add{
    margin: 10px 0;
  }
</style>
