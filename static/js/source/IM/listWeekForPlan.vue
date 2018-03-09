<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Week<small>Choose Week</small></h2>
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
    import moment from 'moment'
    export default {
        data () {
            return {
                q:{},
                gridColumns: [{title:"Week",name:"title",exp:function(data)
                    {
                        return moment(data.startDate*1000).format("YYYY")+"-WK"+(data.seq+1);
                    }},{title:"Start Date",name:"startDate",type:"date",format:"DD/MM/YYYY"},{title:"End Date",name:"endDate",type:"date",format:"DD/MM/YYYY"},{title:"",name:"seq",click:"seq",exp:function()
                    {
                      return "Plan Edit";
                    }}],
                gridData:[],
                page:{}
            }
        },
        created:function(){

        },
        mounted:function(){
            this.pageSearch();
        },
        methods: {
            itemClick:function()
            {

            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let startDate = moment();
              /*  startDate.startOf('month');
                let endDate = startDate.clone().add(3,"months");*/
                let _self=this;
                $.post("/im/listWeekForPlan",{startDate:startDate.unix(),page:this.page}).done((rs)=>{
                    _self.gridData=rs.data;
                    _self.page=rs.page;
                }).fail(function(){});
            },
            itemClick: function (param,entity) {
                this.$router.push({ name:'weekPlan', params: { monthWeekId: entity._id }})
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>