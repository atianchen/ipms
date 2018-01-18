<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Record <small>Entry Record</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="date-picker form-control  col-md-2" id="createDate1" v-model="createDate1" placeholder="CreateDate Start">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="date-picker form-control  col-md-2"  id="createDate2" v-model="createDate2" placeholder="CreateDate End">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.person" placeholder="User Id">
                                </div>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="pageSearch">Search</button>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="exportXls">Export</button>
                            </li>
                        </ul>
                    </div>
                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
                        <button type="button" class="btn btn-primary" @click='addEntryRecord'>New</button>
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
import ajaxDownload  from '../ctrl/ajaxDownload'

export default {
  data () {
    return {
    createDate1:null,
    createDate2:null,
      q:{},
      gridColumns: [{title:"User ID",name:"person",click:"_id"},{title:"User Name",name:"personName",click:"_id"},{title:"Task Id",name:"taskId"},{title:"SysProj",name:"sysProj"},{title:"Addr",name:"addr"},{title:"Period",name:"period"}
                    ,{title:"Cash-In Amount",name:"cash"} ,{title:"Completed Milestone",name:"completedMilestone"},{title:"Desc",name:"desc"},{title:"StartTime",name:"createDate",type:"date",format:"DD/MM/YYYY H:mm"},{title:"EndTime",name:"modifiedDate",type:"date",format:"DD/MM/YYYY H:mm"}],
      gridData:[],
      page:{}

    }
  },
   mounted:function(){
    initForm();
    let _self = this;
      bindCalendar( document.querySelector('#createDate1'),function(val)
        {
            _self.createDate1=moment(val).format("DD/MM/YYYY");
        });
    bindCalendar( document.querySelector('#createDate2'),function(val)
        {
            _self.createDate2=moment(val).format("DD/MM/YYYY");
        });
  },
  created:function(){
        let _self=this;
        $.post("/project/record/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;_self.createDate1=rs.createDate1;_self.createDate2=rs.createDate2;});

  },
  methods: {
        addEntryRecord:function(ev){this.$router.push("/project/recordAdd");},
        itemClick: function (param) {
            this.$router.push({ name:'recordEdit', params: { recordId: param }})
         },
         pagination:function(page)
         {
            this.page.pn = page;
            this.pageSearch();
         },
         pageSearch:function()
         {
            let _self=this;
            let param = {q:util.qfilter(this.q),page:this.page,createDate1:this.createDate1,createDate2:this.createDate2};
            $.post("/project/record/list",param).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
         },
         exportXls:function() {
             let param = util.qfilter(this.q);
             param.createDate1 = this.createDate1;
             param.createDate2 = this.createDate2;
             ajaxDownload('/project/record/exportRecord',param, 'q');
         }
    },
    components: {
     'hy-grid': Grid,
     'hy-gridPager': GridPager
  }
}
</script>

