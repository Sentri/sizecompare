var DATA_HASH;

function getMetric() {
    return document.getElementById("ismetric").checked;
}

function setMetric(isMetric) {
    document.getElementById("ismetric").checked = isMetric;
    updateMetric();
}

function getAbsValue(big, small) {
    if (getMetric()) {
        return big + (small*0.01);
    } else {
        return (big*0.3048) + (small*0.0254);
    }
}

function getUnits(aval) {
    if (getMetric()) {
        var meters = Math.floor(aval);
        var cm = Math.floor((aval-meters)*100);
        return [meters, cm];
    } else {
        var imp = aval/0.3048;
        var feet = Math.floor(imp);
        var inch = Math.floor((imp-feet)*12);
        return [feet, inch];
    }
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

function addCharacter(id, name, size, type) {
    var template = $("#character-template").html().trim();
    var newrow = $(template);
    // set measurement units
    updateMeasure(newrow, getMetric());
    // add event listeners
    newrow.find("button.xbutton").on("click", deleteme);
    newrow.find(".character-type").on("change", fireUpdate);
    newrow.find(".character-name").on("change", fireUpdate).on("click",selectAll);
    newrow.find(".big-unit-value").on("change", fireUpdate).on("click",selectAll);
    newrow.find(".small-unit-value").on("change", fireUpdate).on("click",selectAll);
    // set data from given values
    if (typeof id === "undefined") {
        newrow.attr("data-uid", uid());
    } else {
        newrow.attr("data-uid", id);
    }
    if (typeof type !== "undefined") {
        newrow.find(".character-type").val(type);
    }
    if (typeof size !== "undefined") {
        var units = getUnits(size);
        newrow.find(".big-unit-value").val(units[0]);
        newrow.find(".small-unit-value").val(units[1]);
    }
    if (typeof name !== "undefined") {
        newrow.find(".character-name").val(name);
    }
    // finish
    $("#character-container").append(newrow);
    fireUpdate();
}

function deleteme(e) {
    var parent = $(this).closest("div.character");
    parent.remove();
    fireUpdate();
}

function getFormData() {
    var cName, cType, cBigUnit, cSmallUnit, cId, char, obj;
    var data = [];
    var characterElements = $("#character-container").children("div.character");
    for (var i = 0; i < characterElements.length; i++) {
        char = $(characterElements[i]);
        cId = char.attr("data-uid");
        cType = char.find(".character-type").val();
        cBigUnit = parseInt(char.find(".big-unit-value").val());
        cSmallUnit = parseInt(char.find(".small-unit-value").val());
        cBigUnit = isNaN(cBigUnit) ? 0 : cBigUnit;
        cSmallUnit = isNaN(cSmallUnit) ? 0 : cSmallUnit;
        cName = char.find(".character-name").val();
        obj = [
          cId,
          cName,
          getAbsValue(cBigUnit, cSmallUnit),
          cType
        ];
        data.push(obj);
    }
    return data;
}

function isValidData(data) {
    var validTypes = ["pony","humanmale"];
    if (!Array.isArray(data)) return false;
    for (var i = 0; i < data.length; i++) {
        if (!Array.isArray(data[i])) return false;
        if (data[i].length != 4) return false;
        if (typeof data[i][0] !== "string") return false;
        if (typeof data[i][1] !== "string") return false;
        if (typeof data[i][2] !== "number") return false;
        if (typeof data[i][3] !== "string") return false;
        if (data[i][2] < 0) return false;
        if (data[i][0].length < 1) return false;
        if (validTypes.indexOf(data[i][3]) === -1) return false;
    }
    return true;
}

function setFormData(data) {
    var name, id, size, type;
    if (!isValidData(data)) {
        console.log("Invalid data");
        return false;
    }
    $("#character-container").children("div.character").remove();
    for (var i = 0; i < data.length; i++) {
        addCharacter(data[i][0], data[i][1], data[i][2], data[i][3]);
    }
    updateMain(data);
    return true;
}

function fireUpdate() {
    updateMain(getFormData());
}

function getStringified(data) {
    return window.btoa(JSON.stringify(data));
}

function parseStringified(str) {
    var parsed = window.atob(str);
    try {
        var data = JSON.parse(parsed);
        return data;
    } catch (e) {
        console.log("Invalid hash");
    }
    return null;
}

function updateMain(data) {
    DATA_HASH = getStringified(data);
    var path = typeof window.location.path == "undefined" ? 
        window.location.pathname : window.location.path;
    $("#jsondata").val(
        window.location.origin + path
        + "#" + DATA_HASH
    );
    window.location.hash = "#" + DATA_HASH;
    handleCanvas(data);
}

function checkHash() {
    if (window.location.hash.length > 10) {
        var data = parseStringified(window.location.hash.substring(1));
        if (data != null) {
           return setFormData(data); 
        } 
    }
    return false;
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
   $(window).on('hashchange', function() {
       if (window.location.hash.substring(1) != DATA_HASH) {
           checkHash();
       }
   });
   $("#jsondata").on("click",selectAll);
   setMetric(false);
   if (!checkHash()) {
       addCharacter(); 
   }
});

function uid() {
    return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function selectAll() {
   $(this).select();
}