var DATA_HASH;
var validTypes = {
    "pony": [285, 578, 1.2],
    "humanmale": [184, 569, 1.85],
    "wolf": [676, 570, 0.85],
    "eagle": [450, 399, 0.88],
    "dragon": [450, 413, 5.5],
    "tree": [395, 700, 10],
    "building": [529,318, 6.5],
};

function getMetric() {
    return document.getElementById("ismetric").checked;
}

function setMetric(isMetric) {
    document.getElementById("ismetric").checked = isMetric;
    updateMetric();
    fireUpdate();
}

function getAbsValue(big, small) {
    if (getMetric()) {
        return big + (small*0.01);
    } else {
        return (big*0.3048) + (small*0.0254);
    }
}

function getUnits(aval, metric) {
    if (typeof metric === 'undefined') {
        metric = getMetric();
    }
    if (metric) {
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
    // get data from previous
    if (typeof id === "undefined") {
        var data = getFormData();
        if (data.length > 1) {
            type = data[data.length-1][3];
        }
    }
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
    } else {
        if (typeof type !== "undefined") {
            var defaultSize = validTypes[type][2];
            var units = getUnits(defaultSize, true);
            newrow.find(".big-unit-value").val(units[0]);
            newrow.find(".small-unit-value").val(units[1]);
        }
    }
    if (typeof name !== "undefined") {
        newrow.find(".character-name").val(name);
    }
    // finish
    $("#character-container").append(newrow);
}

function deleteme(e) {
    var parent = $(this).closest("div.character");
    parent.remove();
    fireUpdate();
}

function getFormData() {
    var cName, cType, cBigUnit, cSmallUnit, cId, char, obj;
    var data = [getMetric()];
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
    if (!Array.isArray(data)) return false;
    if (typeof data[0] !== "boolean") return false;
    if (data.length <= 1) return false;
    for (var i = 1; i < data.length; i++) {
        if (!Array.isArray(data[i])) return false;
        if (data[i].length != 4) return false;
        if (typeof data[i][0] !== "string") return false;
        if (typeof data[i][1] !== "string") return false;
        if (typeof data[i][2] !== "number") return false;
        if (typeof data[i][3] !== "string") return false;
        if (data[i][2] < 0) return false;
        if (data[i][0].length < 1) return false;
        if (typeof validTypes[data[i][3]] == "undefined") return false;
    }
    return true;
}

function setFormData(data) {
    var name, id, size, type;
    if (!isValidData(data)) {
        console.log("Invalid data");
        console.log(data);
        return false;
    }
    $("#character-container").children("div.character").remove();
    setMetric(data[0]);
    for (var i = 1; i < data.length; i++) {
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
    try {
        var parsed = window.atob(str);
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
       fireUpdate();   
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
   if (!checkHash()) {
       addCharacter(uid(),"", 1.8288, "humanmale"); 
       setMetric(false);
   }
});

function uid() {
    return 'xxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function selectAll() {
   $(this).select();
}