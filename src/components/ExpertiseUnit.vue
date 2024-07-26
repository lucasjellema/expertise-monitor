<template>
    <div class="expertise-unit">
      <div class="header" @click="toggle">
        <span>{{ unit.name }}
           <v-img :src="unit.logoURL" height="50px"></v-img>
        </span>
        <h3>{{ unit.count }}</h3>
        <button v-if="hasChildren" @click.stop="toggle">{{ expanded ? '-' : '+' }}</button>
      </div>
      <div class="children" v-show="expanded">
        <ExpertiseUnit
          v-for="(child, index) in unit.children"
          :key="index"
          :unit="child"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'OrgUnit',
    props: {
      unit: Object,
    },
    data() {
      return {
        expanded: false,
      };
    },
    computed: {
      hasChildren() {
        return this.unit.children && this.unit.children.length > 0;
      },
    },
    methods: {
      toggle() {
        this.expanded = !this.expanded;
      },
    },
  };
  </script>
  <style scoped>
  .expertise-unit {
    border: 1px solid #ccc;
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
  .children {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  </style>