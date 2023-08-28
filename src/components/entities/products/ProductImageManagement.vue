<template>
  <v-col cols="4" align="center">
    <v-file-input
      v-model="file"
      class="w-75"
      label="Upload thumbnail"
      prepend-icon=""
      @change="onFileChange"

    ></v-file-input>

    <span v-if="message" :class="message.class">{{ message.text }}</span>

    <v-btn
      class="w-75 mt-3"
      :disabled="!isValidSize || !isValidType"
      @click="saveThumbnail"
    >
      <span v-if="file">Save Thumbnail</span>
      <span v-if="!file">Clear Existing Thumbnail</span>
    </v-btn>

  </v-col>

  <v-col cols="4" align="center">
    <img

      v-if="localThumbnail"
      :src="localThumbnail"
      alt="Thumbnail Preview"
      width="100"
      height="100"
    />
    <img
      v-else-if="imageUrl"
      :src="computedImageUrl"
      :alt="imageName"
      width="100"
      height="100"
    />
  </v-col>

</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import axios from "axios";

export default defineComponent({
  name: 'ImageManagement',

  props: {
    entityId: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    }
  },
  emits: ['save-image', 'clear-image'],

  setup(props, {emit}) {
    const localThumbnail = ref("");
    const file = ref(null);
    const isValidSize = ref(true);
    const isValidType = ref(true);
    const resultStatus = ref(null)
    const computedImageUrl = `${import.meta.env.VITE_VUE_APP_API_URL}${props.imageUrl}`;
    const imageName = props.imageUrl?.match(/-(\w+)\.jpg$/)?.[1];

    const message = computed(() => {
      if (!isValidSize.value) {
        return {
          text: 'File size should be less than 1 MB!',
          class: 'error text-red'
        };
      }

      if (!isValidType.value) {
        return {
          text: 'File type should be either JPG or PNG!',
          class: 'error text-red'
        };
      }

      if (resultStatus.value === 'success') {
        return {
          text: 'Thumbnail saved successfully!',
          class: 'success text-green'
        };
      }
      if (resultStatus.value === 'delete success') {
        return {
          text: 'Thumbnail deleted successfully!',
          class: 'success text-green'
        };
      }

      if (resultStatus.value === 'error') {
        return {
          text: 'Error uploading the thumbnail. Please try again.',
          class: 'error text-red'
        };
      }

      return null;
    });

    watch(file, (newFile) => {
      if (Array.isArray(newFile) && newFile.length === 0) {
        file.value = null;
      }
    });

    const onFileChange = e => {
      const selectedFile = e.target.files[0];

      isValidSize.value = selectedFile.size <= 1024 * 1024;

      const acceptedFileTypes = ['image/jpeg', 'image/png'];
      isValidType.value = acceptedFileTypes.includes(selectedFile.type);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(selectedFile);
      fileReader.onload = () => {
        localThumbnail.value = fileReader.result as string;
      }
    };

    const saveThumbnail = async () => {
      if (!file.value && props.imageUrl) {
        try {
          const res = await axios.delete(`http://127.0.0.1:3030/products/${props.entityId}/thumbnail`, {});
          if (res.status === 204) {
            resultStatus.value = 'delete success';
            emit('save-image', '');
            localThumbnail.value = null;
          }
        } catch (e) {
          resultStatus.value = 'error';
        }
      }

      const formData = new FormData();
      if (file.value) {
        formData.append('thumbnail', file.value[0]);

        try {
          const res = await axios.post(`http://127.0.0.1:3030/products/${props.entityId}/thumbnail`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          resultStatus.value = 'success';
          const filePath = `uploads/${res.data.filename}`;
          emit('save-image', filePath);
        } catch (error) {
          resultStatus.value = 'error';
        }
      }
    };

    return {
      localThumbnail,
      file,
      onFileChange,
      saveThumbnail,
      isValidType,
      isValidSize,
      computedImageUrl,
      imageName,
      message
    };
  }
});
</script>
