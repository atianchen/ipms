<template>
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Accrual Actual Entry</h2>
                    <ul class="nav navbar-right panel_toolbox"></ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br/>
                    <form name="accrualactualform" id="accrualactualform" class="form-horizontal form-label-left" @submit.prevent="saveAccrualActual">
                        <table class="table table-striped jambo_table bulk_action  table-bordered">
                            <tbody >
                            <tr>
                                <td class="ld" nowrap>ContractId</td>
                                <td>{{proj.contract.contractId}}</td>
                            </tr>
                            <tr>
                                <td class="ld" nowrap>Customer</td>
                                <td>{{proj.contract.customerName}} </td>
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
                                <td class="ld" nowrap>Complete Milestones</td>
                                <td>
                                    <select   placeholder="Choose Division" v-model="AccrualActual.completemilestone" id="completemilestone" name="completemilestone" class="form-control"  >
                                        <option value="">Choose..</option>
                                        <option v-for="item in proj.planedMilestones"  :value="item">
                                            {{ item }}
                                        </option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td class="ld">Confirm Date</td>
                                <td>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                        <input type="text" class="col-md-12 col-xs-12" v-model="AccrualActual.confirmdate" id="confirmdate" name="confirmdate">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="ld">Entry Date</td>
                                <td>
                                    <div class="col-md-12 col-sm-12 col-xs-12">
                                    <input type="text" class="col-md-12 col-xs-12" v-model="AccrualActual.entrydate" id="entrydate" name="entrydate">
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div class="ln_solid"></div>
                        <div class="form-group" >
                            <div class="col-md-12 col-sm-12 col-xs-12">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" class="btn btn-primary" :disable="executing">Save</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div >

        </div>

    </div>

</template>

<script>
    export default {
        data(){
            return{
                proj:{contract:{}},
                AccrualActual:{completedMilestone:""},
                executing:false
            }
        },
        mounted:function(){
            let _self=this;
            initForm();
            bindCalendar( document.querySelector('#confirmdate'),function(val)
            {
                _self.$set(_self.AccrualActual,"confirmdate",moment(val).format("DD/MM/YYYY"));
            });
            bindCalendar( document.querySelector('#entrydate'),function(val)
            {
                _self.$set(_self.AccrualActual,"entrydate",moment(val).format("DD/MM/YYYY"));
            });
            $.post("/im/getAccrualActual",{projId:this.$route.params.projId}).done((rs)=>{
                _self.proj = rs.proj;
                if (rs.AccrualActual)
                 _self.AccrualActual = rs.AccrualActual;
            }).fail(function(){});
        },
        methods:{
            backList:function(){
                this.$router.push({name:"/im/listAccrualActual"});
            },
            saveAccrualActual:function()
            {
                if(validateForm()){
                    this.executing=true;
                    let _self=this;
                    $.post("/im/saveAccrualActual",{AccrualActual:this.AccrualActual}).done((rs)=>{
                        _self.AccrualActual=rs.AccrualActual;
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