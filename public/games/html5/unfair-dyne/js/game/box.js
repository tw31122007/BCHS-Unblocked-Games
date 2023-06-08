function Box() {

	this.thickness = 4;

	this.left = 16;
	this.right = 624;
	this.top = 240;
	this.bottom = 420;

	this.dest_left = 16;
	this.dest_right = 624;
	this.dest_top = 240;
	this.dest_bottom = 420;

	this.graphics = new PIXI.Graphics();
	gameplay_stage.addChild(this.graphics);

}

Box.prototype.update = function(ms) {
	this.adjustBounds(ms);
}

Box.prototype.adjustBounds = function(ms) {

	if (this.left < this.dest_left)
		this.left = Math.min(this.dest_left, this.left + BOX_ADJUST_SPEED * ms);

	if (this.left > this.dest_left)
		this.left = Math.max(this.dest_left, this.left - BOX_ADJUST_SPEED * ms);

	if (this.right < this.dest_right)
		this.right = Math.min(this.dest_right, this.right + BOX_ADJUST_SPEED * ms);

	if (this.right > this.dest_right)
		this.right = Math.max(this.dest_right, this.right - BOX_ADJUST_SPEED * ms);

	if (this.top < this.dest_top)
		this.top = Math.min(this.dest_top, this.top + BOX_ADJUST_SPEED * ms);

	if (this.top > this.dest_top)
		this.top = Math.max(this.dest_top, this.top - BOX_ADJUST_SPEED * ms);

	if (this.bottom < this.dest_bottom)
		this.bottom = Math.min(this.dest_bottom, this.bottom + BOX_ADJUST_SPEED * ms);

	if (this.bottom > this.dest_bottom)
		this.bottom = Math.max(this.dest_bottom, this.bottom - BOX_ADJUST_SPEED * ms);

	if (heart.colour == "red") {
		if (heart.pos_x < this.left + HEART_SIZE / 2)
			heart.setPosition(this.left + HEART_SIZE / 2, null);

		if (heart.pos_x > this.right - HEART_SIZE / 2)
			heart.setPosition(this.right - HEART_SIZE / 2, null);

		if (heart.pos_y < this.top + HEART_SIZE / 2)
			heart.setPosition(null, this.top + HEART_SIZE / 2);

		if (heart.pos_y > this.bottom - HEART_SIZE / 2)
			heart.setPosition(null, this.bottom - HEART_SIZE / 2);
	}

};


Box.prototype.render = function() {

	// draw the rectangle?
	this.graphics.clear();
	this.graphics.beginFill(0x000000);
	this.graphics.lineStyle(this.thickness, 0xFFFFFF);
	this.graphics.drawRect(
		(this.left - (this.thickness / 2)),
		(this.top - (this.thickness / 2)),
		(this.right - this.left + (this.thickness)),
		(this.bottom - this.top + (this.thickness))
	);
	this.graphics.endFill();

}


var box;
