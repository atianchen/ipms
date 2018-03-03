<template>
    <div >
        <table class="table table-striped jambo_table bulk_action  table-bordered">
            <thead>
            <tr class="headings">
                <th v-for="col in columns">{{col.title}}</th>
            </tr>
            </thead>

            <tbody>
             <tr v-for="(entry,index) in data" class="pointer" v-bind:class="[(index%2==0) ? 'even' : 'odd']">
                   <td v-for="col in columns">
                       <template v-if="col.click">
                           <a @click="itemClick(entry[col.click],entry)" v-html="renderItem(col,entry)"></a>
                       </template>
                       <template v-else>
                           {{renderItem(col,entry)}}
                       </template>
                    </td>
             </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'hy-grid',
  props:['columns','data'],
  methods: {
  renderItem:function(col,data)
  {
    if (col.type && col.type=="date")
    {
     if (data[col.name])
        return moment(data[col.name]*1000).format(col.format);
     else
        return "";
    }
    else if (col.exp)
    {
        return col.exp(data);
    }
    else
    {
        let properties = col.name.split(".");
        let val = data;
        properties.forEach(function(p)
        {
            if (val)
             val = val[p];
            else
                val = null;
        });
        if  (val && Array.isArray(val) && col.join)
            return val.join(col.join);
        else
         return val;
    }
  },
    itemClick: function (param,entry) {
            this.$emit('itemClick',param,entry)
    }
  }
}
</script>

