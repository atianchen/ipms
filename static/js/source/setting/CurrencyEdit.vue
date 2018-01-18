<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Currency Edit<small>Edit the currency info</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="currencyForm" id="currencyForm"  class="form-horizontal form-label-left"   @submit.prevent="saveCurrency">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="currency.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                <span class="fa fa-user form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="abbr">Abbr<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="currency.abbr" id="abbr" name="abbr" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Rate<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="currency.rate"  required  id="rate" name="level" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>


                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delCurrency" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="currency._id" v-if="method=='update'"/>
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
                currency:{},
                method:"new"
            }
        },
        created:function(){
            if (this.$route.params && this.$route.params.currencyId)
            {
                var _self=this;
                this.method="update";
                $.post("/setting/currency/get",{id:this.$route.params.currencyId}).done((rs)=>{_self.currency=rs.data;}).fail(function(){});
            }
        },
        mounted:function(){
            initFormValidate();
        },
        methods: {
            backList:function()
            {
                this.$router.push('/setting/currencyList')
            },
            delCurrency:function()
            {
                let _self=this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/setting/currency/del",{currency:_self.currency}).done((rs)=>{_self.method="new";_self.currency={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            saveCurrency:function()
            {
                if (validateForm())
                {
                    let _self=this;
                    if (this.method=="new")
                        $.post("/setting/currency/save",{currency:this.currency}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
                    else
                        $.post("/setting/currency/update",{currency:this.currency}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
                }
            }
        }

    }
</script>

