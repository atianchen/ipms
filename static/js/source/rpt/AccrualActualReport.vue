<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="panel">
                <div class="title">
                    <h2>Accrual Actual Report</h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="data-picker form-control col-md-2" id="entrydate1" v-model="entrydate1" placeholder="EntryDate Start">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="data-picker form-control col-md-2" id="entrydate2" v-model="entrydate2" placeholder="EntryDate End">
                                </div>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="pageSearch">Search</button>
                            </li>
                        </ul>
                    </div>
                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  ></hy-grid>
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
    import {util} from '../../dist/pageHelper.js'
    import moment from 'moment'
    import ajaxDownload  from '../ctrl/ajaxDownload'

    export default {
        data() {
            return {
                q:{},
                entrydate1: null,
                entrydate2: null,
                gridColumns: [{title:'Project Name',name:'q.project.name'},{title:'ProjectId',name:'q.project.projectId'},{title:'Completed Milestone',name:'completemilestone'},{title:'Accumlated Completed Accrual',name:'accComAccrual'},{title:'Accrual(%)',name:'accrual'},{title:'Entry Date',name:'entrydate',type:"date",format:"DD/MM/YYYY"}],
                gridData: [],
                page: {}
            }
        },
        mounted:function(){
            initForm();
            let _self = this;
            bindCalendar(document.querySelector('#entrydate1'),function(val)
            {
                _self.entrydate1=moment(val).format("DD/MM/YYYY");
            });
            bindCalendar(document.querySelector('#entrydate2'),function(val)
            {
                _self.entrydate2=moment(val).format("DD/MM/YYYY");
            });
        },
        created:function(){
            let _self=this;
            $.post("/rpt/AccrualActualReport").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;_self.entrydate1=rs.entrydate1;_self.entrydate2=rs.entrydate2;});
        },
        methods: {
            pagination: function (page) {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch: function () {
                let _self = this;
                let param = {
                    q:util.qfilter(this.q),
                    page:this.page,
                    entrydate1: this.entrydate1,
                    entrydate2: this.entrydate2
                };
                $.post("/rpt/AccrualActualReport", param).done((rs) => {
                    _self.gridData = rs.data;
                    _self.page = rs.page;
                }).fail(function(){
                });
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>

<style scoped>

</style>