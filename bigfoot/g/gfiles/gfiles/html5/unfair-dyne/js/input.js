key_is_down = {};

function handleKeyInput(key, dir) {

	if (!game_started) return false;

	if (dir == "down") {
		key_is_down[key] = true;
	} else if (dir == "up") {
		key_is_down[key] = false;
	}

	switch(scene.scene_state) {
		case "splash":
			if (dir == "down" && key == "2") {
				se_press_zed.play();
				splash_animation.add_zed();
			}
			if (dir == "down" && key == "A") {
				splash_animation.outro = true;
			}
			break;
		case "gameplay":
			if (dir == "down") gamestate.handleInput(key);
			break;
	}

}


function isKeyDown(key) {
	if (key_is_down[key]) return true;
	else return false;
}


function onKeyDown(e) {
	if (e.keyCode == 37 || e.keyCode == 74 || e.keyCode == 65) {  // left
		handleKeyInput("left", "down");
	} else if (e.keyCode == 38 || e.keyCode == 73 || e.keyCode == 87) {  // up
		handleKeyInput("up", "down");
	} else if (e.keyCode == 39 || e.keyCode == 76 || e.keyCode == 68) {  // right
		handleKeyInput("right", "down");
	} else if (e.keyCode == 40 || e.keyCode == 75 || e.keyCode == 83) {  // down
		handleKeyInput("down", "down");
	} else if (e.keyCode == 88) {  // X = B
		handleKeyInput("B", "down");
	} else if (e.keyCode == 90) {  // Z = A
		handleKeyInput("A", "down");
	} else if (e.keyCode == 50) {  // press Z, not 2
		handleKeyInput("2", "down");
	}
}

function onKeyUp(e) {
	if (e.keyCode == 37 || e.keyCode == 74 || e.keyCode == 65) {  // left
		handleKeyInput("left", "up");
	} else if (e.keyCode == 38 || e.keyCode == 73 || e.keyCode == 87) {  // up
		handleKeyInput("up", "up");
	} else if (e.keyCode == 39 || e.keyCode == 76 || e.keyCode == 68) {  // right
		handleKeyInput("right", "up");
	} else if (e.keyCode == 40 || e.keyCode == 75 || e.keyCode == 83) {  // down
		handleKeyInput("down", "up");
	} else if (e.keyCode == 88) {  // X = B
		handleKeyInput("B", "up");
	} else if (e.keyCode == 90) {  // Z = A
		handleKeyInput("A", "up");
	}
}




document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
