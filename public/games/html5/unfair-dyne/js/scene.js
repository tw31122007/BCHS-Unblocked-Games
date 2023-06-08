var splash_stage;
var gameplay_stage;

function Scene() {

	this.scene_state = "splash";
	this.scene_time = 0;

	/*
		Possible scene states:
		"splash",
		"gameplay"
	*/

};

Scene.prototype.selectScene = function(name, data) {

	this.scene_state = name;
	this.scene_time = 0;

	switch(this.scene_state) {
		case "splash":
			break;
		case "gameplay":
			undyne.queue_text([
				{ text: "So you want to spar\nwith me, huh?" },
				{ text: "Well you'd better\ngive it all you've\ngot!" },
			], menu.show.bind(menu));
			gameplay_stage.alpha = 0;
			break;
	}

}

Scene.prototype.update = function(delta_ms) {

	this.scene_time += delta_ms;

	switch(this.scene_state) {
		case "splash":
			splash_animation.update(delta_ms);
			break;
		case "gameplay":
			if (this.scene_time < 150) {
				gameplay_stage.alpha = interp_clamp(this.scene_time, 0, 100, 0, 1);
			}
			gamestate.update(delta_ms);
			break;
	}

};


var scene = new Scene();
