var undyne;

var undyne_texture;
var undyne_head_textures = Array(4);
var undyne_breastplate_texture;
var undyne_skirt_texture;
var undyne_legs_texture;
var undyne_rightarm_texture;
var undyne_leftarm_texture;
var undyne_hair_textures = Array(4);

var speech_bubble_texture;
var speech_bubble_text;

function Undyne() {

	this.animation_state = "breathing";
	this.animation_time = 0;

	this.sbtext = null;
	this.text_state = "none";
	this.text_queue = [];
	this.text_queue_callback = null;
	this.text_chars = 0;
	this.text_se = se_undyne;
	this.cps = 25;

	this.sprite = new PIXI.Container();
	this.sprite.alpha = 1;

	this.hair_sprite = new PIXI.extras.MovieClip(undyne_hair_textures);
	this.hair_sprite.anchor.set(1, 0.5);
	this.hair_sprite.scale.set(2, 2);
	this.hair_sprite.position.set(310, 40);
	this.hair_sprite.animationSpeed = 4/30;

	this.head_sprite = new PIXI.Sprite(undyne_head_textures[1]);
	this.head_sprite.anchor.set(0.5, 0.5);
	this.head_sprite.scale.set(2, 2);
	this.head_sprite.position.set(318, 48);

	this.body_sprite = new PIXI.Sprite(undyne_breastplate_texture);
	this.body_sprite.anchor.set(0.5, 0.5);
	this.body_sprite.scale.set(2, 2);
	this.body_sprite.position.set(324, 108);

	this.rightarm_sprite = new PIXI.Sprite(undyne_rightarm_texture);
	this.rightarm_sprite.anchor.set(1, 0);
	this.rightarm_sprite.scale.set(2, 2);
	this.rightarm_sprite.position.set(308, 98);

	this.leftarm_sprite = new PIXI.Sprite(undyne_leftarm_texture);
	this.leftarm_sprite.anchor.set(0.5, 0.5);
	this.leftarm_sprite.scale.set(2, 2);
	this.leftarm_sprite.position.set(369, 134);

	this.skirt_sprite = new PIXI.Sprite(undyne_skirt_texture);
	this.skirt_sprite.anchor.set(0.5, 0.5);
	this.skirt_sprite.scale.set(2, 2);
	this.skirt_sprite.position.set(320, 166);

	this.legs_sprite = new PIXI.Sprite(undyne_legs_texture);
	this.legs_sprite.anchor.set(0.5, 0.5);
	this.legs_sprite.scale.set(2, 2);
	this.legs_sprite.position.set(324, 210);

	this.speech_bubble = new PIXI.Sprite(speech_bubble_texture);
	this.speech_bubble.anchor.set(0, 0.5);
	this.speech_bubble.position.set(400, 60);
	// this.speech_bubble.visible = false;

	this.speech_bubble_text = new PIXI.extras.BitmapText(
		"",
		{ font: "12px SpeechBubble", align: "left" }
	);
	this.speech_bubble_text.maxWidth = 180;
	this.speech_bubble_text.position.set(442, 24);
	this.speech_bubble_text.tint = 0;
	// this.speech_bubble_text.visible = false;

	this.opacity_g = new PIXI.Graphics();
	this.opacity_g.alpha = 0;
	this.opacity_g.beginFill(0x000000);
	this.opacity_g.drawRect(0, 0, 640, 480);
	this.opacity_g.endFill();

	gameplay_stage.addChild(this.hair_sprite);
	gameplay_stage.addChild(this.rightarm_sprite);
	gameplay_stage.addChild(this.leftarm_sprite);
	gameplay_stage.addChild(this.legs_sprite);
	gameplay_stage.addChild(this.skirt_sprite);
	gameplay_stage.addChild(this.body_sprite);
	gameplay_stage.addChild(this.head_sprite);
	gameplay_stage.addChild(this.speech_bubble);
	gameplay_stage.addChild(this.speech_bubble_text);
	gameplay_stage.addChild(this.opacity_g);

	this.hair_sprite.play();

	gameplay_stage.addChild(this.sprite);

}

Undyne.prototype.queue_text = function(text_queue, callback) {

	this.text_queue = this.text_queue.concat(text_queue);
	this.text_queue_callback = callback;
	this.text_state = "talking";
	this.speech_bubble.visible = true;
	this.speech_bubble_text.visible = true;
	this.selectNextText();

}

