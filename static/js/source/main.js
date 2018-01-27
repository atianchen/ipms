/**
 * Created by jensen on 2017/1/13.
 */
import Vue from 'vue'
import router from './route.js';

new Vue({
    el: '#pmo',
    router,
    mounted: function() {
      initUI();
    }
})