<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>PM Accural Forecast</h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="cashinforecastForm" id="cashinforecastForm"  class="form-horizontal form-label-left"   @submit.prevent="saveAccuralinforecast">
                        <table class="table table-striped jambo_table bulk_action  table-bordered">
                            <tbody>
                            <tr>
                                <td class="ld" nowrap>EntrySysDate</td>
                                <td>{{accuralforecast.entrysysdate|formatDate}}</td>
                            </tr>
                            <tr>
                                <td class="ld">ProjectId</td>
                                <td>{{proj.projectId}}</td>
                            </tr>
                            <tr>
                                <td class="ld">Customer</td>
                                <td>{{proj.contract.customerName}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>ContractId</td>
                                <td>{{proj.contract.contractId}}</td>
                            </tr>
                            <tr>
                                <td class="ld">Amount</td>
                                <td>{{proj.contract.amt}}</td>
                            </tr>
                            <tr>
                                <td class="ld">Currency</td>
                                <td>{{proj.contract.currency}}</td>
                            </tr>
                            <tr>
                                <td class="ld">CurrentMilestones</td>
                                <td v-model="accuralforecast.currentMilestone">{{proj.currentMilestone}}</td>
                            </tr>
                            <tr v-for="mw in mws">
                                <td class="ld">{{getWkTitle(mw)}}</td>
                                <td> <select  placeholder="Choose Division" v-model="accuralforecast[mw._id].accrual" >
                                            <option value="">Choose..</option>
                                            <option v-for="item in proj.planedMilestones" :value="item">{{item}}</option>
                                     </select>
                               </td>
                            </tr>
                            </tbody>
                        </table>

                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" :disabled="executing">Save</button>
                            </div>
                        </div>
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
                proj:{contract:{}},
                mws:[],
                accuralforecast:{},
                method:'new',
                executing:false
            }
        },
        filters:{
            formatDate:function(date)
            {
                return moment().format("YYYY-MM-DD");
            }
        },
        mounted:function(){
            this.initSysDate();
            let startDate = moment();
           // let entrysysdate =moment();
           // startDate.startOf('month');
            let endDate = startDate.clone().add(3,"months");
            let _self=this;
            $.post("/im/getAccuralForecast",{projId:this.$route.params.projId,startDate:startDate.unix()}).done((rs)=>{
                _self.proj = rs.proj;
                _self.mws = rs.mws;
                _self.accuralforecast = rs.accuralforecast;
            }).fail(function(){});
        },
        methods: {
            initSysDate()
            {
                this.accuralforecast.entrysysdate= moment();
            },
            getWkTitle(mw)
            {
                return moment(mw.startDate*1000).format("MMMM")+"-WK"+(mw.seq+1);
            },
            backList:function()
            {
                this.$router.push({ name:'listPmForecastProj'})
            },
            saveAccuralinforecast:function()
            {

                this.executing = true;
                let _self = this;
                $.post("/im/saveAccuralForecast",{accuralforecast:this.accuralforecast}).done((rs)=>{
                    _self.accuralforecast = rs.accuralforecast;
                    _self.executing = false;
                    if (rs.err)
                    {
                        notify("Saved Unsuccessful:"+rs.err,"","failure");
                    }
                    else
                    {
                        notify("Saved Successful","","Successfual");
                    }
                }).fail(function(e){_self.executing = false;})
            }
        }


    }
</script>
<style scoped>
    td.ld{width:15%;text-align:right;}
</style>