<template>
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cash-in & Invoice<small>Cash-in & Invoice Actual Entry</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul><div class="clearfix"></div>
                </div>
                <div class="content">
                    <br/>
                    <form name="cashinaccrualactualForm" id="cashinaccrualactualForm" class="form-horizontal form-label-left" @submit.prevent="saveCashinAccrualActual">
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
                                 <td class="ld" nowrap>ContractId</td>
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
                            <br />
                             <tr>
                                 <td class="ld" nowrap>Cash</td>
                                 <td>
                                 <div class="col-md-12 col-sm-12 col-xs-12">
                                     <input type="text" class="col-md-12 col-xs-12 "  data-rule="number" v-model="CAInvoiceActual.cash" id="cash" name="cash">
                                 </div>
                                 </td>
                             </tr>
                             <tr>
                                 <td class="ld" nowrap>Cash-in Date</td>
                                 <td>
                                     <div class="col-md-12 col-sm-12 col-xs-12">
                                        <input type="text" class="col-md-12 col-xs-12" v-model="CAInvoiceActual.cashindate" id="cashindate" name="cashindate">
                                     </div>
                                 </td>
                             </tr>
                             <tr>
                                 <td class="ld" nowrap>Completed Milestone</td>
                                 <td>
                                     <div class="col-md-12 col-sm-12 col-xs-12">
                                         <input type="text" class="col-md-12 col-xs-12" v-model="CAInvoiceActual.completemilestone" name="milestone">
                                     </div>
                                 </td>
                             </tr>
                             <tr>
                                 <td class="ld" nowrap>Confirm Date</td>
                                 <td>
                                     <div class="col-md-12 col-sm-12 col-xs-12">
                                         <input type="text" class="col-md-12 col-xs-12" v-model="CAInvoiceActual.confirmdate" name="confrimDate">
                                     </div>
                                 </td>
                             </tr>
                             <tr>
                                 <td class="ld" nowrap>Invoice Amount</td>
                                 <td>
                                     <div class="col-md-12 col-sm-12 col-xs-12">
                                     <input type="text" class="col-md-12 col-xs-12" data-rule="number" v-model="CAInvoiceActual.invoiceamount" name="InvoiceAmt">
                                     </div>
                                 </td>
                             </tr>
                             <tr>
                                 <td class="ld" nowrap>Invoice Date</td>
                                 <td>
                                     <div class="col-md-12 col-sm-12 col-xs-12">
                                         <input type="text" class="col-md-12 col-xs-12" v-model="CAInvoiceActual.invoicedate" name="InvoiceDate">
                                     </div>
                                 </td>
                             </tr>
                            </tbody>
                        </table>
                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-12 col-sm-12 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" class="btn btn-primary" :disabled="executing">Save</button>
                            </div>
                        </div>
                    </form>
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
            return {
                proj: {contract:{}},
                CAInvoiceActual: {},
                executing: false
            }
        },

        mounted:function(){
            let _self=this;
            $.post("/im/getCashinAccrualActual",{projId:this.$route.params.projId}).done((rs)=>{
                _self.proj = rs.proj;
                if (rs.CAInvoiceActual)
                    _self.CAInvoiceActual = rs.CAInvoiceActual;
            }).fail(function(){});
        },
        methods: {
            backList: function(){
                this.$router.push({name:'listCashinAccrual'})
            },
            saveCashinAccrualActual:function()
            {
                if (validateForm()) {
                    this.executing = true;
                    let _self = this;
                    $.post("/im/saveCashinAccrualActual", {CAInvoiceActual: this.CAInvoiceActual}).done((rs) => {
                        _self.CAInvoiceActual = rs.CAInvoiceActual;
                        _self.executing = false;
                        if (rs.err) {
                            notify("Saved Unsuccessful:" + rs.err, "", "failure");
                        }
                        else {
                            notify("Saved Successful", "", "Successfual");
                        }
                    }).fail(function (e) {
                        _self.executing = false;
                    })
                }
            }
          }
    }
</script>

<style scoped>
    td.ld{width:15%;text-align:right;}
</style>