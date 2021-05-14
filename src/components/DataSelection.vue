<template>
  <div id="data-selection">
    <b-alert :show="error429 || error302" dismissible variant="danger">
      尚未登入<br />
      <a href="https://timeline.google.com/" target="_blank">請按這裡</a>
      登入 Google Timeline 存取您的定位歷史紀錄，您的歷史紀錄不會被上傳到任何伺服器，登入完成請回到本頁面重新整理
    </b-alert>
    <b-form inline>
      <label class="my-label">比對我最近</label>
      <b-form-group>
        <b-form-radio-group v-model="type" @input="fetchData()">
          <b-form-radio v-for="Type in Types" :value="Type" :key="Type">{{ Type }}</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
      <b-button variant="primary" v-if="fetching">
        <small>取得資料中，請稍待幾秒...<b-spinner small></b-spinner></small>
      </b-button>
      <b-button variant="primary" v-else @click="fetchData">
        <small><b-icon icon="arrow-clockwise" scale="1.2"></b-icon></small>
      </b-button>
    </b-form>
    <p class="description">
      本工具可以協助您比對Google定位紀錄以及確診者的足跡，如果您在確診者的足跡的300公尺的範圍內，會提醒您接近過高風險地區<br />
      感謝 areong 整理
      <a
        href="https://www.google.com/maps/d/u/0/viewer?mid=1rrk8w7jJsZGXz_hSpi0q9no77cdhMC2z&ll=0%2C0&z=8"
        target="_blank"
      >
        確診者足跡地圖
      </a>
      本工具也使用此資料內容
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
      error302: false,
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
      return new Date()
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
      this.error302 = false
      chrome.runtime.sendMessage({ event: 'FETCH_TIMELINE', from: this.fromDate, to: this.toDate }, response => {
        if (response.error !== null) {
          this.fetching = false

          if (!response.error.message) {
            this.error302 = true
            return
          } else if (response.error.message.includes('code 429')) {
            this.error429 = true
          }

          this.$bvToast.toast(`取得資料時發生錯誤: ${response.error.message}`, {
            title: 'Error',
            toaster: 'b-toaster-bottom-right',
            variant: 'danger'
          })
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
        console.log(response)
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
