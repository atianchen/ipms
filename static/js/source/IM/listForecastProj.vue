<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Project <small>Choose Project for cash forecast</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.name" placeholder="Project Name">
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
        data () {
            return {
                q:{},
                gridColumns: [{title:"Project Name",name:"name",click:"_id"},{title:"Project Id",name:"projectId"},{title:"Project Type",name:"type"},{title:"Task Id",name:"taskId"},{title:"System Project Id",name:"sysProj"},{title:"ContractId",name:"contract.contractId"},
                    {title:"Planned Milestone",name:"planedMilestones",join:"/"},{title:"Current Milestone",name:"currentMilestone"},{title:"PM",name:"pm.name"},{title:"Division",name:"division"},{title:"Create Date",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
                gridData:[],
                page:{}
            }
        },
        created:function(){
            let _self=this;
           this.pageSearch();
        },
        methods: {
            itemClick: function (param) {
                this.$router.push({ name:'cashForcast', params: { projId: param }})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self=this;
                $.post("/im/listForecastProj",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>