Undyne.prototype.selectNextText = function() {

	if (this.text_queue.length > 0) {
		this.sbtext = this.text_queue.shift();
		this.text_chars = 0;
		this.text_state = "talking";
		if (this.sbtext.se) {
			this.text_se = this.sbtext.se;
		} else {
			this.text_se = se_undyne;
		}
		if (this.sbtext.face) {
			this.head_sprite.texture = undyne_head_textures[this.sbtext.face];
		} else {
			this.head_sprite.texture = undyne_head_textures[1];
		}
	} else {
		this.head_sprite.texture = undyne_head_textures[1];
		this.sbtext = null;
		this.speech_bubble.visible = false;
		this.speech_bubble_text.visible = false;
		this.text_state = "none";
		this.text_queue_callback();
	}

}

Undyne.prototype.advanceTextChars = function(text_chars) {

	if (!this.sbtext) return;

	var char = this.sbtext.text[Math.floor(text_chars)];
	if (!(char == " " || char == "\n")) {
		this.text_se.play();
	}
	this.speech_bubble_text.text = this.sbtext.text.substr(0, Math.floor(text_chars));

}

Undyne.prototype.advanceTextA = function() {

	if (this.text_state == "waiting") {
		this.selectNextText();
	}

}

Undyne.prototype.advanceTextB = function() {

	if (this.text_state == "talking") {
		this.speech_bubble_text.text = this.sbtext.text;
		this.text_state = "waiting";
	}

}

Undyne.prototype.swing_arm = function() {

	if (this.animation_state == "swinging_arm") return;

	this.animation_state = "swinging_arm";
	this.body_sprite.position.y = 108;
	this.head_sprite.position.y = 48;
	this.skirt_sprite.position.y = 166;
	this.rightarm_sprite.position.y = 98;
	this.rightarm_sprite.position.x = 308;
	this.leftarm_sprite.position.y = 134;
	this.leftarm_sprite.position.x = 369;
	this.animation_time = 0;

	gameplay_stage.removeChild(this.rightarm_sprite);
	gameplay_stage.addChild(this.rightarm_sprite);

}

Undyne.prototype.update = function(delta_ms) {

	this.animation_time += delta_ms;

	if (this.text_state == "talking") {
		var new_text_chars = this.text_chars + this.cps * delta_ms / 1000;
		if (Math.floor(new_text_chars) > this.text_chars) {
			this.advanceTextChars(new_text_chars);
		}
		if (this.text_chars >= this.sbtext.text.length) {
			this.text_state = "waiting";
		}
		this.text_chars = new_text_chars;
	}

	if (this.animation_state == "breathing") {

		this.body_sprite.position.y = 108 + 2 * Math.sin(this.animation_time / 1200 * Math.PI * 2);
		this.head_sprite.position.y = 48 + 1 * Math.sin(this.animation_time / 1200 * Math.PI * 2);
		this.skirt_sprite.position.y = 166 + 1 * Math.sin(this.animation_time / 1200 * Math.PI * 2);

		this.rightarm_sprite.position.y = 98 + 4 * Math.sin(this.animation_time / 1200 * Math.PI * 2);
		this.rightarm_sprite.position.x = 308 + 2 * Math.sin(this.animation_time / 1200 * Math.PI * 2);

		this.leftarm_sprite.position.y = 134 + 4 * Math.sin(this.animation_time / 1200 * Math.PI * 2);
		this.leftarm_sprite.position.x = 369 + 2 * Math.sin(this.animation_time / 600 * Math.PI * 2);

	} else if (this.animation_state == "swinging_arm") {

		if (this.animation_time < 300){
			this.rightarm_sprite.rotation = (40 - 40 * Math.pow(interp_clamp(this.animation_time, 0, 200, 1, 0), 4)) * Math.PI / 180;
		} else if (this.animation_time < 600) {
			this.rightarm_sprite.rotation = (-60 + 100 * Math.pow(interp_clamp(this.animation_time, 300, 400, 1, 0), 4)) * Math.PI / 180;
		} else if (this.animation_time < 750) {
			this.rightarm_sprite.rotation = interp_clamp(this.animation_time, 600, 650, -60 * Math.PI / 180, 0);
		} else {
			gameplay_stage.removeChild(this.rightarm_sprite);
			gameplay_stage.addChildAt(this.rightarm_sprite, 0);
			this.animation_state = "breathing";
			this.animation_time = 0;
		}

	}


}
