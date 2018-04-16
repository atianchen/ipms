<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Contract Edit<small>Edit the contract information</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="contractForm" id="contractForm"  class="form-horizontal form-label-left"   @submit.prevent="saveContract">
                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contractId">ContractId<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="contract.contractId" id="contractId" name="contractId" required="required" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="currency">Division<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select   placeholder="Choose Division" v-model="contract.division" id="division" name="division" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in divisions"  :value="item.code">
                                            {{ item.code }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="salesMan">Sales Man<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="contract.salesMan" id="salesMan" name="salesMan" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="signedYear">Signed Year<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number"  v-model="contract.signedYear" id="signedYear" name="contractId" required="required" class="form-control"
                                           data-parsley-type="integer">
                                </div>
                            </div>
                      </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="sales">Salesman
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">

                                    <select   placeholder="Choose S" v-model="contract.salesman" id="sales" name="sales" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in persons"  :value="item.name">
                                            {{ item.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="module">Contract Module
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="contract.contractModule" id="module" name="module" class="form-control">
                                </div>
                            </div>
                        </div>

                      <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="productLine">ProductLine<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="contract.productLine" id="productLine" name="contractId" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="customerName">CustomerName<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="contract.customerName" id="customerName" name="customerName" required="required" class="form-control" >
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="customerAbbr">CustomerAbbr<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="contract.customerAbbr" id="customerAbbr" name="customerAbbr" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="currency">Currency<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select   placeholder="Choose Currency" v-model="contract.currency" id="currency" name="currency" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in currency"  :value="item.abbr">
                                            {{ item.abbr }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="amt">ContractAMT
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number"  data-parsley-type="number"  v-model="contract.amt" id="amt" name="amt"  class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="imp">Imp(%)
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number"  data-parsley-type="number"  v-model="contract.imp" id="imp" name="imp"  class="form-control"
                                           data-parsley-min="1" data-parsley-max="100">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="accReceiptAmt">Accumlated Amt
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="contract.accReceiptAmt" id="accReceiptAmt" name="accReceiptAmt" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="yearStartAmt">Amt of Begining Year
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="contract.yearStartAmt" id="yearStartAmt" name="yearStartAmt" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="yearAccReceiptAmt">Accumlated Amt of Current Year
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="contract.yearAccReceiptAmt" id="yearAccReceiptAmt" name="yearAccReceiptAmt" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="mandays">Contract Manday
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="contract.mandays" id="mandays" name="mandays" class="form-control">
                                </div>
                            </div>
                        </div>


                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="cashInOpen">Cash-In Opening
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number" 	data-parsley-type="number" v-model="contract.cashInOpen" id="cashInOpen" name="cashInOpen"   class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="processOpen">Progress Opening(%)
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number" 	data-parsley-type="number" v-model="contract.processOpen" id="processOpen" name="processOpen"   class="form-control"
                                           data-parsley-min="0" data-parsley-max="100">
                                </div>
                            </div>
                        </div>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delContract" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="contract._id" v-if="method=='update'"/>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
        currency:[],
        contract:{},
        method:"new",
        divisions:[],
        persons:[]
    }
  },
  created:function(){
    let _self=this;
    if (this.$route.params && this.$route.params.contractId)
    {
        this.method="update";
    }
      $.post("/project/contract/get",(this.$route.params && this.$route.params.contractId)?{id:this.$route.params.contractId}:null).done((rs)=>{
            if (rs.data)
             _self.contract=rs.data;
            _self.currency = rs.currency;
            _self.persons=rs.persons;
            _self.divisions = rs.divisions;
           }).fail(function(){});
  },
  mounted:function(){
    initFormValidate();
  },
  methods: {
      backList:function()
      {
        this.$router.push('/project/contractList')
      },
    delContract:function()
    {
        let _self=this;
        confirmOper("Prompt","Confirm delete",function()
        {
                $.post("/project/contract/del",{contract:_self.contract}).done((rs)=>{_self.method="new";_self.contract={}; notify("Delete successfully","","success");}).fail(function(){})
        });
    },
    saveContract:function()
    {
        if (validateForm())
        {
            let _self=this;
            if (this.method=="new")
              $.post("/project/contract/save",{contract:this.contract}).done((rs)=>{
              if (rs.err)
              {
                notify("Saved Unsuccessful:"+rs.err,"","failure");
              }
              else
              {
                _self.method="update"; notify("Saved successfully","","success");
                }
              }).fail(function(){})
            else
              $.post("/project/contract/update",{contract:this.contract}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
        }
    }
  }

}
</script>

