<template>
        <div class="col-md-5 col-sm-5 col-xs-5" >
            <div class="dataTables_paginate paging_simple_numbers" id="datatable-fixed-header_paginate">
                <ul class="pagination" style="margin:0" >
                    <li v-if="page.pn>0" class="paginate_button previous"   >
                       <a @click="firstPage()"  aria-controls="datatable-fixed-header"  data-dt-idx="0" tabindex="0">First</a></li>
                    <li v-else class="paginate_button previous disabled"   >
                        <a  aria-controls="datatable-fixed-header"  data-dt-idx="0" tabindex="0">First</a></li>

                    <li v-if="page.pn && page.pn>0" class="paginate_button" ><a @click="prevPage()" aria-controls="datatable-fixed-header" data-dt-idx="2" tabindex="0">Previous</a></li>
                    <li v-else class="paginate_button disabled" ><a  aria-controls="datatable-fixed-header" data-dt-idx="2" tabindex="0">Previous</a>

                    <li v-if="page.totalPage>0 && page.pn<(this.page.totalPage-1)" class="paginate_button" ><a  @click="nextPage()" aria-controls="datatable-fixed-header" data-dt-idx="3" tabindex="0">Next</a></li>
                    <li v-else="page.totalPage>0 && page.pn<(this.page.totalPage-1)" class="paginate_button disabled" ><a  aria-controls="datatable-fixed-header" data-dt-idx="3" tabindex="0">Next</a></li>

                    <li  v-if="page.totalPage>0 && page.pn<(this.page.totalPage-1)"  class="paginate_button next"  ><a @click="lastPage()"  aria-controls="datatable-fixed-header" data-dt-idx="7" tabindex="0">Last</a></li>
                    <li  v-else class="paginate_button next disabled"  ><a @click="lastPage()"  aria-controls="datatable-fixed-header" data-dt-idx="7" tabindex="0">Last</a></li>
                </ul>
            </div>
        </div>
</template>
<style>

</style>
<script>
    export default{
       name:"hy-gridPager",
       props:['page'],
       mounted:function()
       {

       },
       methods:
       {
            firstPage:function()
            {
             this.$emit('paginationClick',0)
            },
            lastPage:function()
            {
               this.$emit('paginationClick',this.page.totalPage-1)
            },
            prevPage:function()
            {
               this.$emit('paginationClick',this.page.pn-1);
            },
            nextPage:function()
            {
               this.$emit('paginationClick',this.page.pn+1);
            }
       },
       computed: {
          hasPrevPage: function () {
            try
            {
                let rs =  this.page && this.page.pn && this.page.pn>0;
                return true;
            }
            catch (e)
            {
                 return false;
            }
          },
          hasNextPage:function()
          {
            return this.page && this.page.totalPage && this.page.totalPage>0 && this.page.pn<(this.page.totalPage-1);
          }
        }
    }
</script>
