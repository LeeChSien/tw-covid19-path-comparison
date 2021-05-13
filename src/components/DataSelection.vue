<template>
  <div id="data-selection">
    <b-alert :show="error429" dismissible variant="danger">
      您尚未授權<br />
      <a href="https://timeline.google.com/">請按這裡</a>
      取得Google權限存取您的定位歷史紀錄，您的歷史紀錄不會被上傳到任何伺服器
    </b-alert>
    <b-form inline>
      <label class="my-label">比對我最近</label>
      <b-form-group>
        <b-form-radio-group v-model="type" @input="fetchData()">
          <b-form-radio v-for="Type in Types" :value="Type" :key="Type">{{ Type }}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <b-button variant="primary" v-if="fetching">
        <small>比對中，請稍待幾秒...<b-spinner small></b-spinner></small>
      </b-button>
      <b-button variant="primary" v-else @click="fetchData">
        <small><b-icon icon="arrow-clockwise" scale="1.2"></b-icon></small>
      </b-button>
    </b-form>
    <p class="description">
      本工具可以協助您比對您的Google定位紀錄以及確診者的足跡，如果您在確診者的足跡的300公尺的範圍內，會提醒您接近過高風險地區
    </p>
  </div>
</template>

<script>
import globalOptions from '../services/global_options'
import { getTwoWeeksAgo, getOneMonthAgo } from '../util/date'

const Types = {
  BIWEEK: '兩週',
  MONTH: '一個月'
}

export default {
  data() {
    return {
      globalOptions,
      type: Types.BIWEEK,
      Types: Types,
      from: new Date(),
      to: new Date(),
      error429: false,
      fetching: false
    }
  },
  computed: {
    fromDate() {
      switch (this.type) {
        case Types.BIWEEK:
          return getTwoWeeksAgo()
        case Types.MONTH:
          return getOneMonthAgo()
        default:
          return new Date(this.from)
      }
    },
    toDate() {
      return new Date('2020/05/15')
      // return new Date()
    }
  },
  created() {
    if (globalOptions.autoFetch) {
      this.fetchData()
    }
  },
  methods: {
    dateChanged() {
      if (globalOptions.autoFetch) {
        this.fetchData()
      }
    },
    fetchData() {
      this.$emit('data-updated', { name: '', items: [] })

      this.fetching = true
      this.error429 = false
      chrome.runtime.sendMessage({ from: this.fromDate, to: this.toDate }, response => {
        if (response.error !== null) {
          if (response.error.message.includes('code 429')) {
            this.error429 = true
          }
          this.$bvToast.toast(`取得資料時發生錯誤: ${response.error.message}`, {
            title: 'Error',
            toaster: 'b-toaster-bottom-right',
            variant: 'danger'
          })
          this.fetching = false
          return
        }
        // Convert dates to dates (Cannot be handled in fetchGoogleTimelineData method due to content background serialization)
        const data = response.data
        data.items = data.items.map(e => {
          e.timeBegin = new Date(e.timeBegin)
          e.timeEnd = new Date(e.timeEnd)
          e.distance = parseInt(e.distance)
          e.duration = parseInt(e.duration)
          return e
        })
        console.log(data)
        this.$emit('data-updated', data)
        this.fetching = false
      })
    }
  }
}
</script>
<style>
#data-selection {
  margin-top: 10px;
  margin-bottom: 10px;
}
.b-form-datepicker {
  width: 300px !important;
}
.my-label {
  margin-right: 10px;
}
.description {
  margin: 20px 0;
}
</style>
