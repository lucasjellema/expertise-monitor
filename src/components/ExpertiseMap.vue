<template>
    <v-responsive>
        <v-container fluid tag="section" aria-labelledby="title">
            <v-main>

                <v-row>
                    <v-col cols="3">
                        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details
                            @change="handleSearchChange" @keyup="handleSearchChange"></v-text-field>
                        <!-- TODO show list of expertises (and tags?) that match the search -->
                        <!-- 
                        <v-data-table :headers="headers" :items="searchSuggestions" item-value="id" item-key="id"
                            v-model="selectedSearchSuggestions" class="elevation-1 dense-table row-height-50"
                            show-select dense v-if="searchSuggestions.length > 0" return-object>
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Search Suggestions</v-toolbar-title>
                                </v-toolbar>
                            </template>

</v-data-table> -->
                        <v-select v-model="selectedSearchSuggestions" :items="searchSuggestions" item-title="name"
                            return-object label="Show expertise for" multiple clearable ref="searchSuggestionSelect"
                            :item-props="selectItemProps">
                            <template v-slot:prepend-item>
                                <v-list-item title="Select All" @click="toggle">
                                    <!-- <template v-slot:prepend>
          <v-checkbox-btn
            :model-value="likesAllFruit"
          ></v-checkbox-btn>
        </template> -->
                                </v-list-item>

                                <v-divider class="mt-2"></v-divider>
                            </template>

                            <!-- <template v-slot:append-item>
      <v-divider class="mb-2"></v-divider>

      <v-list-item
        :subtitle="subtitle"
        :title="title"
        disabled
      >
        <template v-slot:prepend>
          <v-avatar color="primary" icon="mdi-food-apple"></v-avatar>
        </template>
      </v-list-item>
    </template> -->
                        </v-select>


                        <!-- TODO search in notes? author? domein/company? -->
                    </v-col>
                    <v-col cols="7" offset="0">
                        <!-- TODO add toggle: AND / OR (at least one tag must apply or all selected tags must apply) -->


                        <v-chip-group v-model="checkedTags" column multiple>
                            <v-chip v-for="tag in availableTags" :key="tag" :text="tag" filter></v-chip>
                        </v-chip-group>
                        <v-btn @click="checkedTags = []" icon="mdi-cancel" title="Clear all tags"></v-btn> </v-col>
                </v-row>
                <v-row>
                    <v-col cols="10" offset="1">
                        <div id="app">
                            <ExpertiseUnit :unit="initializeExperiseStructureForTag(tag)"
                                v-for="tag in checkedTags.map(tag => availableTags[tag])" :key="tag" />
                        </div>
                        <div id="app2">
                            <ExpertiseUnit :unit="initializeExperiseStructureForExpertise(suggestion.expertise)"
                                v-for="suggestion in selectedSearchSuggestions" :key="suggestion" />
                        </div>
                    </v-col>
                </v-row>
            </v-main>
        </v-container>
    </v-responsive>

</template>


<script setup>

const props = defineProps({
    organization: {
        type: Array,
        required: true
    }
})
import { useAppStore } from "@/stores/app";
const appStore = useAppStore()

const selectedTags = ref(appStore.expertiseTags)
let expertiseClaimMap = {}
let tagClaimMap = {}
const checkedTags = ref([])
const availableTags = ref([])
const search = ref('')
const searchSuggestions = ref([])
const selectedSearchSuggestions = ref([])

const searchSuggestionSelect = ref(null)

const
    headers = ref([
        { title: 'Name', value: 'name', sortable: true, width: '180px' },
        { title: 'Type', value: 'type', width: '100px' }
    ])


const toggle = () => {
    if (selectedSearchSuggestions.value.length > 0) {
        selectedSearchSuggestions.value = []
    } else {
        selectedSearchSuggestions.value = searchSuggestions.value
    }
}
const selectItemProps = (item) => {
    return {
        title: item.name,
        subtitle: item.type,
    }
}

const handleSearchChange = (e) => {
    console.log('new search on ', search.value, e)
    console.log(selectedSearchSuggestions.value, searchSuggestions.value)
    // find all expertises (lower case) who contain the search string
    // add them to the list
    searchSuggestions.value = []
    searchSuggestionSelect.value.menu = false
    // TODO remove all search suggestions that are not selected
    if (search.value.length > 1) {

        const filteredExpertise = []
        appStore.getExpertise().value.expertise.filter(expertise => expertise.name.toLowerCase().includes(search.value.toLowerCase())).forEach(expertise => {
            filteredExpertise.push(expertise)
        })
        console.log(filteredExpertise)
        if (filteredExpertise.length > 0) {
            searchSuggestions.value = filteredExpertise.map(expertise => { return { name: expertise.name, expertise: expertise, type: 'expertise' } })
        }

        searchSuggestionSelect.value.menu = true
    }
}

