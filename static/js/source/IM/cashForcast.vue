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
                        <table class="table table-striped jambo_table bulk_action  table-bordered">
                            <tbody>
                                <tr>
                                    <td class="ld" nowrap>ContractId</td>
                                    <td>{{proj.contract.contractId}}</td>
                                </tr>
                                <tr>
                                    <td class="ld">ProjectId</td>
                                    <td>{{proj.projectId}}</td>
                                </tr>
                                <tr>
                                    <td class="ld">Currency</td>
                                    <td>{{proj.currency}}</td>
                                </tr>
                                <tr>
                                    <td class="ld">SalesMan</td>
                                    <td>{{proj.contract.salesMan}}</td>
                                </tr>
                                <tr v-for="mw in mws">
                                    <td class="ld">{{getWkTitle(mw)}}</td>
                                    <td><input type="text" data-rule="number"  class="form-control" v-model="cashforecast[mw._id].cash" /></td>
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
                cashforecast:{},
                method:'new',
                executing:false
            }
        },
        mounted:function(){
            let startDate = moment();
            startDate.startOf('month');
            let endDate = startDate.clone().add(3,"months");
            let _self=this;
            $.post("/im/getCashForecast",{projId:this.$route.params.projId,startDate:startDate.unix(),endDate:endDate.unix()}).done((rs)=>{
                _self.proj = rs.proj;
                _self.mws = rs.mws;
                _self.cashforecast = rs.cashforecast;
            }).fail(function(){});
        },
        methods: {
            getWkTitle(mw)
            {
                return moment(mw.startDate*1000).format("MMMM")+"-WK"+(mw.seq+1);
            },
            backList:function()
            {
                this.$router.push({ name:'listForecastProj'})
            },
            saveCashinforecast:function()
            {
                this.executing = true;
                let _self = this;
                $.post("/im/saveCashForecast",{cashforecast:this.cashforecast}).done((rs)=>{
                    _self.cashforecast = rs.cashforecast;
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