var linkparameters = location.search.split('url=')[1];



function blank(){
            let inFrame
        const popup = open("about:blank", "_blank")
        if (!popup || popup.closed) {
            alert("Popups are disabled!")
        } else {
            const doc = popup.document
            const iframe = doc.createElement("iframe")
            const style = iframe.style
            const link = doc.createElement("link")
    
            doc.title = "Bigfoot's Game Shack"
            link.rel = "icon";
            link.href = "link";
            iframe.src = linkparameters;
            style.position = "fixed"
            style.top = style.bottom = style.left = style.right = 0
            style.border = style.outline = "none"
            style.width = style.height = "100%"
    
            doc.body.appendChild(iframe)

        }
    
    location.assign("../../../index.html#buttonDiv21");

}
blank();