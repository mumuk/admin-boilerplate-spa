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
      :disabled="!file || !isValidSize || !isValidType"
      @click="saveThumbnail"
    >Save Thumbnail
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
import {computed, defineComponent, ref} from 'vue';
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
  emits: ['save-image'],

  setup(props, {emit}) {
    const localThumbnail = ref("");
    const file = ref(null);
    const isValidSize = ref(true);
    const isValidType = ref(true);
    const uploadStatus = ref(null)
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

      if (uploadStatus.value === 'success') {
        return {
          text: 'Thumbnail saved successfully!',
          class: 'success text-green'
        };
      }

      if (uploadStatus.value === 'error') {
        return {
          text: 'Error uploading the thumbnail. Please try again.',
          class: 'error text-red'
        };
      }

      return null;
    });


    const onFileChange = e => {
      const selectedFile = e.target.files[0];


      if (!selectedFile) return;

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
      const formData = new FormData();
      formData.append('thumbnail', file.value[0]);

      try {
        const res = await axios.post(`http://127.0.0.1:3030/products/${props.entityId}/thumbnail`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadStatus.value = 'success';
        const filePath = `uploads/${res.data.filename}`;
        emit('save-image', filePath);
      } catch (error) {
        uploadStatus.value = 'error';
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
