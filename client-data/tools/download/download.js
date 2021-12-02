

(function download() { //Code isolation

    function downloadSVGFile() {
        var canvasCopy = Tools.svg.cloneNode(true);
        canvasCopy.removeAttribute("style", ""); // Remove css transform
        var styleNode = document.createElement("style");

        // Copy the stylesheets from the whiteboard to the exported SVG
        styleNode.innerHTML = Array.from(document.styleSheets)
            .filter(function (stylesheet) {
                if (stylesheet.href && (stylesheet.href.match(/boards\/tools\/.*\.css/)
                    || stylesheet.href.match(/board\.css/))) {
                    // This is a Stylesheet from a Tool or the Board itself, so we should include it
                    return true;
                }
                // Not a stylesheet of the tool, so we can ignore it for export
                return false;
            })
            .map(function (stylesheet) {
                return Array.from(stylesheet.cssRules)
                    .map(function (rule) { return rule.cssText })
            }).join("\n")

        canvasCopy.appendChild(styleNode);
        var outerHTML = canvasCopy.outerHTML || new XMLSerializer().serializeToString(canvasCopy);
        var blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        downloadContent(blob, Tools.boardName + ".svg");
    }

    function downloadContent(blob, filename) {
        if (window.navigator.msSaveBlob) { // Internet Explorer
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            var element = document.createElement('a');
            element.setAttribute('href', url);
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            window.URL.revokeObjectURL(url);
        }
    }

    Tools.add({ //The new tool
        "name": "Download",
        "shortcut": "d",
        "listeners": {},
        "icon": "tools/download/download.svg",
        "oneTouch": true,
        "onstart": downloadSVGFile,
        "mouseCursor": "crosshair",
    });

})(); //End of code isolation