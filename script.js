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
        $("#btnmetric").removeClass("btn-default").addClass("btn-primary");
        $("#btnimperial").removeClass("btn-primary").addClass("btn-default");
    } else {
        $("#btnimperial").addClass("btn-primary").removeClass("btn-default");
        $("#btnmetric").addClass("btn-default").removeClass("btn-primary");
    }
    var chars = $("div.character");
    for (var i = 0; i < chars.length; i++) {
        updateMeasure(chars[i], isMetric);
    }
}

function updateMeasure(parentelement, isMetric) {
    var parent = $(parentelement);
    var span1 = parent.find("span.bigunit");
    var span2 = parent.find("span.smallunit");
    if (isMetric) {
        span1.text("m"); span2.text("cm");
    } else {
        span1.text("ft"); span2.text("in");
    }
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