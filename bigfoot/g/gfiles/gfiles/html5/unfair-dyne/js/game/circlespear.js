var circle_spear_total_time = 1650;

function CircleSpear (props) {

	this.active_time = 0;

	this.shot = false;

	this.anchor = props.anchor || { x: 320, y: 320 };
	this.initial_angle = props.initial_angle || 0;

	this.direction = this.initial_angle;

	this.pos_x = this.anchor.x + 160 * Math.cos(this.initial_angle);
	this.pos_y = this.anchor.y + 160 * Math.sin(this.initial_angle);

	this.sprite = new PIXI.Sprite(spear_texture);
	this.sprite.anchor.set(1, 0.5);
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.rotation = this.initial_angle;
	this.sprite.alpha = 0;

	gameplay_stage.addChild(this.sprite);

}

CircleSpear.prototype.update = function(delta_ms) {

	this.active_time += delta_ms;

	if (this.active_time < 300) {
		this.sprite.alpha = this.active_time / 300;
	} else if (this.active_time < circle_spear_total_time - 150) {
		this.sprite.alpha = 1;
	} else {
		this.sprite.alpha = (circle_spear_total_time - this.active_time) / 150;
	}

	var progress = (circle_spear_total_time - this.active_time) / circle_spear_total_time;

	var distance = 160 - 160 * this.active_time / (circle_spear_total_time - 150);

	this.direction = this.initial_angle + (progress * progress) * Math.PI;

	this.pos_x = this.anchor.x + distance * Math.cos(this.direction);
	this.pos_y = this.anchor.y + distance * Math.sin(this.direction);

	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.rotation = this.direction + Math.PI;

	if (this.collidesWithHeart()) {
		heart.takeDamage(1);
		this.removed = true;
	}

	if (this.active_time > circle_spear_total_time) this.removed = true;

}


CircleSpear.prototype.collidesWithHeart = function() {
	/*
		check for collisions along the shaft of the spear
	*/
	var displacement = { x: heart.pos_x - this.pos_x, y: heart.pos_y - this.pos_y };
	var normal_dir = { x: Math.sin(this.direction), y: -Math.cos(this.direction) };
	// get the decomposition along "direction"
	var along = dot_product(displacement, { x: Math.cos(this.direction), y: Math.sin(this.direction) });
	var dist = dot_product(displacement, normal_dir);

	// Normally it should be 46, but let's be more lenient about the rear of the arrows here
	if (along > 0 && along < 23 && Math.abs(dist) < 8) return true;

	/*
		then, check for collisions at the tip
	*/
	var tip_dist = norm( heart.pos_x - this.pos_x, heart.pos_y - this.pos_y );

	if (tip_dist < HEART_SIZE / 2) return true;

	return false;

}

var circle_spears = [];

function addNewCircleSpear(number) {

	var initial_angle = Math.random() * Math.PI * 2;

	for (var a = 0; a < number; ++a) {
		circle_spears.push(new CircleSpear({
			anchor: { x: heart.pos_x, y: heart.pos_y },
			initial_angle: initial_angle + (Math.PI * 2) * a / number,
		}));
	}

}
