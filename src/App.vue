<template>
  <div>
    <global-options-modal />
    <navbar />
    <b-container>
      <data-selection @data-updated="dataUpdated" />
      <b-tabs>
        <b-tab title="比對結果" active>
          <result-table :data="data" :path="path" />
        </b-tab>
        <b-tab title="我的定位歷史">
          <data-table :data="data" />
        </b-tab>
        <b-tab title="確診者足跡">
          <path-table :path="path" />
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import * as Papa from 'papaparse'
import Navbar from './components/Navbar'
import DataSelection from './components/DataSelection'
import DataTable from './components/DataTable'
import GlobalOptionsModal from './components/GlobalOptionsModal'
import ResultTable from './components/ResultTable'
import PathTable from './components/PathTable'

export default {
  components: {
    Navbar,
    DataSelection,
    DataTable,
    GlobalOptionsModal,
    ResultTable,
    PathTable
  },
  data() {
    return {
      data: {
        name: '',
        items: []
      },
      path: []
    }
  },
  methods: {
    dataUpdated(data) {
      this.data = data
    }
  },
  mounted() {
    const pathDB = 'https://gist.githubusercontent.com/LeeChSien/841d69870fb457a253f7a28318034860/raw/path.csv'
    Papa.parse(pathDB, {
      download: true,
      complete: results => {
        // console.log(results.data)
        results.data.forEach(row => {
          this.path.push({
            date: new Date(row[0]),
            name: row[1],
            address: row[2],
            location: {
              lat: row[3],
              lng: row[4]
            }
          })
        })
      }
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
