<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Contract <small>Contract List</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <select   placeholder="ContractId" v-model="q.contractId" id="q.contractId" name="q.contractId" class="form-control"  >
                                        <option value="" disabled selected>Choose Contract</option>
                                        <option v-for="item in contracts" :value="item.contractId">
                                            {{ item.contractId }}
                                        </option>
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <select   placeholder="Choose CustomerName" v-model="q.customerName" id="q.customerName" name="customerName" class="form-control"  >
                                        <option value="" disabled selected>Choose Customer</option>
                                        <option v-for="item in contracts" :value="item.customerName">
                                            {{ item.customerName }}
                                        </option>
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.customerAbbr" placeholder="Customer Abbr">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.salesMan" placeholder="Sales Man">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.productLine" placeholder="Product Line">
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
                    <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
                        <button type="button" class="btn btn-primary" @click='createContract'>New</button>
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
      contracts:[],
      gridColumns: [{title:"Contract ID",name:"contractId",click:"_id"},{title:"Signed Year",name:"signedYear"},{title:"Salesman",name:"salesMan"},{title:"Sales",name:"salesman"},
          {title:"Contract Module",name:"contractModule"}, {title:"Product line",name:"productLine"},{title:"Customer Name",name:"customerName"},{title:"Customer Abbr",name:"customerAbbr"},
                    {title:"Currency",name:"currency"},{title:"Contract Amt",name:"amt"},{title:"Accumlated Amt",name:"accReceiptAmt"},{title:"Amt of Begining Year",name:"yearStartAmt"},{title:"Accumlated Amt of Current Year",name:"yearAccReceiptAmt"},{title:"Contract Manday",name:"manday"},{title:"Imp%",name:"imp"},{title:"Cus%",name:"cus",exp:function(item){ if (item.imp && item.imp>0)return 100-item.imp;else return 100;}},{title:"Cash-In opening",name:"cashInOpen"}
                    ,{title:"Progress opening%",name:"processOpen"},{title:"Division",name:"division"},{title:"CreateDate",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
      gridData:[],
      page:{},
      contractId: null
    }
  },
   mounted:function(){
    initForm();
    let _self = this;
  },
  created:function(){
        let _self=this;
        $.post("/project/contract/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;_self.createDate1=rs.createDate1;_self.createDate2=rs.createDate2;_self.contracts=rs.contracts});

  },
  methods: {
        createContract:function(ev){this.$router.push("/project/contractAdd");},
        itemClick: function (param) {
            this.$router.push({ name:'contractEdit', params: { contractId: param }})
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
            $.post("/project/contract/list",param).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
         }
    },
    components: {
     'hy-grid': Grid,
     'hy-gridPager': GridPager
  }
}
</script>

