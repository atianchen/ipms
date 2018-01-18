/**
 * Created by jensen on 2017/1/21.
 */
$(function(){
    var formInstance = $("#loginForm").parsley();
    $("#loginbtn").on("click",function()
    {
        if (formInstance.validate())
        {
            $("span.glyphicon").addClass("glyphicon-refresh" ).addClass("glyphicon-refresh-animate").next().html("Logining...");
            setTimeout(function()
                {
                    $.post("/login",{userId:$("#userId").val(),pwd:$("#pwd").val()}).done(function(rs){

                        if (rs.err) {
                            $("span.glyphicon").removeClass("glyphicon-refresh" ).removeClass("glyphicon-refresh-animate").next().html("Submit");
                            $("div.error").html(rs.err).show();
                        }
                        else {
                            $("span.glyphicon").removeClass("glyphicon-refresh" ).removeClass("glyphicon-refresh-animate").next().html("Success");
                            window.location = "/index";
                        }

                    }).fail(function(){console.log("error");})
                }
            ,500);

        }
        return false;
    });
 });
