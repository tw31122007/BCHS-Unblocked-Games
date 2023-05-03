var heart_texture;
var shield_texture;
var hp_text;

var heart_colours = {
	"red": 0xff0000,
	"green": 0x00ff00,
}

function Heart() {

	this.maxhp = 4; // always starts with 4 HP
	this.hp = this.maxhp;
	this.invincibility = 0;
	this.invincibility_increment = 1000;

	/* rendering info */

	// position relative to the BOX
	// counting from top-left corner

	this.pos_x = 320;
	this.pos_y = 240;

	// rel_pos_x is used in dual dodge+block mode. Don't worry for it for now.
	this.rel_pos_x = 320;
	this.rel_pos_y = 240;

	this.colour = "green";
	this.shield_dir = 3;

	this.abs_shield_dir = 3;
	this.target_rotation = Math.PI * 2;

	this.sprite = new PIXI.Sprite(heart_texture);
	this.sprite.anchor.set(0.5, 0.5);
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.sprite.tint = heart_colours[this.colour];
	this.sprite.visible = false;

	this.shield_sprite = new PIXI.Sprite(shield_texture);
	this.shield_sprite.anchor.set(0.5, 1.4);
	this.shield_sprite.position.set(this.pos_x, this.pos_y);
	this.shield_sprite.tint = 0xcdcdcd;
	this.shield_sprite.rotation = Math.PI / 2 * (1 + this.shield_dir);
	this.shield_sprite.visible = false;

	this.graphics = new PIXI.Graphics();
	gameplay_stage.addChild(this.graphics);

	gameplay_stage.addChild(this.sprite);
	gameplay_stage.addChild(this.shield_sprite);

	hp_text.text = _.padStart(this.hp, 2, "0") + " / " + _.padStart(this.maxhp, 2, "0");

}

Heart.prototype.setMaxHP = function(maxhp) {

	this.maxhp = maxhp;
	this.hp = maxhp;

	hp_text.text = _.padStart(this.hp, 2, "0") + " / " + _.padStart(this.maxhp, 2, "0");

}


Heart.prototype.update = function(delta_ms) {

	this.invincibility = Math.max(0, this.invincibility - delta_ms);
	this.sprite.alpha = Math.cos(Math.PI * 2 * this.invincibility / 250) * 0.5 + 0.5;

	this.shield_sprite.rotation = 0.6 * this.shield_sprite.rotation + 0.4 * this.target_rotation;

	if (gamestate.state == "playing") {
		if (this.colour == "green") this.recenter(delta_ms);
		if (this.colour == "red") this.move(delta_ms);
	}

}


Heart.prototype.move = function(delta_ms) {

	var speed = MOVEMENT_SPEED;
	if (isKeyDown("B")) speed /= 2;

	var d = { x: 0, y: 0 };

	if (key_is_down["left"])
		d.x = - speed * delta_ms;
	if (key_is_down["right"])
		d.x = + speed * delta_ms;
	if (key_is_down["up"])
		d.y = - speed * delta_ms;
	if (key_is_down["down"])
		d.y = + speed * delta_ms;

	var f = vnorm(d) == 0 ? d : scalar_mult(d, speed * delta_ms / vnorm(d));

	this.pos_x = clamp(this.pos_x + f.x, box.left + HEART_SIZE / 2, box.right - HEART_SIZE / 2);
	this.pos_y = clamp(this.pos_y + f.y, box.top + HEART_SIZE / 2, box.bottom - HEART_SIZE / 2);

	this.setSpritePosition();

}



Heart.prototype.recenter = function(delta_ms) {

	if (this.pos_x < 320) this.pos_x = Math.min(320, this.pos_x + BOX_ADJUST_SPEED * delta_ms);
	if (this.pos_x > 320) this.pos_x = Math.max(320, this.pos_x - BOX_ADJUST_SPEED * delta_ms);

	if (this.pos_y < 240) this.pos_y = Math.min(240, this.pos_y + BOX_ADJUST_SPEED * delta_ms);
	if (this.pos_y > 240) this.pos_y = Math.max(240, this.pos_y - BOX_ADJUST_SPEED * delta_ms);

	this.setSpritePosition();

}



Heart.prototype.setPosition = function(x, y) {
	if (x != null) {
		this.pos_x = x;
	}
	if (y != null) {
		this.pos_y = y;
	}
	this.setSpritePosition();
}


Heart.prototype.setSpritePosition = function() {
	this.sprite.position.set(this.pos_x, this.pos_y);
	this.shield_sprite.position.set(this.pos_x, this.pos_y);
}


Heart.prototype.setColour = function(colour) {

	this.colour = colour;
	this.sprite.tint = heart_colours[colour];

	switch(colour) {
		case "red":
			this.shield_sprite.visible = false; break;
		case "green":
			this.shield_sprite.visible = true; break;
	}

}


Heart.prototype.setShieldDir = function(dir) {
	// set target rotation to the one with the least distance.
	var new_dir = dir;

	if (new_dir < this.shield_dir) new_dir += 4;

	if (new_dir - this.shield_dir <= 2) this.abs_shield_dir += new_dir - this.shield_dir;
	else this.abs_shield_dir += new_dir - 4 - this.shield_dir;

	this.shield_dir = dir;
	this.target_rotation = Math.PI / 2 * (1 + this.abs_shield_dir);
}


Heart.prototype.takeDamage = function(damage) {

	if (this.invincibility > 0) return;

	this.invincibility = this.invincibility_increment;

	se_damage.play();
	this.hp = Math.max(0, this.hp - damage);
	if (this.hp == 0) {
		gamestate.endGame();
	}

	hp_text.text = _.padStart(this.hp, 2, "0") + " / " + _.padStart(this.maxhp, 2, "0");

}


Heart.prototype.render = function() {

	// draw the rectangle?
	this.graphics.clear();
	this.graphics.beginFill(0xff0000);
	this.graphics.lineStyle(0, 0xFFFFFF);
	this.graphics.drawRect(262, 447, 28, 21);
	this.graphics.beginFill(0xffff00);
	this.graphics.drawRect(262, 447, this.hp * 28 / this.maxhp, 21);
	this.graphics.endFill();

}

var heart;
