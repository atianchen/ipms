<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cashinforecast <small>Cashinforecast List</small></h2>
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
                        <button type="button" class="btn btn-primary" @click='createCashinforecast'>New</button>
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
        data () {
            return {
                q:{},
                gridColumns: [{title:"EntrySysDate",name:"entrySysDate",click:"_id"},{title:"ContractID",name:"custractID"},{title:"Customer",name:"customer"},
                    {title:"ProjectID",name:"projectID"},{title:"Amount",name:"amount"},{title:"Cumency",name:"cumency"},
                    {title:"PaymentTerm",name:"paymentTerm"},{title:"Date-WK1",name:"date-WK1"},{title:"Date-WK2",name:"date-WK2"},
                    {title:"Date-WK3",name:"date-WK3"},{title:"Date-WK4",name:"Date-WK4"},{title:"Date-WK5",name:"date-WK5"},
                    {title:"Date-WK6",name:"date-WK6"},{title:"Date-WK7",name:"date-WK7"},{title:"Date-WK8",name:"date-WK8"},{title:"Date-WK9",name:"date-WK9"},{title:"Date-WK10",name:"date-WK10"},
                    {title:"Date-WK11",name:"date-WK11"},{title:"Date-WK12",name:"date-WK12"},{title:"Date-WK13",name:"date-WK13"},{title:"Date-WK14",name:"date-WK14"},{title:"Date-WK15",name:"date-WK15"},],
                gridData:[],
                page:{}
            }
        },
        mounted:function(){
            initForm();
        },
        created:function(){
            let _self=this;
            $.post("/im/cashinforecast/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;});

        },
        methods: {
            createCashinforecast:function(ev){this.$router.push("/im/cashinforecastedit");},
            itemClick: function (param) {
                this.$router.push({ name:'cashinforecastedit', params: { contractId: param }})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self=this;
                let param = {q:util.qfilter(this.q),page:this.page};
                $.post("/im/cashinforecast/list",param).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>

