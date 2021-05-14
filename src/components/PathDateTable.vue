<template>
  <b-card-body>
    <b-table striped hover :items="pathData" :fields="fields">
      <template #cell(date)="data">
        <span v-b-tooltip.hover :title="`${data.value}`">{{ data.value | moment('YYYY/MM/DD') }}</span>
      </template>
      <template #cell(location)="data">
        <a
          :href="`https://www.google.com/maps/search/?api=1&query=${data.value.lat},${data.value.lng}`"
          target="_blank"
          v-if="data.value.lat && data.value.lng"
        >
          {{ `(${data.value.lat}, ${data.value.lng})` }}
        </a>
      </template>
    </b-table>
    <hr />
  </b-card-body>
</template>

<script>
export default {
  props: {
    pathData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: 'date',
          sortable: true,
          label: '日期'
        },
        {
          key: 'name',
          sortable: false,
          label: '地點'
        },
        {
          key: 'address',
          sortable: false,
          label: '地址'
        },
        {
          key: 'location',
          sortable: false,
          label: '座標'
        }
      ]
    }
  }
}
</script>
<style scoped></style>
