<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Division Edit<small>Edit the division info</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="currencyForm" id="currencyForm"  class="form-horizontal form-label-left"   @submit.prevent="saveDivision">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="division.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">

                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="code">Abbr<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="division.code" id="code" name="code" required="required" class="form-control col-md-7 col-xs-12">

                            </div>
                        </div>




                        <div class="form-group">
                            <label for="desc" class="control-label col-md-3 col-sm-3 col-xs-12">Desc</label>
                            <div class="col-md-6 col-sm-6 col-xs-12 has-feedback">
                                <textarea id="desc" name="desc" v-model="division.desc" class="resizable_textarea form-control" style="overflow: hidden; word-wrap: break-word; resize: horizontal; "></textarea>

                            </div>
                        </div>


                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delDivision" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="division._id" v-if="method=='update'"/>
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
                division:{},
                method:"new"
            }
        },
        created:function(){
            if (this.$route.params && this.$route.params.divisionId)
            {
                var _self=this;
                this.method="update";
                $.post("/setting/division/get",{id:this.$route.params.divisionId}).done((rs)=>{_self.division=rs.data;}).fail(function(){});
            }
        },
        mounted:function(){
            initFormValidate();
        },
        methods: {
            backList:function()
            {
                this.$router.push('/setting/divisionList')
            },
            delDivision:function()
            {
                let _self=this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/setting/division/del",{division:_self.division}).done((rs)=>{_self.method="new";_self.division={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            saveDivision:function()
            {
                if (validateForm())
                {
                    console.log(this.division);
                    let _self=this;
                    if (this.method=="new")
                        $.post("/setting/division/save",{division:this.division}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
                    else
                        $.post("/setting/division/update",{division:this.division}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
                }
            }
        }

    }
</script>

