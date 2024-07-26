<template>
  <div class="org-unit">
    <div class="header" @click="toggle">
      <span>{{ unit.name }} <v-icon @click="organizationExpertise(unit)" v-if="unit.id">mdi-school</v-icon>
        <v-img :src="unit.logo" height="50px"></v-img>
      </span>
      <button v-if="hasChildren" @click.stop="toggle">{{ expanded ? '-' : '+' }}</button>
    </div>
    <div class="children" v-show="expanded">
      <OrganizationUnit v-for="(child, index) in unit.children" :key="index" :unit="child" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const router = useRouter()
const props = defineProps({
  unit: Object,
})
const expanded = ref(false)
const hasChildren = computed(() => {

  return props.unit.children && props.unit.children.length > 0;
})

const organizationExpertise = (organization) => {
    console.log(organization)
    router.push({ name: 'organizationExpertise', params: { organizationId: organization.id } })
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
</style>