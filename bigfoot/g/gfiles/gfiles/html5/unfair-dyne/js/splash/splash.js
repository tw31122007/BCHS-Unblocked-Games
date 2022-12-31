var by_texture;
var fairdyne_texture, un_texture;
var undyne_intro_hairless_texture;

var ground_textures = Array(3);

function SplashScene() {

	this.by_sprite = new PIXI.Sprite(by_texture);
	this.by_sprite.anchor.set(0.5, 0.5);
	this.by_sprite.position.set(320, 240);
	this.by_sprite.alpha = 0;

	this.un_sprite = new PIXI.Sprite(un_texture);
	this.un_sprite.anchor.set(0, 1);
	this.un_sprite.position.set(160, -120);
	this.un_sprite.scale.set(2, 2);

	this.fairdyne_sprite = new PIXI.Sprite(fairdyne_texture);
	this.fairdyne_sprite.anchor.set(0.5, 0.5);
	this.fairdyne_sprite.position.set(320, 240);
	this.fairdyne_sprite.scale.set(2, 2);
	this.fairdyne_sprite.alpha = 0;

	this.ground_sprite1 = new PIXI.Sprite(ground_textures[0]);
	this.ground_sprite1.anchor.set(0.5, 0.5);
	this.ground_sprite1.position.set(320, 360);
	this.ground_sprite1.scale.set(2, 2);
	this.ground_sprite1.alpha = 0;

	this.ground_sprite2 = new PIXI.Sprite(ground_textures[1]);
	this.ground_sprite2.anchor.set(0.5, 0.5);
	this.ground_sprite2.position.set(320, 360);
	this.ground_sprite2.scale.set(2, 2);
	this.ground_sprite2.alpha = 0;

	this.ground_sprite3 = new PIXI.Sprite(ground_textures[2]);
	this.ground_sprite3.anchor.set(0.5, 0.5);
	this.ground_sprite3.position.set(320, 360);
	this.ground_sprite3.scale.set(2, 2);
	this.ground_sprite3.alpha = 0;

	this.undyne_sprite = new PIXI.Sprite(undyne_intro_hairless_texture);
	this.undyne_sprite.anchor.set(0.5, 0.5);
	this.undyne_sprite.position.set(320, 360);
	this.undyne_sprite.scale.set(2, 2);
	this.undyne_sprite.alpha = 0;

	this.undyne_hair_sprite = new PIXI.extras.MovieClip(undyne_hair_textures);
	this.undyne_hair_sprite.anchor.set(1, 0.5);
	this.undyne_hair_sprite.position.set(330, 360);
	this.undyne_hair_sprite.scale.set(2, 2);
	this.undyne_hair_sprite.animationSpeed = 4/30;

	this.press_start_text = new PIXI.extras.BitmapText("press z to start", { font: "15px Numbers", align: "center" });
	this.press_start_text.position.set(210, 360);
	this.press_start_text.alpha = 0;

	splash_stage.addChild(this.by_sprite);
	splash_stage.addChild(this.un_sprite);
	splash_stage.addChild(this.fairdyne_sprite);
	splash_stage.addChild(this.ground_sprite1);
	splash_stage.addChild(this.ground_sprite2);
	splash_stage.addChild(this.ground_sprite3);
	splash_stage.addChild(this.undyne_sprite);
	splash_stage.addChild(this.press_start_text);

	this.flash_g = new PIXI.Graphics();
	this.flash_g.beginFill(0xffffff);
	this.flash_g.drawRect(0, 0, 640, 480);
	this.flash_g.alpha = 0;

	splash_stage.addChild(this.flash_g);

	// scene state
	this.hits = 0;
	this.undyne_jumped = false;

	this.outro = false;
	this.outro_time = 0;

}

var zeds = [];

SplashScene.prototype.add_zed = function() {

	var press_zed_text = new PIXI.extras.BitmapText(
		"press zed not two",
		{ font: "20px Numbers", align: "center"}
	);
	press_zed_text.position.set(Math.random() * 520 - 40, Math.random() * 420 + 30);
	press_zed_text.rotation = (Math.random() * 0.5) - 0.25;
	press_zed_text.alpha = 1;
	splash_stage.addChild(press_zed_text);

	zeds.push({
		time: 1000,
		text: press_zed_text,
	})

}

