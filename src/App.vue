<template>
  <div>
    <global-options-modal />
    <navbar />
    <b-container>
      <data-selection @data-updated="dataUpdated" />
      <b-tabs>
        <b-tab title="比對結果" active>
          <result-table
            :data="data"
            :openSourcePathData="openSourcePathData"
            :selfMaintainPathData="selfMaintainPathData"
            :isOpenSourcePathDataFetched="isOpenSourcePathDataFetched"
            :isSelfMaintainPathDataFetched="isSelfMaintainPathDataFetched"
          />
        </b-tab>
        <b-tab title="我的定位歷史">
          <data-table :data="data" />
        </b-tab>
        <b-tab title="確診者足跡(資料集A)">
          <path-data-table :pathData="selfMaintainPathData" />
        </b-tab>
        <b-tab title="確診者足跡(資料集B)">
          <path-data-table :pathData="openSourcePathData" />
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import * as geolib from 'geolib'
import Navbar from './components/Navbar'
import DataSelection from './components/DataSelection'
import DataTable from './components/DataTable'
import GlobalOptionsModal from './components/GlobalOptionsModal'
import ResultTable from './components/ResultTable'
import PathDataTable from './components/PathDateTable'

export default {
  components: {
    Navbar,
    DataSelection,
    DataTable,
    GlobalOptionsModal,
    ResultTable,
    PathDataTable
  },
  data() {
    return {
      data: {
        name: '',
        items: []
      },
      openSourcePathData: [],
      isOpenSourcePathDataFetched: false,
      selfMaintainPathData: [],
      isSelfMaintainPathDataFetched: false
    }
  },
  methods: {
    dataUpdated(data) {
      this.data = data
    }
  },
  mounted() {
    chrome.runtime.sendMessage({ event: 'FETCH_SELF_MAINTAIN_PATH' }, response => {
      console.log(response)
      if (response.error !== null) {
        this.$bvToast.toast(`取得資料時發生錯誤: ${response.error.message}`, {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger'
        })
        this.isSelfMaintainPathDataFetched = true
        return
      }
      this.selfMaintainPathData = response.items
      this.isSelfMaintainPathDataFetched = true
    })

    chrome.runtime.sendMessage({ event: 'FETCH_OPENSOURCE_PATH' }, response => {
      if (response.error !== null) {
        this.$bvToast.toast(`取得資料時發生錯誤: ${response.error.message}`, {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger'
        })
        this.isOpenSourcePathDataFetched = true
        return
      }
      // Convert dates to dates (Cannot be handled in fetchGoogleTimelineData method due to content background serialization)
      let items = response.items
      console.log(response)
      items = items
        .map(e => {
          e.date = new Date(`2021/${e.date}`)
          if (e.raw.geometry.coordinates[0].length > 0) {
            const center = geolib.getCenter(
              e.raw.geometry.coordinates[0].map(p => ({
                latitude: p[1],
                longitude: p[0]
              }))
            )
            e.location = {
              lat: center.latitude,
              lng: center.longitude
            }
          } else {
            e.location = {
              lat: e.raw.geometry.coordinates[1],
              lng: e.raw.geometry.coordinates[0]
            }
          }
          return e
        })
        .filter(item => !item.name.includes('快篩站'))

      this.openSourcePathData = items
      this.isOpenSourcePathDataFetched = true
    })
  }
}
</script>

<style lang="scss">
@media print {
  .nav-tabs li a:not(.active) {
    display: none !important;
  }
}

$body-color: #00203fff;
$theme-colors: (
  'primary': #3db2dcff
);
@import '../node_modules/bootstrap/scss/bootstrap';
@import '../node_modules/bootstrap-vue/src/index.scss';

.multiselect__tag {
  background-color: #3db2dcff !important;
}
.multiselect__option--highlight {
  background-color: #3db2dcff !important;
}
.multiselect__option--selected.multiselect__option--highlight {
  background-color: #3db2dcff !important;
}
</style>
