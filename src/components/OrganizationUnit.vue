<template>
  <div class="org-unit">
    <div class="header" @click="toggle">
      <span>{{ unit.name }}
        <v-icon v-if="unit?.type=='expertiseClaim'" >{{ambitionIconMap[unit.ambition]}}</v-icon>
          
        <v-icon @click="emit('organizationExpertiseRequested', unit)" v-if="unit.id">mdi-school</v-icon>
        <div class="logoContainer"><v-img :src="unit.logo" ></v-img></div>
      </span>
      <button v-if="hasChildren" @click.stop="toggle">{{ expanded ? '-' : '+' }}</button>
    </div>
    <div class="children" v-show="expanded">{{ unit.type }}
      <div v-if="unit?.type == 'expertiseClaim'">
        <span v-if="unit.claim?.asOf">Per: {{ formatMonthYear(unit.claim.asOf) }}</span><br/>
        <span v-if="unit.claim?.author">Door: {{ unit.claim.author }}</span><br/>        
        {{ unit.claim.notes }}
      </div>

      <OrganizationUnit v-for="(child, index) in unit.children" :key="index" :unit="child" @organizationExpertiseRequested="handleOrganizationExpertiseRequested"/>
    </div>
  </div>
</template>

<script setup>
// import { useRoute } from 'vue-router';

// const router = useRouter()
const props = defineProps({
  unit: Object,
})

import { useIconsLibrary } from '@/composables/useIconsLibrary';
const { companyLogos, ambitionIconMap } = useIconsLibrary();
import { useDateLibrary } from '@/composables/useDateLibrary';
const { formatMonthYear } = useDateLibrary();

const emit = defineEmits(['organizationExpertiseRequested'])
const expanded = ref(false)
const hasChildren = computed(() => {
  return props.unit.children && props.unit.children.length > 0;
})

const handleOrganizationExpertiseRequested = (organization) => {
    console.log(organization)
    emit('organizationExpertiseRequested', organization)
//    router.push({ name: 'organizationExpertise', params: { organizationId: organization.id } })
}

const toggle = () => {
  expanded.value = !expanded.value;
}
</script>
<style scoped>
.org-unit {
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