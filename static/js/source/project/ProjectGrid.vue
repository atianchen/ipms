<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Project <small>Manage consultant's task</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">
                    <div class="row qrbar">
                        <ul>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.name" placeholder="Project Name">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                     <select  type="text" id="projectId" name="projectId" class="form-control" v-model="q.projectId" >
                                        <option value="111" disabled selected >Choose ProjectId</option>
                                        <option v-for="item in projects" :value="item.projectId">
                                            {{ item.projectId }}
                                        </option>
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.sysProj" placeholder="Sys Proj">
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <select   placeholder="pm.name" v-model="q.pmId" id="q.pmId" name="q.pmId" class="form-control"  >
                                        <option value="" disabled selected>Choose PM</option>
                                        <option v-for="item in persons"  :value="item.userId ">
                                            {{ item.userId }}
                                        </option>
                                    </select>
                                </div>
                            </li>
                            <li>
                                <div class="input-group">
                                    <input type="text" class="form-control  col-md-2" v-model="q.contractId" placeholder="Contract Id">
                                </div>
                            </li>
                            <li>
                                <button type="button" class="btn btn-default" @click="pageSearch">Search</button>
                                <button type="button" class="btn btn-default" @click="exportXls">Export</button>
                            </li>
                        </ul>
                    </div>
                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
                        <button type="button" class="btn btn-primary" @click='createProj'>New</button>
                    </div>
                    <hy-gridPager :page="page"  v-on:paginationClick="pagination"></hy-gridPager>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Grid from '../ctrl/Grid.vue'
    import GridPager from '../ctrl/GridPager.vue'
    import ajaxDownload  from '../ctrl/ajaxDownload'
    import {util} from '../../dist/pageHelper.js'
    export default {
        data () {
            return {
                q:{},
                gridColumns: [{title:"Project Name",name:"name",click:"_id"},{title:"Project Id",name:"projectId"},{title:"Project Type",name:"type"},{title:"Task Id",name:"taskId"},{title:"System Project Id",name:"sysProj"},{title:"ContractId",name:"contract.contractId"},
                    {title:"Planned Milestone",name:"planedMilestones",join:"/"},{title:"Current Milestone",name:"currentMilestone"},{title:"PM",name:"pm.name"},{title:"Division",name:"division"},{title:"Create Date",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
                gridData:[],
                page:{},
                projects:[],
                contracts:[],
                projectId: "Choose Project",
                persons:[]
            }
        },

        created:function(){
            let _self=this;
            $.post("/project/project/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;_self.projects=rs.projects;_self.persons=rs.persons;}).fail(function(){})
        },
        methods: {
            createProj:function(ev){this.$router.push("/project/projectAdd");},
            itemClick: function (param) {
                this.$router.push({ name:'projectEdit', params: { projId: param }})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self=this;
                $.post("/project/project/list",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            },
            exportXls:function()
            {
                ajaxDownload('/project/project/exportProj', util.qfilter(this.q), 'q');
            },
            // 排序

             //排序
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>