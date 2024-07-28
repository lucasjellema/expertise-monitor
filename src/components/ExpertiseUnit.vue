<template>
    <div class="expertise-unit">
      <div class="header" @click="toggle">
        <span>{{ unit.name }}<v-icon @click="emit('editOrganizationExpertiseRequested', unit)" >mdi-pencil-outline</v-icon>
           <v-img :src="unit.logoURL" height="50px"></v-img>
        </span>
        <h3 >{{ unit.count }}</h3> <span v-if="unit.children && unit.children.length > 0">(in {{ unit.children.length }})</span>  
        <button v-if="hasChildren" @click.stop="toggle">{{ expanded ? '-' : '+' }}</button>
      </div>
      <div class="children" v-show="expanded">
        <ExpertiseUnit
          v-for="(child, index) in unit.children"
          :key="index"
          :unit="child"
          @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested"
        />
      </div>
    </div>
  </template>
  
  <script setup>

const props = defineProps({
  unit: Object,
})

const emit = defineEmits(['editOrganizationExpertiseRequested'])
const expanded = ref(false)
const hasChildren = computed(() => {
  return props.unit.children && props.unit.children.length > 0;
})

const toggle = () => {
  expanded.value = !expanded.value;
}

const handleEditOrganizationExpertiseRequested = (expertise) => {
    emit('editOrganizationExpertiseRequested', expertise)
}
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