import { RouteRecordRaw } from 'vue-router';

import ProductPage from '../components/entities/products/ProductPage.vue';
import TagPage from '../components/entities/tags/TagPage.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/products/new',
    component: ProductPage,
    name: 'NewProduct',
    meta: {
      title: 'New product',
      idProp: null,
    },
  },
  {
    path: '/products/:id',
    component: ProductPage,
    name: 'Product',
    meta: {
      title: 'Product',
      idProp: 'id',
    },
    props: true,
  },
  {
    path: '/tags/:id',
    component: TagPage,
    name: 'Tag',
    meta: {
      title: 'Tag',
      idProp: 'id',
    },
    props: true,
  },
];

export default routes;
