var spear_texture;

var delta_rot = Math.PI * 3;
var spear_total_time = 4000;

function Spear (props) {

	this.active_time = 0;

	this.shot = false;

	this.appear_time = props.appear_time || 1000;
	this.initial_position = props.initial_position || { x: 320, y: 320 };
	this.direction = props.direction || { x: 0, y: -1 }; // normalized vector representing

	this.pos_x = this.initial_position.x;
	this.pos_y = this.initial_position.y;

	this.dest_rotation = Math.atan2(this.direction.y, this.direction.x)

	this.sprite = new PIXI.Sprite(spear_texture);
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.rotation = this.dest_rotation + delta_rot;
	this.sprite.alpha = 0;

	gameplay_stage.addChild(this.sprite);

}

Spear.prototype.update = function(delta_ms) {

	this.active_time += delta_ms;

	if (this.active_time < this.appear_time) {
		this.pos_x = this.initial_position.x;
		this.pos_y = this.initial_position.y;
		this.sprite.rotation = this.dest_rotation + delta_rot *
			Math.pow(interp_clamp(this.active_time, 0, this.appear_time, 1, 0), 2);
		this.sprite.alpha = this.active_time / this.appear_time;
	} else {
		this.sprite.alpha = 1;
		this.pos_x += this.direction.x * SPEAR_SPEED * delta_ms;
		this.pos_y += this.direction.y * SPEAR_SPEED * delta_ms;
	}

	// the sound effect is delayed by about 0.1s, so we do this to line them up.
	if (this.active_time >= this.appear_time && this.shot == false) {
		this.shot = true;
		se_spear_shoot.play();
	}

	this.sprite.position.set(this.pos_x, this.pos_y);

	if (this.collidesWithHeart()) {
		heart.takeDamage(1);
		this.removed = true;
	}

	if (this.active_time > spear_total_time) this.removed = true;

}


Spear.prototype.collidesWithHeart = function() {
	/*
		check for collisions along the shaft of the spear
	*/
	var displacement = { x: heart.pos_x - this.pos_x, y: heart.pos_y - this.pos_y };
	var normal_dir = { x: this.direction.y, y: -this.direction.x };
	// get the decomposition along "direction"
	var along = dot_product(displacement, this.direction);
	var dist = dot_product(displacement, normal_dir);

	if (Math.abs(along) < 23 && Math.abs(dist) < 8) return true;

	/*
		then, check for collisions at the tip
	*/
	var tip = { x: this.pos_x + this.direction.x * 23, y: this.pos_y + this.direction.y * 23};
	var tip_dist = norm( heart.pos_x - tip.x, heart.pos_y - tip.y );

	if (tip_dist < HEART_SIZE / 2) return true;

	return false;

}

var spears = [];

function addNewSpear() {

	se_spear_appear.play();

	// center of play grid: 320, 280
	var spawn_angle = Math.random() * Math.PI * 2;
	var position = { x: 320 + 160 * Math.cos(spawn_angle), y: 280 + 160 * Math.sin(spawn_angle) };

	var displacement = { x: heart.pos_x - position.x, y: heart.pos_y - position.y };
	var distance = norm(displacement.x, displacement.y);
	var direction = scalar_mult(displacement, 1 / distance);

	spears.push(new Spear({ initial_position: position, direction: direction }));

}
