<template>
  <div class="expertise-unit">
    <div class="header" @click="toggle">

      <span>
        <p
          @click="e => { if (unit?.type == 'expertise' ||unit?.type == 'expertiseClaim') { emit('showExpertiseDetailsRequested', unit); e.stopPropagation() } }">
          {{ unit.name }}</p>
        <v-icon title="Ambition Indicator (explore, grow, retain, discard, ignore)" v-if="unit?.type == 'expertiseClaim' || unit.ambition">{{ ambitionIconMap[unit.ambition] }}</v-icon>
        <v-icon title="Show all knowledge" @click="(e) => { emit('showExpertiseMapRequested', unit); e.stopPropagation() }" small class="ml-2"
          v-if="unit?.type">mdi-school</v-icon>
        <v-icon title="Edit the organization's expertise" @click="(e) => { emit('editOrganizationExpertiseRequested', unit); e.stopPropagation() }" 
          v-if="!unit.readOnly">mdi-pencil-outline</v-icon>
        <div class="logoContainer"><v-img :src="unit.logo" @click="e => { if (unit?.type == 'expertise'||unit?.type == 'expertiseClaim') { emit('showExpertiseDetailsRequested', unit); e.stopPropagation() } }"></v-img></div>

      </span>
      <h3>{{ unit.count }}</h3> <span v-if="unit.children && unit.children.length > 0">(in {{ unit.children.length
        }})</span>
      <button v-if="hasChildren" @click.stop="toggle">{{ expanded ? '-' : '+' }}</button>
    </div>
    <div class="children" v-show="expanded">
      <div v-if="unit?.claim">
        <span v-if="unit.claim?.asOf">Per: {{ formatMonthYear(unit.claim.asOf) }}</span><br />
        <span v-if="unit.claim?.author">Door: {{ unit.claim.author }}</span><br />
        {{ unit.claim?.notes }}
      </div>
      <ExpertiseUnit v-for="(child, index) in unit.children" :key="index" :unit="child"
        @editOrganizationExpertiseRequested="handleEditOrganizationExpertiseRequested"
        @showExpertiseMapRequested="handleShowExpertiseMapRequested"
        @showExpertiseDetailsRequested="handleShowExpertiseDetailsRequested" />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  unit: Object,
})
import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos, ambitionIconMap } = useIconsLibrary();

import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();

const emit = defineEmits(['editOrganizationExpertiseRequested', 'showExpertiseMapRequested', 'showExpertiseDetailsRequested'])
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


const handleShowExpertiseMapRequested = (expertise) => {
  emit('showExpertiseMapRequested', expertise)
}

const handleShowExpertiseDetailsRequested = (expertise) => {
  emit('showExpertiseDetailsRequested', expertise)
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

.logoContainer {
  height: 50px;
  width: 150px;
}
</style>