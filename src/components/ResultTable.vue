<template>
  <b-card-body>
    <b-alert show variant="warning" v-if="isChecking">正在比對中...</b-alert>
    <b-alert show variant="success" v-else-if="Object.keys(closePoints).length === 0">
      尚未發現您接近過高風險場所
    </b-alert>
    <b-alert show variant="danger" v-else>
      您可能接近過下列高風險場所：
      <ul>
        <li v-for="name in Object.keys(closePoints)" :key="name">
          <a
            :href="
              `https://www.google.com/maps/search/?api=1&query=${closePoints[name].entry.location.lat},${closePoints[name].entry.location.lng}`
            "
            target="_blank"
          >
            [{{ closePoints[name].entry.date | moment('YYYY/MM/DD') }}] {{ name }},{{ closePoints[name].entry.address
            }}{{ closePoints[name].description ? `(${closePoints[name].description})` : '' }}
          </a>
        </li>
      </ul>
      <hr />
      <ul>
        <li>
          曾出入相關場所民衆請進行自我健康監測，若於5/25前出現發燒、上呼吸道、腹瀉、嗅味覺異常等症狀，應佩戴醫用口罩，儘速至就近指定社區採檢院所就醫，不得搭乘大衆運輸。
        </li>
        <li>就醫時請主動告知接觸史、旅遊史、職業暴露・周遭其他人是否有類似症狀等。</li>
        <li>相關疑問請撥打1922。</li>
      </ul>
    </b-alert>
  </b-card-body>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    openSourcePathData: {
      type: Array,
      required: true
    },
    selfMaintainPathData: {
      type: Array,
      required: true
    },
    isOpenSourcePathDataFetched: {
      type: Boolean,
      required: true
    },
    isSelfMaintainPathDataFetched: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isChecking: false,
      closePoints: {}
    }
  },
  watch: {
    $props: {
      handler() {
        if (
          this.data &&
          this.data.items.length > 0 &&
          this.isOpenSourcePathDataFetched &&
          this.isSelfMaintainPathDataFetched
        ) {
          console.log('ok')
          this.isChecking = true
          chrome.runtime.sendMessage(
            {
              event: 'COMPARE',
              myHistory: this.data,
              pathSetA: this.openSourcePathData,
              pathSetB: this.selfMaintainPathData
            },
            response => {
              console.log(response)
              this.isChecking = false
              if (response.error !== null) {
                this.$bvToast.toast(`比對資料時發生錯誤: ${response.error.message}`, {
                  title: 'Error',
                  toaster: 'b-toaster-bottom-right',
                  variant: 'danger'
                })
                return
              }
              this.closePoints = response.closePoints
            }
          )
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style scoped></style>
