function Pike (props) {

	this.active_time = 0;

	this.shot = false;

	this.appear_time = props.appear_time || 400;
	this.initial_position = props.initial_position || 1;
	this.direction = props.direction || "up";

	var position = getPikePosition(this.initial_position, this.direction);

	this.pos_x = position.x;
	this.pos_y = position.y;
	this.position = position;
	this.from_y = this.direction == "down" ? this.pos_y - 20 : this.pos_y + 20;
	this.dest_y = this.direction == "down" ? this.pos_y + 60 : this.pos_y - 60;

	this.sprite = new PIXI.Sprite(pike_texture);
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.rotation = this.direction == "down" ? Math.PI : 0;
	this.sprite.alpha = 0;

	gameplay_stage.addChild(this.sprite);

}

function getPikePosition(pos, dir) {
	return { x: 278 + pos * 21, y: (dir == "up" ? 380 : 260 )}
}


Pike.prototype.update = function(delta_ms) {

	this.active_time += delta_ms;

	if (this.active_time < this.appear_time) {
		this.pos_x = this.position.x;
		this.pos_y = interp_clamp(this.active_time, 0, 300, this.from_y, this.position.y);
		this.sprite.alpha = this.active_time / this.appear_time;
	} else {
		this.pos_y = interp_clamp(this.active_time, this.appear_time, this.appear_time + 100, this.position.y, this.dest_y);
		this.sprite.alpha = interp_clamp(this.active_time, this.appear_time + 100, this.appear_time + 300, 1, 0);
	}
	this.sprite.position.set(this.pos_x, this.pos_y);

	// the sound effect is delayed by about 0.1s, so we do this to line them up.
	if (this.active_time >= this.appear_time && this.shot == false) {
		this.shot = true;
		se_pike_shoot.play();
	}

	this.sprite.position.set(this.pos_x, this.pos_y);

	if (this.collidesWithHeart()) {
		heart.takeDamage(1);
		this.removed = true;
	}

	if (this.active_time > spear_total_time) this.removed = true;

}

Pike.prototype.collidesWithHeart = function() {
	return Math.abs(heart.pos_x - this.pos_x) < HEART_SIZE / 2 &&
		Math.abs(heart.pos_y - this.pos_y) < 40 &&
		this.shot && this.active_time < this.appear_time + 150;
}

var pikes = [];
var last_up_pike = 0;
var last_down_pike = 0;

function addNewPike() {
	se_spear_appear.play();

	var up_pike, down_pike;

	do {

		do {
			up_pike = Math.floor(Math.random() * 3) + 1
		} while (up_pike == last_up_pike);

		do {
			down_pike = Math.floor(Math.random() * 3) + 1
		} while (down_pike == last_down_pike);

	} while (forcedToMoveTwoLanes(last_up_pike, last_down_pike, up_pike, down_pike));

	// prevent situations where the heart is forced to move from the left column to the right column

	last_up_pike = up_pike;
	last_down_pike = down_pike;

	pikes.push(new Pike({ appear_time: pike_interval * 2, initial_position: last_up_pike, direction: "up" }));
	if (attack_queue[0].down)
		pikes.push(new Pike({ appear_time: pike_interval * 2, initial_position: last_down_pike, direction: "down" }));
}


function forcedToMoveTwoLanes(last_up, last_down, up, down) {

	if (last_up != last_down && last_up != 1 && last_down != 1 &&
		up != down && up != 3 && down != 3) {
		return true;
	} else if (last_up != last_down && last_up != 3 && last_down != 3 &&
		up != down && up != 1 && down != 1) {
		return true;
	}
	return false;

}
