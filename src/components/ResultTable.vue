<template>
  <b-card-body>
    <b-alert show variant="success" v-if="closePoints.length === 0">尚未發現您接近過高風險場所</b-alert>
    <b-alert show variant="danger" v-else>
      您可能接近過下列高風險場所：
      <ul>
        <li v-for="closePoint in closePoints" :key="closePoint.name">
          {{ closePoint.name }},
          {{ closePoint.address }}
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
import { getDistance } from 'geolib'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    path: {
      type: Array,
      required: true
    }
  },
  computed: {
    closePoints() {
      if (this.data.items.length === 0) {
        return []
      } else {
        const _closePoints = []
        for (const myPoint of this.data.items) {
          const myLat =
            myPoint.raw.geometry.coordinates[0].length > 0
              ? myPoint.raw.geometry.coordinates[0][1]
              : myPoint.raw.geometry.coordinates[1]
          const myLng =
            myPoint.raw.geometry.coordinates[0].length > 0
              ? myPoint.raw.geometry.coordinates[0][0]
              : myPoint.raw.geometry.coordinates[0]

          for (const riskPoint of this.path) {
            if (!riskPoint.location.lat || !riskPoint.location.lng) {
              continue
            }
            const distance = getDistance(
              { latitude: myLat, longitude: myLng },
              { latitude: riskPoint.location.lat, longitude: riskPoint.location.lng }
            )

            if (distance < 300 && myPoint.timeBegin > riskPoint.date && !_closePoints.includes(riskPoint)) {
              _closePoints.push(riskPoint)
            }
          }
        }
        return _closePoints
      }
    }
  }
}
</script>
<style scoped></style>
