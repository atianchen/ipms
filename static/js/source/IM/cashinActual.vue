<template>
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cash-in Actual Entry</h2>
                    <ul class="nav navbar-right panel_toolbox"></ul>
                 </div>
                <div class="x_content">
                    <br/>
                    <form name="cashinactualform" id="cashinactualform" class="form-horizontal form-label-left" @submit.prevent="saveCashinActual">
                        <table class="table table-striped jambo_table bulk_action  table-bordered">
                        <tbody>
                            <tr>
                                <td class="ld" nowrap>ContractId</td>
                                <td>{{proj.contract.contractId}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>Customer</td>
                                <td>{{proj.contract.customerName}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>ProjectId</td>
                                <td>{{proj.projectId}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>Amount</td>
                                <td>{{proj.contract.amt}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>Currency</td>
                                <td>{{proj.contract.currency}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>Cash</td>
                                <td>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <input type="text" class="col-md-12 col-xs-12" v-model="CashinActual.cash" id="cash" name="cash">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="ld">Cash-in Date</td>
                                <td>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <input type="text" class="col-md-12 col-xs-12" v-model="CashinActual.cashindate" id="cashindate" name="cashindate">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="ld">Entry Date</td>
                                <td>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <input type="text" class="col-md-12 col-xs-12" v-model="CashinActual.entrydate" id="entrydate" name="entrydate">
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                        <div class="ln_solid"></div>
                        <div class="form-group" >
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" class="btn btn-primary" :disable="executing" >Save</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div >

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
             proj:{contract:{}},
             CashinActual:{},
             executing:false
          }
      },
       mounted:function(){
          let _self=this;
          initForm();
          bindCalendar(document.querySelector('#cashindate'),function(val)
           {
               _self.$set(_self.CashinActual,"cashindate",moment(val).format("DD/MM/YYYY"));
           });
           bindCalendar(document.querySelector('#entrydate'),function(val)
           {
               _self.$set(_self.CashinActual,"entrydate",moment(val).format("DD/MM/YYYY"));
           });
           $.post("/im/getCashinActual",{projId:this.$route.params.projId}).done((rs)=>{
               _self.proj = rs.proj;
               if (rs.CashinActual)
                   _self.CashinActual = rs.CashinActual;
           }).fail(function(){});
       },
        methods:{
          backList:function(){
              this.$router.push({name:"listCashinActual"});
          },
          saveCashinActual:function()
          {
              if(validateForm()){
                  this.executing=true;
                  let _self=this;
                  $.post("/im/saveCashinActual",{CashinActual:this.CashinActual}).done((rs)=>{
                      _self.CashinActual=rs.CashinActual;
                      _self.executing=false;
                      if(rs.err){
                          notify("Saved unsuccessful:" +rs.err,"","failure");
                      }
                      else{
                          notify("Saved successful:","","Successful")
                      }
                  }).fail(function(e){
                      _self.executing =false;
                  })
              }

          }

        }
    }
</script>

<style scoped>
    td.ld{width:15%;text-align:right;}
</style>