// build a map with all expertise claims of all organizations 
const buildExpertiseClaimMap = () => {
    expertiseClaimMap = {}
    tagClaimMap = {}
    for (const org of props.organization) {
        if (org?.expertiseClaims && org.expertiseClaims.length > 0) {
            for (const claim of org.expertiseClaims) {
                if (!expertiseClaimMap[claim.expertiseId]) {
                    expertiseClaimMap[claim.expertiseId] = { total: ensureNumeric(claim.count), expertise: [{ ...claim, organization: org }] } // claim.count
                } else {
                    expertiseClaimMap[claim.expertiseId].total += ensureNumeric(claim.count)
                    expertiseClaimMap[claim.expertiseId].expertise.push({ ...claim, organization: org })

                }
                // if (claim.expertise.tags && claim.expertise.tags.length > 0) {
                //     for (const tag of claim.expertise.tags) {
                //         if (!tagClaimMap[tag]) {
                //             tagClaimMap[tag] = { total: claim.count, expertise: [{ expertise: claim.expertise, count: claim.count }] }
                //         } else {
                //             tagClaimMap[tag].total += claim.count
                //             tagClaimMap[tag].expertise.push({ expertise: claim.expertise, count: claim.count })
                //         }
                //     }
                // }
            }
        }
    }
    console.log('expertiseClaimMap', expertiseClaimMap)
    console.log('tagClaimMap', tagClaimMap)
}


const expertiseStructure = ref(null)
const initializeExperiseStructureForTag = (tag) => {
    const expertiseStructure = ref(null)
    expertiseStructure.value = {
        name: tag, count: 0,
        children: []
    }
    // loop over all expertises in tag
    const m = appStore.tagExpertiseMap.value || appStore.tagExpertiseMap
    const expertisesUnderTag = m[tag]
    if (expertisesUnderTag) {
        let countForTag = 0;
        for (const expertise of expertisesUnderTag) {
            const e = expertiseClaimMap[expertise.id]
            if (e) {
                const node = { name: expertise.name, children: [], count: e.total, type: 'expertise', expertise: expertise }
                countForTag += ensureNumeric(e.total)
                expertiseStructure.value.children.push(node)
                for (const claim of e.expertise) {
                    const orgNode = { name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization }
                    node.children.push(orgNode)
                }
            }
            // else no claims for this expertise, not currently available in the ecosystem; include a node for this expertise?
            else {
                const node = { name: expertise.name, children: [], count: 0, type: 'expertise', expertise: expertise }
                expertiseStructure.value.children.push(node)
            }
        }
        expertiseStructure.value.count = countForTag
    }
    return expertiseStructure.value
}

const initializeExperiseStructureForExpertise = (expertise) => {
    const expertiseStructure = ref(null)
    expertiseStructure.value = {
        name: expertise.name, count: 0,
        children: [], expertise: expertise
    }
    const e = expertiseClaimMap[expertise.id]
    if (e) {
        expertiseStructure.value.count = e.total
        for (const claim of e.expertise) {
            const orgNode = { name: claim.organization.name, children: [], count: claim.count, type: 'expertiseClaim', expertise: expertise, organization: claim.organization }
            expertiseStructure.value.children.push(orgNode)
        }
    }

    return expertiseStructure.value
}


onMounted(() => {
    availableTags.value = [...appStore.expertiseTags]
    buildExpertiseClaimMap()
})



function ensureNumeric(value) {
    // Check if the value is a string and if it represents a valid number
    if (typeof value === 'string' && !isNaN(value) && !isNaN(parseFloat(value))) {
        // Convert the string to a number
        return Number(value);
    }
    // If the value is already a number, or it's not a valid number string, return it as is
    return value;
}


</script>
<style scoped>
.always-open-select .v-input__control {
    pointer-events: none;
    /* Disable pointer events to prevent clicks */
}

.always-open-select .v-select__selections {
    display: none;
    /* Hide the default selection display */
}
</style>