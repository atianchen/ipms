/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function initSelectUI(ve)
{
    $(".select2_multiple,.select2_single").select2({
        allowClear: true
    }).on("change",(e)=>{
        let t = $(e.target);
        if (ve )
        {
            let ary = t.attr("name").split("_");
            if (ary.length>1) {
                ve.$set(ve[ary[0]], ary[1], t.val());
            }
        }
        //ve.$set(ve.record,'person',$(e.target).val())
    });
}
function initUI()
{

    window.CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    window.$BODY = $('body'),
    window.$MENU_TOGGLE = $('#menu_toggle'),
    window.$SIDEBAR_MENU = $('#sidebar-menu'),
    window.$SIDEBAR_FOOTER = $('.sidebar-footer'),
    window.$LEFT_COL = $('.left_col'),
    window.$RIGHT_COL = $('.right_col'),
    window.$NAV_MENU = $('.nav_menu'),
    window.$FOOTER = $('footer');
    $SIDEBAR_MENU.find('li.active ul').hide();
    $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');


    setContentHeight();
    initSidebar();
    $BODY.toggleClass('nav-md nav-sm');
  /*  initToolbox();
    initTooltip();
    initSwitchery();
    initAccordion();
    initCheck();
    initForm();*/
}
var setContentHeight = function () {
    // reset height
    $RIGHT_COL.css('min-height', $(window).height());

    var bodyHeight = $BODY.outerHeight(),
        footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
        leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

    // normalize content
    contentHeight -= $NAV_MENU.height() + footerHeight;
    $RIGHT_COL.css('min-height', contentHeight);
};
// Sidebar
function initSidebar() {
    // TODO: This is some kind of easy fix, maybe we can improve this


    $SIDEBAR_MENU.find('a').on('click', function(ev) {

        var $li = $(this).parent();
        if (!$BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li ul').slideUp();
        }
      /*  if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {*/
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
       // }
    });

   // toggle small or large menu
    $MENU_TOGGLE.on('click', function() {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function(){
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel:{ preventDefault: true }
        });
    }
}
// /Sidebar

// Panel toolbox
function initToolbox() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
}
// /Panel toolbox

// Tooltip
function initTooltip() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
}
// /Tooltip

// Progressbar
/*if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}*/
// /Progressbar

// Switchery
function initSwitchery() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
};
// /Switchery

// iCheck
function initCheck() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
};
// /iCheck



var checkState = '';

function initForm() {
// Table
    $('table input').on('ifChecked', function () {
        checkState = '';
        $(this).parent().parent().parent().addClass('selected');
        countChecked();
    });
    $('table input').on('ifUnchecked', function () {
        checkState = '';
        $(this).parent().parent().parent().removeClass('selected');
        countChecked();
    });
    $('.bulk_action input').on('ifChecked', function () {
        checkState = '';
        $(this).parent().parent().parent().addClass('selected');
        countChecked();
    });
    $('.bulk_action input').on('ifUnchecked', function () {
        checkState = '';
        $(this).parent().parent().parent().removeClass('selected');
        countChecked();
    });
    $('.bulk_action input#check-all').on('ifChecked', function () {
        checkState = 'all';
        countChecked();
    });
    $('.bulk_action input#check-all').on('ifUnchecked', function () {
        checkState = 'none';
        countChecked();
    });
    initSwitchery();

}

function bindCalendar(el,callback)
{
    $(el).daterangepicker({
        singleDatePicker: true,
        autoUpdateInput:false,
        locale: {
            cancelLabel: 'Clear'
        }
    }, function(start, end, label) {
        callback(start)
    });;
}

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

// Accordion
function initAccordion() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
}
let formInstance = null;
function initFormValidate()
{
  formInstance= $("form").parsley();
}
function validateForm()
{
    if (formInstance==null || typeof (formInstance)=="undefined" )
        initFormValidate();
    return formInstance.validate();
}

function notify(title,text,type)
{
    new PNotify({
        title: title,
        delay:3000,
        text: text,
        type: type||'info',
        styling: 'bootstrap3'
    });
}

function confirmOper(title,content,callback)
{
    bootbox.confirm({
        message: content,
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-default'
            }
        },
        callback: function (result) {
            if (result)
                callback();
        }
    });
}
