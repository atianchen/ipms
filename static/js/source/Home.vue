<template>
    <div id="home">
        <!-- top tiles -->
        <div class="row tile_count">
           <!-- <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top"><i class="fa fa-user"></i> Today Punch In</span>
                <div class="count">12</div>
                <span class="count_bottom"><i class="green">12% </i> </span>
            </div>
            <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                <span class="count_top"><i class="fa fa-clock-o"></i> Task</span>
                <div class="count">123</div>
                <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>3% </i> From Last Month</span>
            </div>-->

        </div>
        <!-- /top tiles -->


        <div class="row">


            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel tile">
                    <div class="x_title">
                        <h2>Report Chart</h2>
                        <ul class="nav navbar-right panel_toolbox">
                        </ul>
                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content" id="chart">
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script>
import highCharts from "highcharts"
import moment from "moment"
export default {
  name: 'home',
   data () {
    return {

    }
  },
   created:function(){
        let _self = this;
        $.post("/rpt/colchart").done((rs)=>{_self.renderChart(rs);}).fail(function(){});
    },
   methods: {
       getKey:function(year ,month,day)
       {
           return ((day.toString().length<2)?"0"+day:day)+"/"+((month.toString().length<2)?"0"+month:month)+"/"+year
       },
       renderChart:function(rs)
        {
           let _self = this;
           let st = moment(rs.st);
           let et =  moment(rs.et);
           let dt = {};
           let dayAry = [];
           let key = null;
           let amd=[];let pmd = [];let otd = [];
           rs.data.forEach(function(item)
           {
               if (item["_id"]["year"] && item["_id"]["month"] && item["_id"]["day"]) {
                   key = _self.getKey(item["_id"]["year"], item["_id"]["month"], item["_id"]["day"]);
                   if (!dt[key]) {
                       dt[key] = [];
                   }
                   dt[key][item["_id"]["period"].trim()] = item.count;
               }
           });
           while (st.unix()<=et.unix())
           {
              key = st.format('DD/MM/YYYY');
             dayAry.push(key);
             if (dt[key] && dt[key]["AM"])
                amd.push(dt[key]["AM"]);
             else
                amd.push(0);
             if (dt[key] && dt[key]["PM"])
             {
                pmd.push(dt[key]["PM"]);
                }
             else
                pmd.push(0);
             if (dt[key] && dt[key]["OT"])
                otd.push(dt[key]["OT"]);
             else
                otd.push(0);
             st.add(1,"days");
           }
           this.drawChart(dayAry,amd,pmd,otd);
        },
        drawChart:function(xAxis,amd,pmd,otd)
        {
          $('#chart').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Daily Info'
            },
            xAxis: {
                categories: xAxis,
                crosshair: true
            },
            yAxis: {
                min: 0,
                max:100,
                allowDecimals:false,
                title: {
                    text: 'ManTime'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'AM',
                data: amd
            }, {
                name: 'PM',
                data: pmd
            }, {
                name: 'OT',
                data: otd
            }]
        });
        }
      }
}
</script>

<style>
body{
background:#F7F7F7;
}

+-*h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color:#2897fb;
}
</style>
