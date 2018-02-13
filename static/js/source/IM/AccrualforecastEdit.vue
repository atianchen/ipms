<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Accrual Forcast Edit<small>Edit the accrual forecast</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />

                    <form name="accrualforecastForm" id="accrualforecastForm" class="form-horization form-label-left" @submit.prevent="saveAccrualForecast">

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="entrysysdate">EntrySysDate<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="accrualforecast.entrysysdate" id="entrysysdate" name="entrysysdate" required="required" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="projectId">Project ID<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select   placeholder="Choose Project" v-model="accrualforecast.projectId" id="projectId" name="projectId" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in projectIds"  :value="item.projectId">
                                            {{ item.projectId }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="customer">Customer<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="accrualforecast.customer" id="customer" name="customer" required="required" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="contractId">ContractID<span class="required">*</span>
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <select   placeholder="Choose Project" v-model="accrualforecast.contractId" id="contractId" name="contractId" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in contractIds"  :value="item.contractId">
                                            {{ item.contractId }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="amount">Amount
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="accrualforecast.amount" id="amount" name="amount" required="required" class="form-control">
                                </div>
                            </div>

                            <div class="form-group col-md-6 col-sm-6 ">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="currency">Currency
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text" v-model="accrualforecast.currency" id="currency" name="currency" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="form-group col-md-6 col-sm-6">
                                <label class="control-label col-md-3 col-sm-3 col-xs-12" for="currentmilestone">Current Milestone
                                </label>
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <input type="text"  v-model="accrualforecast.currentmilestone" id="currentmilestone" name="currentmilestone" required="required" class="form-control">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class>
                                <lable class="control-label col-md-3 col-xs-12"></lable>
                            </div>
                            <div class="col-md-6 ool-sm-6 col-xs-12">
                                <input type="text" v-model="accrualforecast.weekaccrualforecast" id="weekaccrualforecast" name="weekaccrualforecast" class="form-control">
                        </div>
                        </div>
                        <input type="hidden" name="id" :value="accrualforecast._id" v-if="method=='update'">
                    </form>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'
    export default {

        data() {
            return {
                accrualforecast: {},
                method: "new"
            }
        },

        created: function () {
            let _self = this;
            if (this.$route.params && $route.params.accrualforecastId) {
                this.method = "update";
            }
            $.post("/IM/accrualforecast/get", (this.$route.params && this.$route.params.accrualforecastId) ? {id: this.$route.params.accrualforecastId} : null).done((rs) => {
                if (rs.data)
                    _self.accrualforecast = rs.data;
            }).fail(function () {
            });
        },
        mounted: function () {
            initFormValidate();
        },
        methods: {
            backList: function () {
                this.$router.push('/IM/accrualforecastList')
            },
            delAccrualforecast: function () {
                let _self = this;
                if (this.method == "new")
                    $.post("/IM/accrualforecast/save", {contract: this.contract}).done((rs) => {
                        if (rs.err) {
                            //notify("Saved Unsuccessful:"+rs.err,"","failure");
                            notify("Saved Unsuccessful:" + rs.err, "", "failure");
                        }
                        else {
                            _self.method = "update";
                            notify("Saved successfully", "", "success");
                        }
                    }).fail(function () {
                    })
                else
                    $.post("/IM/accrualforecast/update", {contract: this.contract}).done((rs) => {
                        notify("Updated successfully", "", "success");
                    }).fail(function () {
                    })
            }
        }
    }
</script>