SplashScene.prototype.update = function(delta_ms) {

	// animation steps

	for (var a = 0; a < zeds.length; ) {
		zeds[a].time -= delta_ms;
		zeds[a].text.alpha = zeds[a].time / 1000;
		if (zeds[a].time <= 0) {
			zeds.splice(a, 1);
		} else {
			++a;
		}
	}

	if (this.outro == true) {
		this.outro_time += delta_ms;
		splash_stage.alpha = interp_clamp(this.outro_time, 0, 1000, 1, 0);
		bgm_undyne.volume(interp_clamp(this.outro_time, 0, 1000, 0.7, 0));
		if (this.outro_time >= 1000) {
			scene.selectScene("gameplay");
		}
	}

	if (scene.scene_time < 600) { // fade "presented by" in
		this.by_sprite.alpha = interp_clamp(scene.scene_time, 0, 600, 0, 1);
	} else if (scene.scene_time < 2400) {
		this.by_sprite.alpha = 1;
	} else if (scene.scene_time < 3000) { // fade "presented by" out
		this.by_sprite.alpha = interp_clamp(scene.scene_time, 2400, 3000, 1, 0);
	} else if (scene.scene_time < 3600) { // fade "FAIRDYNE" in
		this.by_sprite.alpha = 0;
		this.fairdyne_sprite.alpha = interp_clamp(scene.scene_time, 3000, 3600, 0, 1);
	} else if (scene.scene_time < 4200) { // pause
		this.fairdyne_sprite.alpha = 1;
	} else if (scene.scene_time < 5640) {
		if (this.hits == 0) {
			this.hits = 1;
			bgm_undyne.play();
			se_attack.play();
			this.ground_sprite1.alpha = 1;
		}
		this.flash_g.alpha = interp_clamp(scene.scene_time, 4200, 4500, 1, 0);
		var shake_amount = interp_clamp(scene.scene_time, 4200, 4500, 6, 0);
		var direction = Math.random() * Math.PI * 2;
		this.fairdyne_sprite.position.set(320 + shake_amount * Math.cos(direction), 240 + shake_amount * Math.sin(direction));
		this.ground_sprite1.position.set(320 + shake_amount * Math.cos(direction), 360 + shake_amount * Math.sin(direction));
	} else if (scene.scene_time < 7080) {
		if (this.hits == 1) {
			this.hits = 2;
			this.ground_sprite1.alpha = 0;
			this.ground_sprite2.alpha = 1;
			se_attack.play();
		}
		this.flash_g.alpha = interp_clamp(scene.scene_time, 5640, 5940, 1, 0);
		var shake_amount = interp_clamp(scene.scene_time, 5640, 5940, 12, 0);
		var direction = Math.random() * Math.PI * 2;
		this.fairdyne_sprite.position.set(320 + shake_amount * Math.cos(direction), 240 + shake_amount * Math.sin(direction));
		this.ground_sprite2.position.set(320 + shake_amount * Math.cos(direction), 360 + shake_amount * Math.sin(direction));
	} else if (scene.scene_time < 8520) {
		if (this.hits == 2) {
			this.hits = 3;
			this.ground_sprite2.alpha = 0;
			this.ground_sprite3.alpha = 1;
			se_attack.play();
		}
		this.flash_g.alpha = interp_clamp(scene.scene_time, 7080, 7380, 1, 0);
		var shake_amount = interp_clamp(scene.scene_time, 7080, 7380, 24, 0);
		var direction = Math.random() * Math.PI * 2;
		this.fairdyne_sprite.position.set(320 + shake_amount * Math.cos(direction), 240 + shake_amount * Math.sin(direction));
		this.ground_sprite3.position.set(320 + shake_amount * Math.cos(direction), 360 + shake_amount * Math.sin(direction));
	} else if (scene.scene_time < 10500) {
		if (this.hits == 3) {
			this.hits = 4;
			this.ground_sprite3.alpha = 0;
			this.undyne_sprite.alpha = 1;
			se_attack.play();
		}
		this.flash_g.alpha = interp_clamp(scene.scene_time, 8520, 8820, 1, 0);
		this.undyne_sprite.position.y = 360 - 1080 * interp_clamp(scene.scene_time, 8520, 9000, 0, 1);
		this.un_sprite.position.y = -780 + 1060 * Math.pow(interp_clamp(scene.scene_time, 9000, 10500, 0, 1), 2);
	} else if (scene.scene_time < 12000) {
		if (this.undyne_jumped == false) {
			this.undyne_jumped = true;
			splash_stage.removeChild(this.undyne_sprite);
			splash_stage.addChildAt(this.undyne_sprite, 0);
			splash_stage.addChildAt(this.undyne_hair_sprite, 0);
			this.undyne_hair_sprite.play();
			document.getElementById("fairdyne").innerHTML = "Unfair Undyne";
		}
		this.un_sprite.position.y = -780 + 1060 * Math.pow(interp_clamp(scene.scene_time, 9000, 10500, 0, 1), 2);
		this.un_sprite.position.x = 140 + 20 * Math.pow(interp_clamp(scene.scene_time, 10500, 10700, 1, 0), 2);
		this.un_sprite.rotation = -0.3 * (1 - Math.pow(interp_clamp(scene.scene_time, 10500, 10900, -1, 1), 4));
		this.fairdyne_sprite.position.x = 400 - 80 * Math.pow(interp_clamp(scene.scene_time, 10500, 10700, 1, 0), 2);
		this.undyne_sprite.position.y = 160 - 400 * interp_clamp(scene.scene_time, 11400, 12000, 1, 0);
		this.undyne_hair_sprite.position.y = 60 - 400 * interp_clamp(scene.scene_time, 11400, 12000, 1, 0);
	} else {
		this.press_start_text.alpha = Math.round(Math.sin(2 * Math.PI * scene.scene_time / 1000) + 0.2);
	}

}

var splash_animation;
