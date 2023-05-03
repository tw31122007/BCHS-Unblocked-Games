var swarm_initial_distance = 120;
var swarm_appear_time = 400;
var swarm_travel_time = 400;
var swarm_disappear_time = 50;

function SwarmSpear (props) {

	this.active_time = 0;

	this.shot = false;

	this.anchor = props.anchor || { x: 320, y: 320 };
	this.initial_angle = props.initial_angle || 0;

	this.direction = this.initial_angle;
	
    this.total_time = swarm_appear_time + swarm_travel_time + swarm_disappear_time;

	this.pos_x = this.anchor.x + swarm_initial_distance * Math.cos(this.initial_angle);
	this.pos_y = this.anchor.y + swarm_initial_distance * Math.sin(this.initial_angle);

	this.sprite = new PIXI.Sprite(spear_texture);
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.rotation = this.initial_angle;
	this.sprite.alpha = 0;

	gameplay_stage.addChild(this.sprite);

}

SwarmSpear.prototype.update = function(delta_ms) {

	this.active_time += delta_ms;

    var distance;

	if (this.active_time < swarm_appear_time) {
        this.sprite.alpha = this.active_time / swarm_appear_time;
        distance = swarm_initial_distance;
        this.sprite.rotation = this.direction + Math.PI - Math.PI * Math.pow((swarm_appear_time - this.active_time) / swarm_appear_time, 2);
	} else if (this.active_time < this.total_time - swarm_disappear_time) {
        this.sprite.alpha = 1;
        distance = swarm_initial_distance - swarm_initial_distance * (this.active_time - swarm_appear_time) / (swarm_travel_time);
        this.sprite.rotation = this.direction + Math.PI;
	} else {
		this.sprite.alpha = (this.total_time - this.active_time) / swarm_disappear_time;
        distance = swarm_initial_distance - swarm_initial_distance * (this.active_time - swarm_appear_time) / (swarm_travel_time);
        this.sprite.rotation = this.direction + Math.PI;
	}

	this.pos_x = this.anchor.x + distance * Math.cos(this.direction);
	this.pos_y = this.anchor.y + distance * Math.sin(this.direction);

	this.sprite.position.set(this.pos_x, this.pos_y);

	if (this.collidesWithHeart()) {
		heart.takeDamage(1);
		this.removed = true;
	}

	if (this.active_time > this.total_time) this.removed = true;

}


SwarmSpear.prototype.collidesWithHeart = function() {
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

var swarm_spears = [];

function addNewSwarmSpear(number, interval, initial_angle) {
	for (var a = 0; a < number; ++a) {
		swarm_spears.push(new SwarmSpear({
			anchor: { x: heart.pos_x, y: heart.pos_y },
            initial_angle: initial_angle + (Math.PI * 2) * a / number,
            interval: interval
		}));
	}

}
