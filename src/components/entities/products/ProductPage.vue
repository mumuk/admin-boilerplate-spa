<template>
  <EntityPage
    entity-type="product"
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
              data-test="product-name"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="state.entity.categoryId"
              label="Category ID"
              variant="outlined"
              hide-details="auto"
              :items="listCategory"
              item-title="name"
              item-value="id"
              data-test="product-categoryId"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.description"
              label="Description"
              variant="outlined"
              hide-details="auto"
              data-test="product-categoryId"
            />
          </v-col>
          <v-col cols="12" class="d-flex">
          <v-col cols="4" class="d-flex justify-center align-center">
            <v-checkbox
              v-model="state.entity.hidden"
              label="Hidden"
            ></v-checkbox>
          </v-col>
          <ProductImageManagement
            :entity-id="state.entity.id"
            :image-url="state.entity.thumbnail as string"
            @save-image="saveThumbnail"
            @clear-image="saveThumbnail"
          />
          </v-col>
          <v-col cols="12">
            <product-tags
              :product-tags=state.entity.tags
              class="border ma-3 pa-1"
              @remove-tag="handleRemoveTag"

            />
            <product-tags
              :product-tags=state.entity.tags
              :all-tags="allTags"
              @add-tag="handleAddTag"
            />

          </v-col>
        </v-row>
      </div>
    </template>
  </EntityPage>


</template>

<script lang="ts">
import EntityPage from '@/components/common/EntityPage.vue';
import {defineComponent, onBeforeMount, reactive, watch, computed, ref, Ref} from 'vue';
import {useRouter} from 'vue-router';
import {Store, useStore} from 'vuex';
import {Product} from '@/models/entities/Product';
import ProductTags from "@/components/entities/products/ProductTags.vue";
import {EntityType} from "@/store/entityModules/types";
import {RootState} from "@/store/Store";
import {getEntityStorePath} from "@/store/entityModules/utils";
import {Tag} from "@/models/entities/Tag";
import ProductImageManagement from "@/components/entities/products/ProductImageManagement.vue";

interface State {
  entity: Product;
  loading: boolean;
}

const Component = defineComponent({
  name: 'ProductDialog',

  components: {
    ProductTags,
    EntityPage,
    ProductImageManagement
  },

  props: {
    id: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const router = useRouter();
    const product = new Product({});
    const entityType = EntityType.TAG;
    const store: Store<RootState> = useStore();
    const storePath = getEntityStorePath(entityType);
    const productTags = computed(() => state.entity.tags);

    const isNew = () => !props.id;
    let listCategory: Ref<string[]> = ref([]);
    let allTags: Ref<Tag[]> = ref([]);
    const localThumbnail = ref("");

    onBeforeMount(async () => {
      if (!isNew()) {
        const res = await store.dispatch(`productsModule/fetchItem`, props.id);
        if (!res) router.back();
      }
      allTags.value = await store.dispatch('tagsModule/fetchAllItems', undefined);
      listCategory.value = await store.dispatch(
        'categoriesModule/fetchAllItems',
        undefined,
      );
    });

    const state = reactive({
      entity: product,
      loading: computed(() => store.getters['productsModule/loading']),
      items: computed(() => store.getters[`${storePath}/items`]),
    }) as State;

    watch(
      () => store.getters['productsModule/selectedItem'],
      (newValue: Product) => Object.assign(product, newValue),
      {immediate: false, deep: true},
    );
    const title = computed(() => {
      if (state.loading) return '';
      if (isNew()) return 'New Product';
      const getSelectedItem = store.getters['productsModule/selectedItem'];
      return getSelectedItem.name;
    });

    const handleAddTag = (tag: Tag) => {
      const tagIndex = state.entity.tags.findIndex((t) => t.id === tag.id);
      if (tagIndex !== -1) return;
      state.entity.tags.push(tag);
      state.entity.tagIds.push(tag.id);
    };
    const handleRemoveTag = (tag: Tag) => {
      state.entity.tags = state.entity.tags.filter((t) => t.id !== tag.id);
      state.entity.tagIds = state.entity.tagIds.filter((id) => id !== tag.id);
    };

    const saveThumbnail = (url:string) => state.entity.thumbnail = url;

    return {
      allTags,
      productTags,
      handleAddTag,
      handleRemoveTag,
      saveThumbnail,
      state,
      title,
      isNew,
      listCategory,
      localThumbnail,
    };
  },
});
export default Component;
</script>

<style scoped>

</style>
