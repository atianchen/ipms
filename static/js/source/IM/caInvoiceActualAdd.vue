<template>
    <div class="grid">
        <div class="col-md-12 col-sm-12 col-xs-12">
            <div class="x_panel">
                <div class="x_title">
                    <h2>Cash-in/Accrual Invoice Actual</h2>
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
                        <button type="button" class="btn btn-primary" @click='createCAInvoiceActual'>New</button>
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
        data(){
         return{
             q:{},
             gridColumn:[{title:"ContractID",name:"ContractID"},{title:"Customer",name:"customer"},{title:"ProjectID",name:"ProjectID"}
                 {title:"Amount",name:"amount"},{title:"Currency",name:"currency"},{title:"",name:""},{title:"",name:""},{title:"",name:""},
                 {title:"",name:""},{title:"",name:""},{title:"",name:""},{title:"",name:""},{title:"",name:""},],
             gridData:[],
             page:{}
         }
        },
        created: function(){
            let_self=this;
            $.post("/")
        },
        methods:{
            createCAInvoiceActual: function(ev){this.$router.push("/setting/CAInvoiceActual");},
            itemClick: function(param){
                this.$router.push({name:'cainvoiceactualEdit',params:{CAInvoiceActualID: param}})
            },
            pagination:function(page)
            {
                this.page.pn=page;
                this.pageSearch();
            },
            pageSearch: function()
            {
                let_self=this;
                $.post("/IM/caInvoiceActual/list",{page:this.page}).done((res)=>{_self.gridData=rs.data;_self.page=rs.page;}).fail(function(){})
            }
        },
        components:{
            'hy-grid':Grid,
            'hy-gridPager': GridPager        }


    }
</script>

<style scoped>

</style>