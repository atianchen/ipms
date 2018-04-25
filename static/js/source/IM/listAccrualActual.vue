<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Accrual Actual Entry</h2>
                    <ul class="nav navbar-right panel_toolbox">
                    </ul>
                </div>

                <div class="x_content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control cold-md-2" v-model="q.projectId" placeholder="projectId">
                                </div>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="pageSearch">Search</button>
                            </li>
                        </ul>
                    </div>
                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>

                    </div>
                </div>
                <div class="row">
                    <hy-gridPager :page="page"  v-on:paginationClick="pagination"></hy-gridPager>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Grid from '../ctrl/Grid.vue'
    import GridPager from '../ctrl/GridPager.vue'
    import ajaxDownload  from '../ctrl/ajaxDownload'
    import {util} from '../../dist/pageHelper.js'

    export default {
       data(){
           return{
               q:{person:[]},
               gridColumns:[{title:"ProjectId",name:"projectId",click:'_id'},{title:"Project Name",name:"name",click:"_id"},{title:"Type",name:"type"},
                   {title:"Progress",name:"progress"},{title:"Division",name:"division"}, {title:"PM",name:"pm.name"},{title:"Project Amount",name:"projAmt"},
                   {title:"Completed Milestone",name:"completedMilestone"},{title:"Current Milestones",name:"currentMilestone"},
                   {title:"Accumluated Completed Accrual",name:"accComAccrual"}],
                gridData:[],
                page:{}
                 }
            },
       created:function(){
             let _self=this;
             this.pageSearch();
            },
       methods:{
           itemClick: function(param){
               this.$router.push({name:"accrualactual",params:{projId:param}})
           },
           pagination: function(page){
               this.page.pn=page;
               this.pageSearch();
           },
           pageSearch: function(){
               let _self=this;
               $.post("/im/listAccrualActual",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
           }
        },
        components:{
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>

<style scoped>

</style>