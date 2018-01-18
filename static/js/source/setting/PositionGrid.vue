<template>
 <div class="grid">
  <div class="col-md-12 col-sm-12 col-xs-12">
   <div class="x_panel">
    <div class="x_title">
     <h2>Position <small>Position List</small></h2>
     <ul class="nav navbar-right panel_toolbox">

     </ul>
     <div class="clearfix"></div>
    </div>
    <div class="x_content">

     <div class="table-responsive">
      <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
     </div>

    </div>
    <div class="row">
     <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
      <button type="button" class="btn btn-primary" @click='createRole'>New</button>
     </div>
     <hy-gridPager :page="page"  v-on:paginationClick="pagination"></hy-gridPager>
    </div>
   </div>
  </div>
 </div>
</template>

<script>
    import Grid from '../ctrl/Grid.vue'
    import GridPager from '../ctrl/GridPager.vue'
    import {util} from '../../dist/pageHelper.js'

    export default {
        data () {
            return {
                q:{},
                gridColumns: [{title:"Position Code",name:"code",click:"_id"},{title:"Position",name:"name"},{title:"Level",name:"level"},{title:"LevelRate",name:"levelRate"},{title:"STD Cost",name:"cost"},{title:"Currency",name:"currency"}],
                gridData:[],
                page:{}
            }
        },
        created:function(){
            let _self=this;
            $.post("/setting/position/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
        },
        methods: {
            createRole:function(ev){this.$router.push("/setting/positionAdd");},
            itemClick: function (param) {
                this.$router.push({ name:'positionEdit', params: { posId: param }})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self=this;
                $.post("/setting/position/list",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>

