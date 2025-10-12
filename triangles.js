
addTitleTriangles = function() {
    var tri1 = document.querySelector(".triangle-left");
    var tri2 = document.querySelector(".triangle-right");
    
    [tri1, tri2].forEach(function(node){
        node.classList.remove("fade-out");
        node.classList.add("fade-in");
    })
}

removeTitleTriangles = function() {
    var tri1 = document.querySelector(".triangle-left");
    var tri2 = document.querySelector(".triangle-right");
    
    [tri1, tri2].forEach(function(node){
        node.classList.remove("fade-in");
        node.classList.add("fade-out");
    })
}

addTocTriangles = function() {
    var tri1 = document.querySelector(".triangle-right2");
    var tri2 = document.querySelector(".triangle-up-right");
    
    [tri1, tri2].forEach(function(node){
        node.classList.remove("fade-out");
        node.classList.add("fade-in");
    })
}

removeTocTriangles = function() {
    var tri1 = document.querySelector(".triangle-right2");
    var tri2 = document.querySelector(".triangle-up-right");
    
    [tri1, tri2].forEach(function(node){
        node.classList.remove("fade-in");
        node.classList.add("fade-out");
    })
}