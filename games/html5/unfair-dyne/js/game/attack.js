var next_attack = null;

var attack_queue_time = 0;
var attack_queue = [];

var spear_interval = 400;
var spear_time = 0;

var pike_interval = 400;
var pike_time = 0;

var circle_interval = 1200;
var circle_count = 7;
var circle_time = 0;

var swarm_interval = 400;
var swarm_time = 0;
var swarm_initial_angle = 0;

function switchAttackMode() {

	var borrowed_time = attack_queue[0].time;
	attack_queue.shift();

	var current_attack = attack_queue[0];
	current_attack.time += borrowed_time;

	switch (current_attack.type) {
		case "arrow":
			undyne.opacity_g.alpha = 0.8;
			box.dest_left = 320 - SHIELD_DISTANCE;
			box.dest_right = 320 + SHIELD_DISTANCE;
			box.dest_top = 240 - SHIELD_DISTANCE;
			box.dest_bottom = 240 + SHIELD_DISTANCE;
			// get rid of all spears and pikes
			for (var a = 0; a < spears.length; ++a) {
				spears[a].removed = true;
			}
			for (var a = 0; a < pikes.length; ++a) {
				pikes[a].removed = true;
			}
			for (var a = 0; a < circle_spears.length; ++a) {
				circle_spears[a].removed = true;
			}
			for (var a = 0; a < swarm_spears.length; ++a) {
				swarm_spears[a].removed = true;
			}
			for (var a = 0; a < arrows.length; ++a) {
				arrows[a].sprite.visible = true;
			}
			heart.setColour("green");
			break;
		case "spear":
			spear_interval = current_attack.interval;
			undyne.opacity_g.alpha = 0.5;
			box.dest_left = 240;
			box.dest_right = 400;
			box.dest_top = 200;
			box.dest_bottom = 360;
			spear_time = spear_interval + borrowed_time;
			for (var a = 0; a < arrows.length; ++a) {
				arrows[a].sprite.visible = false;
			}
			heart.setColour("red");
			break;
		case "pike":
			pike_interval = current_attack.interval;
			undyne.opacity_g.alpha = 0.5;
			box.dest_left = 288;
			box.dest_right = 352;
			box.dest_top = 280;
			box.dest_bottom = 360;
			pike_time = pike_interval + borrowed_time;
			for (var a = 0; a < arrows.length; ++a) {
				arrows[a].sprite.visible = false;
			}
			heart.setColour("red");
			break;
		case "circlespear":
			circle_interval = current_attack.interval;
			circle_count = current_attack.count;
			undyne.opacity_g.alpha = 0.5;
			box.dest_left = 40;
			box.dest_right = 600;
			box.dest_top = 160;
			box.dest_bottom = 400;
			circle_time = circle_interval + borrowed_time;
			for (var a = 0; a < arrows.length; ++a) {
				arrows[a].sprite.visible = false;
			}
			heart.setColour("red");
			break;
		case "swarmspear":
			swarm_interval = current_attack.interval;
			undyne.opacity_g.alpha = 0.5;
			box.dest_left = 40;
			box.dest_right = 600;
			box.dest_top = 160;
			box.dest_bottom = 400;
			swarm_time = swarm_interval + borrowed_time;
			for (var a = 0; a < arrows.length; ++a) {
				arrows[a].sprite.visible = false;
			}
			heart.setColour("red");
			break;
	}

	addNextAttack();

}


function addNextAttack (attack) {

	var new_attack;

	if (attack) {
		attack_queue_time += attack.time;
		new_attack = attack;
	} else {
		attack_queue_time += next_attack.next_time;
		var new_attack = attacks[next_attack.next_sets[Math.floor(next_attack.next_sets.length * Math.random())]];
	}

	switch (new_attack.type) {
		case "arrow":
			// add arrows two attacks in advance.
			addArrowGroup(new_attack);
			break;
		default:
			// for other types, a mode switch is required instead.
			break;
	}

	next_attack = new_attack;

	var attack_info = { type: next_attack.type, time: next_attack.next_time };

	if (new_attack.type == "spear")
		attack_info.interval = new_attack.spear_interval;
	if (new_attack.type == "pike") {
		attack_info.interval = new_attack.pike_interval;
		attack_info.down = new_attack.down;
	}
	if (new_attack.type == "circlespear") {
		attack_info.interval = new_attack.spear_interval;
		attack_info.count = new_attack.spear_count;
	}
	if (new_attack.type == "swarmspear")
		attack_info.interval = new_attack.spear_interval;
	if (new_attack.buffer_time)
		attack_info.buffer_time = new_attack.buffer_time;

	attack_queue.push(attack_info);

}
