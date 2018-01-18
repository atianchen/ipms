<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>MenuGroup <small>MenuGroups List</small></h2>
                    <ul class="nav navbar-right panel_toolbox">

                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div class="x_content">

                    <div class="table-responsive">
                        <hy-grid :columns="gridColumns" :data="gridData"  v-on:itemClick="itemClick"></hy-grid>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-6 col-sm-6 col-xs-6 col-md-offset-1">
                        <button type="button" class="btn btn-primary" @click='createMenuGroup'>New</button>
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
    import {util} from '../../dist/pageHelper.js'

    export default {
        data () {
            return {
                q:{},
                gridColumns: [{title:"Name",name:"name",click:"_id"},{title:"Seq",name:"seq"},{title:"CreateDate",name:"createDate",type:"date",format:"DD/MM/YYYY"}],
                gridData:[],
                page:{}
            }
        },
        created:function(){
            let _self=this;
            $.post("/setting/menugroup/list").done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
        },
        methods: {
            createMenuGroup:function(ev){this.$router.push("/setting/menuGroupAdd");},
            itemClick: function (param) {
                this.$router.push({ name:'menuGroupEdit', params: { groupId: param }})
            },
            pagination:function(page)
            {
                this.page.pn = page;
                this.pageSearch();
            },
            pageSearch:function()
            {
                let _self=this;
                $.post("/setting/menugroup/list",{q:util.qfilter(this.q),page:this.page}).done((rs)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }
        },
        components: {
            'hy-grid': Grid,
            'hy-gridPager': GridPager
        }
    }
</script>

