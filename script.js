function getMetric() {
    return document.getElementById("ismetric").checked;
}

function setMetric(isMetric) {
    document.getElementById("ismetric").checked = isMetric;
    updateMetric();
}

function updateMetric() {
    isMetric = getMetric();
    if (isMetric) {
        $("btnmetric").addClass("btn-primary").removeClass("btn-default");
        $("btnimperial").addClass("btn-default").removeClass("btn-primary");
    } else {
        $("btnimperial").addClass("btn-primary").removeClass("btn-default");
        $("btnmetric").addClass("btn-default").removeClass("btn-primary");
    }
    var chars = $("div.character");
    for (var k in chars) {
        updateMeasure(chars[k], isMetric);
    }
}

function updateMeasure(parentelement, isMetric) {
    console.log(parentelement);
}

function addCharacter() {
    var template = $("#character-template").html().trim();
    var newrow = $(template);
    updateMeasure(newrow, getMetric());
    $("#character-container").append(newrow);
}

$(function(){
   $("#addnew").on("click", function(e){
       addCharacter();       
   });
   $("#btnmetric").on("click", function(e){
       setMetric(true);    
   });
   $("#btnimperial").on("click", function(e){
       setMetric(false);
   });
   setMetric(false);
   addCharacter(); 
});

// jQuery deserialize credit to David Hammond
(function (jQuery) {
    jQuery.fn.deserialize = function (data) {
        var f = jQuery(this),
            map = {},
            find = function (selector) { return f.is("form") ? f.find(selector) : f.filter(selector); };
        //Get map of values
        jQuery.each(data.split("&"), function () {
            var nv = this.split("="),
                n = decodeURIComponent(nv[0]),
                v = nv.length > 1 ? decodeURIComponent(nv[1]) : null;
            if (!(n in map)) {
                map[n] = [];
            }
            map[n].push(v);
        })
        //Set values for all form elements in the data
        jQuery.each(map, function (n, v) {
            find("[name='" + n + "']").val(v);
        })
        //Clear all form elements not in form data
        find("input:text,select,textarea").each(function () {
            if (!(jQuery(this).attr("name") in map)) {
                jQuery(this).val("");
            }
        })
        find("input:checkbox:checked,input:radio:checked").each(function () {
            if (!(jQuery(this).attr("name") in map)) {
                this.checked = false;
            }
        })
        return this;
    };
})(jQuery);