<template>
    <v-autocomplete clearable chips closable-chips v-model="selectedTags" :items="filteredTags" multiple
        item-title="name" item-value="name" auto-select-first hide-no-data hide-selected small-chips
        label="Voeg tags toe" append-icon="mdi-tag-plus" @blur="handleBlurOnTags" :custom-filter="customFilter"
        @update:model-value="handleSelectionUpdate" clear-on-select ref="autocompleteRef" class="ma-0 mt-5">
        <!-- selected items -->
        <template v-slot:chip="{ props, item }">
            <v-chip v-bind="props" :text="item.raw.name"></v-chip>
        </template> <!-- to select -->
        <template v-slot:item="{ props, item }">
            <v-chip v-bind="props" :text="item.raw.name" class="chippie"></v-chip>
        </template>
    </v-autocomplete>
</template>

<script setup>
import { watch, onMounted,ref,computed } from 'vue';

const props = defineProps({
    tags: { // the collection of strings the user can select from
        type: Array
    },
    theTags: { // the collection of strings already selected
        type: Array
    }

})

const emit = defineEmits(['tagSelectionChanged']) // the event to indicate that the selection of tags has changed; the payload of the event is the collection of selected tags

const selectedTags = ref([])

watch(() => props.theTags, (newValue, oldValue) => { // handle changes in the set of selected tags
    if (newValue !=selectedTags.value) {
        selectedTags.value = props.theTags        
    }
})

// TODO watch props.tags for changes - update the set of tags available for selection  

const tagsAdded = ref([]) // tags defined by the user inside this component
const filteredTags = computed(() => {
    const tagArray = Array.from(props.tags).concat(tagsAdded.value)
    const tags = tagArray.map((tag) => {
        return { name: tag }
    })
    return tags
})

const searchTagsField = ref('')
const searchField = ref('')
const autocompleteRef = ref(null)

const handleBlurOnTags = (event) => {
    console.log('blur, current search value on tags ', searchField.value)
    if (searchField.value !== '' && !elementAdded) {
        filteredTags.value.find(element => element === searchField.value) === undefined ? tagsAdded.value.push(searchField.value) : console.log('value already exists in filtered Tags')
            if (selectedTags.value && selectedTags.value.length > 0) {
            const selectedTag = selectedTags.value.find(element => element === searchField.value)
            if (selectedTag === undefined) { 
                selectedTags.value.push(searchField.value)
                emit('tagSelectionChanged', selectedTags.value)
            }
        }
        searchTagsField.value = ''
        searchField.value = ''
        autocompleteRef.value.search = ''
    }
    elementAdded = false

}
const customFilter = (itemTitle, queryText, item) => {
    elementAdded = false
    // Add any custom logic for determining if an item should be included based on the queryText entered by the user
    const textOne = item.raw.name.toLowerCase()
    const searchText = queryText.toLowerCase()
    searchField.value = queryText
    return queryText.length > -1 && textOne.indexOf(searchText) > -1
}

let elementAdded = false
const handleSelectionUpdate = (event) => {
    emit('tagSelectionChanged', selectedTags.value)
    elementAdded = true
}

onMounted(() => {
   selectedTags.value = props.theTags
})


</script>
<style scoped>
.chippie {
    flex: 1 0 auto;
    margin: 4px;
    background-color: yellow
}
</style>