var arrow_texture;

const turntype_rotation = [0, 1, 2, 2, 3];
const turntype_tints = [0x2fd0ff, 0x7aff2c, 0xffdf23, 0xffdf23, 0xff8c48];

function Arrow (props) {

	this.direction = props.direction || 0;
	// 0 = up, 1 = right, 2 = down, 3 = left

	this.turntype = props.turntype || 0;
	// 0 = straight, 1 = turn right, 2 = u-turn right, 3 = u-turn left, 4 = turn left
	if (this.turntype == -1) {
		var rand_dir = Math.random() * 4;
		this.turntype = Math.floor(rand_dir < 2.5 ? rand_dir : rand_dir + 1);
	}
	if (this.turntype == -2) {
		var rand_dir = Math.random() * 3;
		this.turntype = Math.floor(rand_dir < 2 ? rand_dir : 4);
	}
	// -1 = random, -2 = random non-half

	this.target_time = props.target_time || 0;
	// time when the shield destroys it.

	this.speed = props.speed || 0;
	// speed in px/s at which the arrows head toward the heart.

	this.colour = props.colour || "blue";
	// colour of the arrow
	/*
		Arrow colours
			blue: normal. Worth 1 block point.
			yellow: turns. Worth 2 block points.
	*/

	// setup sprites
	this.sprite = new PIXI.Sprite(arrow_texture);
	this.sprite.anchor.x = 0.9;
	this.sprite.anchor.y = 0.5;

	this.sprite.position.x = -200;
	this.sprite.position.y = -200;

	this.sprite.rotation = Math.PI / 2 * (this.direction + turntype_rotation[this.turntype] + 2);
	this.sprite.tint = turntype_tints[this.turntype];

	if (attack_queue[0].type != "arrow" && attack_queue[0].type != "null") {
		this.sprite.visible = false;
	}

	gameplay_stage.addChild(this.sprite);

}

Arrow.prototype.update = function (delta_ms) {

	this.target_time -= delta_ms;

	if (this.target_time * this.speed < -SHIELD_DISTANCE + 8) {
		// arrow hit the heart
		heart.takeDamage(1);
		this.removed = true;
	} else if (this.target_time <= 0) {
		// arrow hit the shield
		if (this.direction % 4 == (heart.shield_dir + 4 - turntype_rotation[this.turntype]) % 4) {
			se_arrow_ding.play();
			this.removed = true;
		}
	}

	this.updatePosition();

}



Arrow.prototype.updatePosition = function () {

	var delta_x = 0;
	var delta_y = 0;

	var distance = this.target_time * this.speed + SHIELD_DISTANCE;
	var rotation = 0;

	if (this.turntype == 0) {
		// do nothing, rotation is 0
	} else if (this.turntype == 1) {
		rotation = interp_clamp(distance, 160, 80, 0, Math.PI / 2	);
	} else if (this.turntype == 2) {
		rotation = interp_clamp(distance, 160, 80, 0, Math.PI	);
	} else if (this.turntype == 3) {
		rotation = interp_clamp(distance, 160, 80, 0, - Math.PI );
	} else if (this.turntype == 4) {
		rotation = interp_clamp(distance, 160, 80, 0, - Math.PI / 2);
	}

	switch(this.direction){
		case 4:
			delta_x += distance * Math.cos(rotation);
			delta_y += distance * Math.sin(rotation); break;
		case 1:
			delta_y += distance * Math.cos(rotation);
			delta_x -= distance * Math.sin(rotation); break;
		case 2:
			delta_x -= distance * Math.cos(rotation);
			delta_y -= distance * Math.sin(rotation); break;
		case 3:
			delta_y -= distance * Math.cos(rotation);
			delta_x += distance * Math.sin(rotation); break;
	}

	// update position
	this.sprite.position.x = (320 + delta_x);
	this.sprite.position.y = (240 + delta_y);

}

var arrows = [];

function addArrowGroup (arrow_group) {

	// loads the _next_ arrow group when the current one comes into play.

	var offset_time = attack_queue[0].time;

	var rand_dir = Math.floor(Math.random() * 4);

	var last_direction = 0;

	for (var a = 0; a < arrow_group.arrows.length; ++a) {

		var ar = arrow_group.arrows[a];
		var direction = ar.direction;

		if (direction == "R") { // random
			direction = 1 + Math.floor(Math.random() * 4);
		} else if (direction == "D") { // random that's _not_ the next one
			var non = last_direction;
			do {
				direction = 1 + Math.floor(Math.random() * 4);
			} while (direction == non);
		} else if (direction[0] == "+") { // relative to last one
			var diff = parseInt(direction[1]);
			direction = (last_direction + 3 + diff) % 4 + 1;
		} else if (direction[0] == "-") { // relative to last one
			var diff = 4 - parseInt(direction[1]);
			direction = (last_direction + 3 + diff) % 4 + 1;
		} else if (direction[0] == "$") { // fixed; isn't affected by global random
			direction = parseInt(direction[1]);
		} else if (direction[0] == "N") { // random that's _not_ the specified one
			var non = parseInt(direction[1]);
			do {
				direction = 1 + Math.floor(Math.random() * 4);
			} while (direction == non);
		} else if (typeof direction === "string") {
			direction = (rand_dir + 3 + parseInt(direction)) % 4 + 1;
		}

		last_direction = direction;

		var time = offset_time + ar.target_time;

		arrows.push(new Arrow({
			target_time: time,
			direction: direction,
			turntype: ar.turntype,
			speed: ar.speed,
		}));

	}

}
