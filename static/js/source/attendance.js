/**
 * Created by jensen on 2017/1/13.
 */
import Vue from 'vue'


new Vue({
    el: '#pmo',
    data:
    {
        cash:null,
        completedMilestone:null,
        loadfinish:false,
        taskMap:{},
        record:null,
        taskId:null,
        hours:null,
        tasks:null,
        nowTime:null,
        personId:null,
        status:'load',
        coord:null,
        err:null,
        channel:null,
        milestones:[],
        chooseTask:null,
        desc:null,
        inputerr:false
    },
    created:function()
    {
        let _self = this;
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position)
            {
                _self.coord=[position.coords.longitude,position.coords.latitude];
            }, function(){}, {
            });
        }
        let url = "/entry/loadEntryData";
        let param = null;
        if ($("#channel").length>0) {
            this.channel = $("#channel").val();
            param ={user: $("#u").val(), channel: $("#channel").val()};
        }
        else
        {
            url = "/entry/loadUpeEntryData";
            param ={user: $("#u").val()};
        }
            $.post(url, param).done((rs) => {
                _self.personId = rs.person._id;
                _self.person = rs.person;
                _self.tasks = rs.tasks;
                _self.nowTime = rs.nowTime;
                _self.hours = rs.hours;
                _self.taskMap = {};
                if (rs.tasks.length > 0) {
                    _self.taskId = rs.tasks[0]._id.toString();
                    rs.tasks.forEach(function (t) {
                        _self.taskMap[t._id.toString()] = t;
                    });
                }
                if (rs.person.lastProjId)
                    _self.taskId = rs.person.lastProjId;
                _self.status = "record";
                _self.loadfinish = true;
            }).fail(function (e) {
                console.log(e)
            })

    },
    watch:{
        desc:function()
        {
          if (this.desc!=null && this.desc.trim().length>0)
          {
              this.inputerr = false;
          }
        },
        taskId:function()
        {

            this.milestones.splice(0,this.milestones.length);
            try {
                if (this.taskId && this.taskMap && this.taskMap[this.taskId]) {
                    if (this.taskMap[this.taskId].currentMilestone) {
                        this.milestones.push(this.taskMap[this.taskId].currentMilestone);
                    }
                    this.chooseTask = this.taskMap[this.taskId];
                    this.completedMilestone = null;
                    this.cash = null;
                }
            }
            catch (e)
            {

            }
        }
    },
    methods: {
        showCreateTime:function()
        {
            if (this.record.createDate)
                return moment(this.record.createDate*1000).format("DD/MM/YYYY, h:mm:ss");
            else
                return moment(this.record.modifiedDate*1000).format("DD/MM/YYYY, h:mm:ss");
        },
        entry:function(period,event)
        {
            let _self = this;
            if (_self.status==="record"  && this.taskId && this.taskId!=null )
            {
                if (this.desc==null  || this.desc.trim().length<1)
                {
                    this.inputerr = true;
                }
                else {
                    _self.status = "process";
                    $(event.target).addClass("disabled").find("span.glyphicon").addClass("glyphicon-refresh").addClass("glyphicon-refresh-animate");
                    $.post("/entry/submitEntry", {
                        desc: _self.desc,
                        user: _self.personId,
                        taskId: _self.taskId,
                        period: period,
                        coord: _self.coord,
                        channel: _self.channel,
                        completedMilestone: _self.completedMilestone,
                        cash: _self.cash
                    }).done((rs) => {

                        if (rs.err && rs.err != null) {
                            _self.status = "record";
                            _self.err = rs.err;
                        }
                        else {
                            _self.status = "finish";
                            _self.record = rs.entry;
                        }

                        $(event.target).removeClass("disabled").find("span.glyphicon").removeClass("glyphicon-refresh").removeClass("glyphicon-refresh-animate");
                        //setTimeout(function(){window.close()},2000);
                    }).fail(function () {
                        _self.status = "record";
                        _self.err = "Submit Failure ,Pls Retry!";
                    });
                }
            }

        }
    }
})