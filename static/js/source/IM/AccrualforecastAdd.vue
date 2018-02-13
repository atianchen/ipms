<template>
    <div class="gird">

            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2>Accrual Forecast<small>Accrual Forecast</small></h2>
                        <ul class="nav navbar-right panel_toolbox">

                        </ul>
                        <div class="clearfix"></div>
                    </div>

                        <div class="table-responsive">
                            <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
                        </div>

                        <div class="row">
                            <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
                                <button type="button" class="btn btn-primary" @click='createAccrualforecast'>New</button>
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
    import moment from 'moment'

    export default {
        data(){
            return {
                q:{},
                gridColumns:[{title:"Entry Sys Date", name:"entrysysdate"}],
                gridData:[],
                page:{}
            }
        },

        mounted:function(){

        },

        create:function(){

        },
        methods:{
            createAccrualforecast:function(ev){this.$router.push("/IM/accrualAdd");},
            itemClick:function(param){
                this.$router.push({ name:'AccrualforecastEdit', params:{ accrualforecastId: param}})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self = this;
                //let param = {q:util.qfilter(this.q),page:this.page,};
                $.post("/IM/accrualforecast/list",{page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }

        },

        components:{
            'hy-grid':Grid,
            'hy-gridPager':GridPager
        },

    }
</script>

