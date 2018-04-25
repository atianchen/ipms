<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cash-in Actual Entry</h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>

            <div class="x_content">
                <div class="row qrbar">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control cold-md-2" v-model="q.contractId" placeholder="ContractId">
                                </div>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="pageSearch">Search</button>
                            </li>
                        </ul>
                    </div>
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
                q:{},
                gridColumns:[{title:"ContractId",name:"contract.contractId",click:"_id"},{title:"Project Name",name:"name"},{title:"Project Id",name:"projectId"},
                    {title:"Customer Name",name:"contract.customerName"},{title:"Amount",name:"contract.amt"},{title:"Currency",name:"contract.currency"},{title:"Division",name:"contract.division"},
                     {title:"Imp(%)",name:"contract.imp"}],
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
                this.$router.push({name:"cashinactual",params:{projId:param}})
            },
            pagination: function(page){
                this.page.pn=page;
                this.pageSearch();
            },
            pageSearch: function(){
                let _self=this;
                $.post("/im/listCashinActual",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }

        },
        components:{
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>
