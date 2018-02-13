<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cashinforecast Edit<small>Edit the cashinforecast information</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="cashinforecastForm" id="cashinforecastForm"  class="form-horizontal form-label-left"   @submit.prevent="saveCashinforecast">
                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="entrySysDate">EntrySysDate<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="entrySysDate" name="entrySysDate" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contractId">ContractId<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="contractId" name="contractId" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="customer">Customer<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="customer" name="customer" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="projectID">ProjectID<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="number"  v-model="" id="projectID" name="projectID" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="amount">Amount<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="amount" name="amount" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="cunency">Cunency<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="cunency" name="cunency" required="required" class="form-control" >
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="paymentTerm">PaymentTerm<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="paymentTerm" name="paymentTerm" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK1">Date-WK1<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK1" name="date-WK1" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK2">Date-WK2<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK2" name="date-WK2" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK3">Date-WK3<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK3" name="date-WK3" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK4">Date-WK4<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK4" name="date-WK4" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK5">Date-WK5<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK5" name="date-WK5" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK6">Date-WK6<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK6" name="date-WK6" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK7">Date-WK7<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK7" name="date-WK7" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK8">Date-WK8<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK8" name="date-WK8" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK9">Date-WK9<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK9" name="date-WK9" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK10">Date-WK10<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK10" name="date-WK10" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK11">Date-WK11<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK11" name="date-WK11" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK12">Date-WK12<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK12" name="date-WK12" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK13">Date-WK13<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK13" name="date-WK13" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK14">Date-WK14<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK14" name="date-WK14" required="required" class="form-control">
                                </div>
                            </div>
                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="date-WK15">Date-WK15<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="" id="date-WK15" name="date-WK15" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delcashinforecast" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="cashinforecast._id" v-if="method=='update'"/>
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
            }
        },
        created:function(){
            let _self=this;
            if (this.$route.params && this.$route.params.contractId)
            {
                this.method="update";
            }
            $.post("/im/cashinforecast/get",(this.$route.params && this.$route.params.contractId)?{id:this.$route.params.contractId}:null).done((rs)=>{
                if (rs.data)
                    _self.contract=rs.data;
                _self.currency = rs.currency;
            }).fail(function(){});
        },
        mounted:function(){
            initFormValidate();
        },
        methods: {
            backList:function()
            {
                this.$router.push('/im/cashinforecastList')
            },
            delContract:function()
            {
                let _self=this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/im/cashinforecast/del",{contract:_self.contract}).done((rs)=>{_self.method="new";_self.contract={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            saveContract:function()
            {
                if (validateForm())
                {
                    let _self=this;
                    if (this.method=="new")
                        $.post("/im/cashinforecast/save",{contract:this.contract}).done((rs)=>{
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
                        $.post("/im/cashinforecast/update",{contract:this.contract}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
                }
            }
        }

    }
</script>