<template>
  <EntityDialog
    entity-type="tag"
    :title="title"
    :item="state.entity"
    :loading="state.loading"
    :is-new="isNew()"
    :is-deletable="!isNew()"
  >
    <template #form-content>
      <div>
        <v-row align="start">
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.name"
              label="Name"
              variant="outlined"
              required
              hide-details="auto"
              :rules="rules.name"
              data-test="tag-name"
            />
          </v-col>



        </v-row>
      </div>
    </template>
  </EntityDialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed} from 'vue';
import EntityDialog from '@/components/common/EntityDialog.vue';
import { useStore } from 'vuex';
import {Tag} from "@/models/entities/Tag";
interface State {
  entity: Tag;
  loading: boolean;
}

const Component = defineComponent({
  name: 'TagDialog',

  components: {
    EntityDialog,
  },

  props: {
    id: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const store = useStore();
    const tag = new Tag({});
    const isNew = () => !props.id;



    const state = reactive({
      entity: tag,
      loading: computed(() => store.getters['tagsModule/loading']),
    }) as State;
    watch(
      () => store.getters['tagsModule/selectedItem'],
      (newValue: Tag) => Object.assign(tag, newValue),
      { immediate: false, deep: true },
    );

    const title = computed(() => {
      if (state.loading) return '';
      if (isNew()) return 'New Tag';
      const getSelectedItem = store.getters['tagsModule/selectedItem'];
      return getSelectedItem.name;
    });

    const rules = {
      name: [(v: string) => !!v || 'Name is required'],
    };

    return {
      state,
      title,
      rules,
      isNew,
    };
  },
});
export default Component;
</script>

<style scoped></style>
