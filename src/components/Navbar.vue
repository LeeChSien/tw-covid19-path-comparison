<template>
  <b-navbar toggleable="lg" type="light" variant="light">
    <b-container>
      <b-navbar-brand href="/index.html">
        <img src="icons/icon.svg" alt="Timline exporter" width="25px" />
        台灣新冠疫情足跡比對 <b-badge variant="primary">Beta</b-badge>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!---
          <b-nav-item v-b-modal.global-options-modal>
            <span class="navbar-icon"><b-icon icon="gear-fill" variant="primary" aria-hidden="true"></b-icon></span>
          </b-nav-item>
          -->
          <b-nav-item-dropdown :text="`v${packageVersion}`" right>
            <b-dropdown-item href="https://github.com/LeeChSien/tw-covid19-path-comparison">Github</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
const PACKAGE_VERSION = require('../../package.json').version

export default {
  data() {
    return {
      packageVersion: PACKAGE_VERSION
    }
  }
}
</script>

<style scoped>
.navbar-icon {
  font-size: 14px;
}
</style>
