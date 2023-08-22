<template>
  <div   class="border ma-3 pa-3 h-50">
    <div>
      <h3 v-if="!withAllTags&&!displayTags.length">No tags added</h3>
      <h3 v-else-if="!withAllTags&&displayTags.length">Remove tags from the product</h3>
      <h3 v-else-if="withAllTags&&!displayTags.length">All tags added!</h3>
      <h3 v-else>Add tag to the product</h3>
    </div>
    <div>
      <v-chip
        v-for="tag in displayTags"
        :key="tag.id"
        :color="withAllTags ? 'light-green' : 'light-red'"
        :text-color="withAllTags ? 'dark-green' : 'dark-red'"
        class="border ma-3 pa-3 "
        @click="handleTagClick(tag)"
      >{{ tag.name }}
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {Store, useStore} from "vuex";
import {RootState} from "@/store/Store.js";
import Entity from "@/models/entities/Entity";
import {Tag} from "@/models/entities/Tag";

interface State {
  loading: boolean;
  items: Entity[];
  total: number;
}


const Component = defineComponent({
  name: 'ProductTags',
  props: {
    allTags: {
      type: Array<Tag>,
      default: () => [],
    },
    productTags: {
      type: Array<Tag>,
      default: () => [],
    },
  },
  emits: ['add-tag', 'remove-tag'],

  setup(props, {emit}) {
    const withAllTags = computed(() => props.allTags?.length > 0);
    const allTags = computed(() => props.allTags);
    const productTags = computed(() => props.productTags);


    const displayTags = computed(() => {
      if (!withAllTags.value) {
        return props.productTags;
      }
        return allTags.value.filter(tag => !productTags.value.some(pTag => pTag.id === tag.id));
    });

    const handleTagClick = (tag: Tag) => {
      if (!withAllTags.value) {
        emit('remove-tag', tag)
        return
      }
      emit('add-tag', tag)
    }

    return {
      handleTagClick,
      displayTags,
      withAllTags
    };
  },
});
export default Component;


</script>

<style scoped>

</style>
