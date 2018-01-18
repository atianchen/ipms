<template>
    <div class="row">

        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Menu Edit<small>Edit the menu info</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <br />
                    <form  name="groupForm" id="groupForm"  class="form-horizontal form-label-left"   @submit.prevent="saveMenu">

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="name">Name<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="menu.name" id="name" name="name" required="required" class="form-control col-md-7 col-xs-12">
                                <span class="fa fa-user form-control-feedback right" aria-hidden="true"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="seq">Seq<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                <input type="text"  v-model="menu.seq" id="seq" name="seq" required="required" class="form-control col-md-7 col-xs-12">
                            </div>
                        </div>

                          <div class="form-group">
                                                    <label class="control-label col-md-3 col-sm-3 col-xs-12" for="seq">Link<span class="required">*</span>
                                                    </label>
                                                    <div class="col-md-6 col-sm-6 col-xs-12">
                                                        <input type="text"  v-model="menu.link" id="seq" name="link" required="required" class="form-control col-md-7 col-xs-12">
                                                    </div>
                                                </div>


                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="group">Group<span class="required">*</span>
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                 <select place  v-model="menu.groupId" id="groupId" name="groupId" class="form-control">

                                                                       <option v-for="group in groups"  :value="group._id">
                                                                           {{ group.name }}
                                                                       </option>
                                                                   </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="control-label col-md-3 col-sm-3 col-xs-12" for="group">Parent
                            </label>
                            <div class="col-md-6 col-sm-6 col-xs-12">
                                 <select place  v-model="menu.parentId" id="parentId" name="parentId" class="form-control">

                                                                       <option v-for="parent in menus"  :value="parent._id">
                                                                           {{ parent.name }}
                                                                       </option>
                                                                   </select>
                            </div>
                        </div>




                        <div class="ln_solid"></div>
                        <div class="form-group">
                            <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                                <button type="button" class="btn" @click="backList">Back</button>
                                <button type="submit" v-show="method=='new'" class="btn btn-primary" >Save</button>
                                <button type="button" v-show="method=='update'" class="btn btn-danger" @click="delMenu" >Remove</button>
                                <button type="submit" v-show="method=='update'" class="btn btn-primary" >Update</button>
                            </div>
                        </div>
                        <input type="hidden" name="id" :value="menu._id" v-if="method=='update'"/>
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
                menu:{},
                groups:[],
                menus:[],
                method:"new"
            }
        },
        created:function(){

            let _self=this;
            let param = null;
            if (this.$route.params && this.$route.params.menuId)
            {
                this.method="update";
                param = {id:this.$route.params.menuId};
            }
            $.post("/setting/menu/get",param).done((rs)=>{
                _self.groups=rs.groups;
                _self.menus = rs.menus;
                if (rs.data)
                    _self.menu = rs.data;
            }).fail(function(){});
        },
        mounted:function(){
            initFormValidate();
        },
        methods: {
            backList:function()
            {
                this.$router.push('/setting/menuList')
            },
            delMenu:function()
            {
                let _self=this;
                confirmOper("Prompt","Confirm delete",function()
                {
                    $.post("/setting/menu/del",{group:_self.group}).done((rs)=>{_self.method="new";_self.group={}; notify("Delete successfully","","success");}).fail(function(){})
                });
            },
            saveMenu:function()
            {
                if (validateForm())
                {
                    let _self=this;
                    if (this.method=="new")
                        $.post("/setting/menu/save",{menu:this.menu}).done((rs)=>{_self.method="update"; notify("Saved successfully","","success");}).fail(function(){})
                    else
                        $.post("/setting/menu/update",{menu:this.menu}).done((rs)=>{ notify("Updated successfully","","success");}).fail(function(){})
                }
            }
        }

    }
</script>

