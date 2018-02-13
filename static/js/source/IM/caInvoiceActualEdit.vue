<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cash-in/Accrual Invoice Actual</h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                 <form name="cainvoiceactualForm" id="cainvoiceactualForm" class="form-horizontal form-label-left" @submit.prevent="saveCAInvoiceActual">

                     <div class="form-group">
                     <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contract">ContractID<span class="required">*</span>
                     </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text" v-model="cainvoiceactual.contract" id="" >
                             <span></span>
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Customer
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="cainvoiceactual.customer" id = "" name ="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12">ProjectID
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type ="text"  v-model ="" id ="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Amount
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Currency
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Cash
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Cash-in Date
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Completed Milestone
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Confirm Date
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Invoice Amount
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="form-group">
                         <label class="control-label col-md-3 col-sm-3 col-xs-12" >Invoice Date
                         </label>
                         <div class="col-md-6 col-sm-6 col-xs-12">
                             <input type="text"  v-model="" id="" name="" class="form-control col-md-7 col-xs-12">
                         </div>
                     </div>

                     <div class="ln_solid"></div>
                     <div class="form-group">
                         <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                             <button type="button" class="btn" @click="backList">Back</button>
                             <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                             <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delCAInvoiceActual" >Remove</button>
                             <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                         </div>
                     </div>

                     <input type="hidden" name="id" :value="cainvoiceactual._id" v-if="method=='update'"/>
                 </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
       data(){
           return{
               cainvoiceactual:{},
               method: "new"
           }
       },
        created: function(){
                if(this.$route.params && this.$route.params.currencyId){
                    var _self=this;
                    this.method="update";
                    $.post("/IM/cainvoiceactual/get",{id:this.$route.params.Id}).done((rs)=>{_self.cainvoiceactual=rs.data;}).fail(function(){});
                }
        },
        mounted:function(){
           initFormValidate()
        },
        methods: {
           backList: function()
           {
               this.$router.push('/IM/cainvoiceactualList')
           },
           delCAInvoiceActual:function()
            {
                    let _self=this;
                     confirmOper("Prompt","Confirm delete",function()
                    {
                      $.post("/IM/cainvoiceactual/del",{cainvoiceactual:_self.cainvoiceactual}).done((rs)=>{_self.method="new";_self.cainvoiceactual={}; notify("Delete successfully","","success");}).fail(function(){})
                    });
            },
          saveCurrency: function() {
              if (validateForm()) {
                  let _self = this;
                  if (this.method == "new")
                      $.post("/IM/cainvoiceactual/save", {cainvoiceactual: this.cainvoiceactual}).done((rs) => {
                          _self.method = "update";
                          notify("Saved successfully", "", "success");
                      }).fail(function () {
                      })
                  else
                      $.post("/IM/cainvoiceactual/update", {cainvoiceactual: this.cainvoiceactual}).done((rs) => {
                          notify("Updated successfully", "", "success");
                      }).fail(function () {
                      })
              }
          }
        }
    }


</script>

