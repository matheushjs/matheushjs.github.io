(function buildTOC() {
  // Helper: run callback when Reveal is ready (if available), else on DOMContentLoaded
  function onReady(cb) {
    if (window.Reveal && typeof Reveal.addEventListener === 'function') {
      // wait until reveal is fully initialized
      Reveal.addEventListener('ready', cb);
      // if already ready, the event may not fire — call immediately if available indices exist
      if (Reveal.getIndices && Reveal.getIndices()) {
        // slight async to allow other listeners to run
        setTimeout(cb, 0);
      }
    } else {
      document.addEventListener('DOMContentLoaded', cb);
    }
  }

  onReady(function () {
    const tocContainer = document.querySelectorAll('.toc');
    if (!tocContainer) {
        console.warn('TOC: No element with class ".toc" found.');
        return;
    }

    // Find all section elements inside reveal slides container
    const allSections = document.querySelectorAll('.reveal .slides > section');
    var slidesData = [];

    // Get data for each slide.
    allSections.forEach((node, idx) => {
      obj = {"node": node};

      const seq = idx + 1; // slide sequence number starting at 1
      const idName = node.id || "slide" + String(seq);
      node.id = idName;

      obj["slideid"] = idName;

      if("data-section" in node.attributes){
        let secName = node.attributes["data-section"].value;
        obj["secName"] = secName;
      }

      if("data-subsection" in node.attributes){
        let subsecName = node.attributes["data-subsection"].value;
        obj["subsecName"] = subsecName;
      }

      slidesData.push(obj);
    })

    // Build TOC hierarchy
    var tocData = [];
    var lastSec = null;
    slidesData.forEach(obj => {
      if(obj["secName"] && obj["subsecName"]){
        var newObj = {
          "secName": obj["secName"],
          "subsecs": [{
            "subsecName": obj["subsecName"],
            "slideid": obj["slideid"]
          }],
          "slideid": obj["slideid"]
        };
        tocData.push(newObj);
        lastSec = newObj;
      } else if (obj["secName"]){
        var newObj = {
          "secName": obj["secName"],
          "subsecs": [],
          "slideid": obj["slideid"]
        };
        tocData.push(newObj);
        lastSec = newObj;
      } else if (obj["subsecName"]){
        lastSec["subsecs"].push({
          "subsecName": obj["subsecName"],
          "slideid": obj["slideid"]
        });
      }
    })

    // Build the hierarchical list
    const ol = document.createElement('ol');
    ol.className = 'toc-root';

    for(var sec of tocData){
        const li = document.createElement('li');
        li.className = 'toc-elem';

        // create link for h1
        const a = document.createElement('a');
        a.href = '#' + sec["slideid"]; // user-friendly anchor
        a.textContent = sec["secName"];
        
        li.appendChild(a);

        const innerOl = document.createElement('ol');
        innerOl.className = 'toc-subelem';
        for(var subsec of sec["subsecs"]){
            const li2 = document.createElement('li');
            const a2 = document.createElement('a');
            a2.href = '#' + subsec["slideid"];
            a2.textContent = subsec["subsecName"];
            li2.appendChild(a2);
            innerOl.appendChild(li2);
        }
        li.appendChild(innerOl);
        ol.appendChild(li);
    }

    // Clear previous TOC content and append new list
    tocContainer.forEach(elem => {        
        // First add header
        var header = document.createElement('h1');
        header.innerText = "Table of Contents";
        elem.parentNode.prepend(header);
        elem.parentNode.classList.add("noslidenumber");
        elem.parentNode.classList.add("toc-section");
        elem.parentNode.style = "text-align: left;"
        elem.parentNode.setAttribute("data-visibility", "uncounted");
        elem.innerHTML = '';
        elem.appendChild(ol);
    });

    // Add TOC before sections and subsections
    slidesData.forEach(obj => {
      if("data-notoc" in obj.node.attributes){
        return;
      } else if(obj["subsecName"]){
        var clonedToc = ol.cloneNode(true);

        // Make all <a> fade
        let allAnchors = clonedToc.querySelectorAll("a");
        allAnchors.forEach(a => {
          a.classList.add("toc-faded");
        });

        // Find the proper element
        var elem = Array.from(clonedToc.querySelectorAll("li > a")).filter(node => node.innerText === obj["subsecName"]);
        elem = elem[0];
        elem.classList.remove("toc-faded");
        while(!(elem.classList.contains("toc-elem"))){
          elem = elem.parentNode;
        }
        elem.querySelector("a").classList.remove("toc-faded");

        var newSection = document.createElement("section");
        newSection.classList.add("noslidenumber");
        newSection.classList.add("toc-section");
        newSection.style = "text-align: left;";
        newSection.setAttribute("data-visibility", "uncounted");
        var newh1 = document.createElement("h1");
        newh1.innerText = "Table of Contents"
        newSection.appendChild(newh1);
        newSection.appendChild(clonedToc);
        
        var parent = obj.node.parentNode;
        parent.insertBefore(newSection, obj.node);
      } else if(obj["secName"]){
        var clonedToc = ol.cloneNode(true);

        // Make all <a> fade
        let allAnchors = clonedToc.querySelectorAll("a");
        allAnchors.forEach(a => {
          a.classList.add("toc-faded");
        });

        // Find the proper element
        var elem = Array.from(clonedToc.querySelectorAll("li > a")).filter(node => node.innerText === obj["secName"]);
        elem = elem[0];
        elem.classList.remove("toc-faded");

        var newSection = document.createElement("section");
        newSection.classList.add("noslidenumber");
        newSection.classList.add("toc-section");
        newSection.style = "text-align: left;";
        newSection.setAttribute("data-visibility", "uncounted");
        var newh1 = document.createElement("h1");
        newh1.innerText = "Table of Contents"
        newSection.appendChild(newh1);
        newSection.appendChild(clonedToc);
        
        var parent = obj.node.parentNode;
        parent.insertBefore(newSection, obj.node);
      }
    });

    Reveal.sync();

    // OPTIONAL: update active TOC item on slide change
    function highlightActive(ev) {
      // ev may be Reveal 'slidechanged' event or null (we can read Reveal.getIndices())
      let indices = {h:0,v:0};
      if (ev && ev.currentSlide) {
        const slide = ev.currentSlide;
        indices = Reveal.getIndices ? Reveal.getIndices(slide) : {h:0,v:0};
      } else if (Reveal && typeof Reveal.getIndices === 'function') {
        indices = Reveal.getIndices();
      }
      // find the sequence number corresponding to indices by scanning leafSlides
      let seqNum = null;
      for (let i = 0; i < leafSlides.length; i++) {
        const s = leafSlides[i];
        const hv = computeHVIndices(s);
        if (hv.h === indices.h && hv.v === indices.v) {
          seqNum = i + 1;
          break;
        }
      }
      // remove current highlight
      tocContainer.querySelectorAll('.toc-current').forEach(el => el.classList.remove('toc-current'));
      if (seqNum !== null) {
        // find anchor with matching data-slide-seq
        const a = tocContainer.querySelector('a[data-slide-seq="' + seqNum + '"]');
        if (a) a.classList.add('toc-current');
      }
    }

    // if (window.Reveal && typeof Reveal.addEventListener === 'function') {
    //   Reveal.addEventListener('slidechanged', highlightActive);
    //   // initial highlight
    //   highlightActive();
    // } else {
    //   // fallback: on hashchange or load, try to highlight
    //   window.addEventListener('hashchange', highlightActive);
    //   highlightActive();
    // }
  });
})();
