/**
 * Created by jensen on 2017/2/20.
 */
$(function(){
    var formInstance = $("#loginForm").parsley();
    $("#bindbtn").on("click",function()
    {
        if (formInstance.validate())
        {
            $("span.glyphicon").addClass("glyphicon-refresh" ).addClass("glyphicon-refresh-animate").next().html("Binding...");
            setTimeout(function()
                {
                    $.post("/upe/bind",{upeMemberId:$("#upeMemberId").val(),userId:$("#userId").val(),pwd:$("#pwd").val()}).done(function(rs){

                        if (rs.err) {
                            $("span.glyphicon").removeClass("glyphicon-refresh" ).removeClass("glyphicon-refresh-animate").next().html("Bind Success");
                            $("div.error").show();
                        }
                        else {
                            $("span.glyphicon").removeClass("glyphicon-refresh" ).removeClass("glyphicon-refresh-animate").next().html("Success");
                            window.location = $("#target").value();//"/index";
                        }

                    }).fail(function(){console.log("error");})
                }
                ,500);

        }
        return false;
    });
});
