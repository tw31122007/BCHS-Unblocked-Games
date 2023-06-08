var device_scale = window.devicePixelRatio;
var renderer;

function setup_rendering() {

	var width = 640, height = 480;
	renderer = PIXI.autoDetectRenderer(width, height,
		{transparent: true, resolution: window.devicePixelRatio});

	splash_stage = new PIXI.Container();
	gameplay_stage = new PIXI.Container();

	// add the renderer view element to the DOM
	renderer.view.style.width = width;
	renderer.view.style.height = height;
	document.body.appendChild(renderer.view);

}


var box_thickness = 4;

// render the current frame
function render() {

	switch (scene.scene_state) {
		case "splash":
			renderer.render(splash_stage);
			break;
		case "gameplay":
			box.render();
			heart.render();
			renderer.render(gameplay_stage);
			break;
		default:
			break;
	}


}
