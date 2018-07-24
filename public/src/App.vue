<template>
    <div id="app">
		<transition name="page-fade-in-up" mode="out-in">
			<router-view/>
		</transition>
    </div>
</template>

<script>
	import api from './js/api/index'
	import {mapState} from 'vuex'
	import {update} from'./js/plugins/account.js'

	export default {
		computed : mapState(['key']),
		created () {
			update(this.$store)
		}
	}
</script>

<style lang="scss">
	@import "./css/normalize.css";
	@import "./css/layout.css";
	@import "./css/iconfont.css";
	@import "./css/animate.css";

	#app{
		height: 100%
	}
</style>
