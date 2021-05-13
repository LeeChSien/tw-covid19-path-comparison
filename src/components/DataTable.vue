<template>
  <b-card-body>
    <b-table striped hover :items="data.items" :fields="fields">
      <template #cell(timeBegin)="data">
        <span v-b-tooltip.hover :title="`${data.value}`">{{ data.value | moment('YYYY/MM/DD') }}</span>
      </template>
      <template #cell(timeEnd)="data">
        <span v-b-tooltip.hover :title="`${data.value}`">{{ data.value | moment('YYYY/MM/DD') }}</span>
      </template>
      <template #cell(duration)="data">
        <span v-b-tooltip.hover :title="`${data.value}`">{{ data.value | duration('humanize') }}</span>
      </template>
      <template #cell(distance)="data">
        <span v-b-tooltip.hover :title="`${data.value}`">{{ data.value | distance }}</span>
      </template>
      <template #cell(raw)="data">
        <a
          :href="
            `https://www.google.com/maps/search/?api=1&query=${data.value.geometry.coordinates[0][1]},${data.value.geometry.coordinates[0][0]}`
          "
          target="_blank"
          v-if="data.value.geometry.coordinates[0].length > 0"
        >
          {{ data.value.properties.name }}
        </a>
        <a
          :href="
            `https://www.google.com/maps/search/?api=1&query=${data.value.geometry.coordinates[1]},${data.value.geometry.coordinates[0]}`
          "
          target="_blank"
          v-else
        >
          {{ data.value.properties.name }}
        </a>
      </template>
    </b-table>
    <hr />
    <p class="text-muted">
      <i>Duration: {{ durationSum | duration('asHours') | round(2) }} hours</i>
      <i v-if="distanceSum">, Distance: {{ distanceSum | distance }}</i>
    </p>
  </b-card-body>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: 'timeBegin',
          sortable: true,
          label: '開始時間',
          thStyle: 'width: 100px'
        },
        {
          key: 'timeEnd',
          sortable: false,
          label: '結束時間',
          thStyle: 'width: 100px'
        },
        {
          key: 'raw',
          sortable: false,
          label: '地點'
        },
        {
          key: 'address',
          sortable: false,
          label: '地址'
        },
        {
          key: 'duration',
          sortable: false,
          label: '停留時間',
          thStyle: 'width: 120px'
        },
        {
          key: 'category',
          sortable: false,
          label: '分類'
        }
      ]
    }
  },
  computed: {
    durationSum() {
      return this.data.items.reduce((sum, item) => {
        return sum + item.duration
      }, 0)
    },
    distanceSum() {
      return this.data.items.reduce((sum, item) => {
        if (item.distance !== undefined) {
          return sum === undefined ? item.distance : sum + item.distance
        }
        return undefined
      }, undefined)
    }
  }
}
</script>
<style scoped></style>
