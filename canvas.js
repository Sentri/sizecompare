var contents = {};
var IMAGEHEIGHT = 500;

function handleCanvas(data) {
    syncElements(data);
}

function newImage(id, name, size, type) {
    if (typeof validTypes[type] === "undefined") return; 
    if (size <= 0) return;
    var image = $("<img>").addClass("canvasimage");
    image.attr("src", "gfx/"+type+".png");
    var wrap = $("<div>").addClass("canvaswrap");
    var span = $("<span>").text("");
    wrap.append(image).append(span);
    $("#canvas").append(wrap);
    contents[id] = {
        "name": name,
        "size": size,
        "type": type,
        "element": wrap[0],
    }
}

function updateImage(id, name, size, type) {
    if (typeof validTypes[type] === "undefined") return; 
    if (size <= 0) return;
    contents[id].name = name;
    contents[id].size = size;
    contents[id].type = type;
    var image = $(contents[id].element).children("img");
    image.attr("src", "gfx/"+type+".png");
}

function deleteImage(id) {
    $(contents[id].element).remove();
    delete contents[id];
}

function syncElements(data) {
    var seen = [];
    // update data to local cache
    for (var i = 1; i < data.length; i++) {
        var id = data[i][0];
        seen.push(id);
        if (typeof contents[id] == "undefined") {
            newImage(id, data[i][1], data[i][2], data[i][3]);
        } else {
            updateImage(id, data[i][1], data[i][2], data[i][3]);
        }
    } 
    // delete from local cache what has been deleted from data
    for (var k in contents) {
        if (seen.indexOf(k) == -1) {
            deleteImage(k);
        }  
    }
    updateSizes();
}

function updateSizes() {
    var maxSize = 0;
    var xpos = 0;
    for (var k in contents) {
        if (contents[k].size > maxSize) {
            maxSize = contents[k].size;
        } 
    }
    if (maxSize <= 0) return;
    for (var k in contents) {
        var dim = validTypes[contents[k].type];
        var img_h = IMAGEHEIGHT * (contents[k].size / maxSize);
        var wrap = $(contents[k].element);
        var image = wrap.children("img");
        var label = wrap.children("span");
        label.text(contents[k].name);
        image.css("height", img_h+"px");
        wrap.css("left",xpos+"px");
        var w = (dim[0]/dim[1])*img_h;
        xpos += w;
    }
}