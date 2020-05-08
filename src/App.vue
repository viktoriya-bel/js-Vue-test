<template>
  <div id="app">
    <div>
      <b-form-input v-model="textSearch" placeholder="Поиск"></b-form-input>
      <div class="mt-2">Value: {{ textSearch }}</div>
    </div>
    <div>
      <b-table small :fields="fields" :items="$parent.users | searchFilter" responsive="sm"  show-empty>
        <div> </div>
        <template v-slot:cell(index)="date">
          {{  date.index + 1 }}
        </template>

        <template v-slot:cell(name-first)="date">
          {{ date.item.name.first }}
        </template>

        <template v-slot:cell(name-last)="date">
          {{ date.item.name.last }}
        </template>

        <template v-slot:cell(dob)="date">
          {{ new Date(date.item.dob.date) }}
        </template>

        <template v-slot:cell(link-foto)="date">
          <b-avatar v-bind:src="date.item.picture.thumbnail" v-if="date.item.picture.thumbnail != undefined"></b-avatar>
          <b-avatar variant="secondary" v-else></b-avatar>
        </template>

      </b-table>
    </div>
<!--    <div>{{ $parent.users }}</div>-->
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js App"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      fields: [
        { key: 'index', label: '№' },
        { key: 'name-first', label: 'Имя' },
        { key: 'name-last', label: 'Фамилия' },
        { key: 'dob', label: 'Дата рождения'},
        { key: 'link-foto', label: 'Фото'},
      ],
      textSearch: ''
    }
  },
  props:{
    users: {
      type: String
    }
  },
  filters:{
    searchFilter(value){
      let tex = this.textSearch
      console.log(tex)
      console.log(value)
    }
  }
  // computed:{
  //   users: function(){
  //     var comp = this.company;
  //     return this.phones.filter(function (elem) {
  //
  //       if(comp==='') return true;
  //       else return elem.company.indexOf(comp) > -1;
  //     })
  //   }
  // }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
