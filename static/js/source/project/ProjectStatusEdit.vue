<template>
    <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Project Status Edit<small>Edit project status</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class = "clearfix"></div>
                </div>
                <div class="content"></div>
                <br/>
                <form name="projectstatusForm" id="projectstatusForm" class="form-horizontal form-label-left" @submit.prevent="saveProjectStatus">
                    <div class="row">
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="status">Project Status<span class="reuqired">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text" v-model="projectstatus.status" id="status" name="status" require="reuqired" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="status">Abbr</label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text" v-model="projectstatus.abbr" id="abbr" name="abbr" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>

                    </div>
                    <div class="ln_solid"></div>
                    <div class="form-group">
                        <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                            <button type="button" class="btn" @click="backList">Back</button>
                            <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                            <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delProjectStatus" >Remove</button>
                            <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                        </div>
                    </div>
                    <input type="hidden" name="id" :value="projectstatus._id" v-if="method=='update'"/>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment'

    export default{
        data(){
            return{
                projectstatus:{},
                method:'new'
            }
        },
        created:function(){
            let param =null;
            if (this.$route.params && this.$route.params.projectstatusId)
            {
                this.method="update";
                param = {id:this.$route.params.projectstatusId};
            }
            if(this.$route.params && this.$route.params.projectstatusId)
            {
                var _self= this;
                this.method ="update";
            }
            $.post("/project/projectstatus/get",{id:this.$route.params.projectstatusId}).done((rs)=>{_self.projectstatus =rs.data}).fail(function(){});
        },
        mounted:function(){
            initFormValidate();
        },
        methods:{
            backList:function(){
                this.$router.push("/project/projectstatusList")
            },
            delProjectStatus: function(){
                let _self = this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/project/projectstatus/del",{projectstatus:_self.projectstatus}).done((rs)=>{_self.method="new";_self.projectstatus={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            saveProjectStatus: function(){
                if(validateForm){
                    console.log(this.projectstatus);
                    let _self =this;
                    if(this.method=="new")
                        $.post("/project/projectstatus/save",{projectstatus:this.projectstatus}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
                    else
                        $.post("/project/projectstatus/update",{projectstatus:this.projectstatus}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})

                    }
                }

        }
    }




</script>

<style scoped>

</style>