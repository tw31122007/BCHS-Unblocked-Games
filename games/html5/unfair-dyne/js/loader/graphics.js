// graphics

var graphics_loader = new PIXI.loaders.Loader();

graphics_loader

	.add("arrow", "img/arrow.png")
	.add("heart", "img/heart.png")
	.add("shield", "img/shield.png")
	.add("spear", "img/spear.png")
	.add("pike", "img/pike.png")

	.add("by", "img/by.png")
	.add("fairdyne", "img/fairdyne.png")
	.add("ground1", "img/ground1.png")
	.add("ground2", "img/ground2.png")
	.add("ground3", "img/ground3.png")
	.add("speechbubble", "img/speechbubble.png")
	.add("un", "img/un.png")
	.add("undyne", "img/undyne.png")
	.add("undyne_breastplate", "img/undyne_breastplate.png")
	.add("undyne_hair1", "img/undyne_hair1.png")
	.add("undyne_hair2", "img/undyne_hair2.png")
	.add("undyne_hair3", "img/undyne_hair3.png")
	.add("undyne_hair4", "img/undyne_hair4.png")
	.add("undyne_head1", "img/undyne_head1.png")
	.add("undyne_head2", "img/undyne_head2.png")
	.add("undyne_head3", "img/undyne_head_annoyed.png")
	.add("undyne_head4", "img/undyne_head_angry.png")
	.add("undyne_intro_hairless", "img/undyne_intro_hairless.png")
	.add("undyne_leftarm", "img/undyne_leftarm.png")
	.add("undyne_legs", "img/undyne_legs.png")
	.add("undyne_rightarm", "img/undyne_rightarm.png")
	.add("undyne_skirt", "img/undyne_skirt.png")

	.on("complete", function(loader, resources) {
		process_graphics(resources);
	})

;

function process_graphics(resources) {

	arrow_texture = resources["arrow"].texture;
	spear_texture = resources["spear"].texture;
	pike_texture = resources["pike"].texture;

	heart_texture = resources["heart"].texture;
	heart_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	shield_texture = resources["shield"].texture;
	undyne_texture = resources["undyne"].texture;

	by_texture = resources["by"].texture;
	by_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	un_texture = resources["un"].texture;
	un_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	fairdyne_texture = resources["fairdyne"].texture;
	fairdyne_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	ground_textures[0] = resources["ground1"].texture;
	ground_textures[1] = resources["ground2"].texture;
	ground_textures[2] = resources["ground3"].texture;
	for (var a = 0; a < ground_textures.length; ++a) {
		ground_textures[a].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	}

	speech_bubble_texture = resources["speechbubble"].texture;
	speech_bubble_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	undyne_hair_textures[0] = resources["undyne_hair1"].texture;
	undyne_hair_textures[1] = resources["undyne_hair2"].texture;
	undyne_hair_textures[2] = resources["undyne_hair3"].texture;
	undyne_hair_textures[3] = resources["undyne_hair4"].texture;
	for (var a = 0; a < undyne_hair_textures.length; ++a) {
		undyne_hair_textures[a].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	}

	undyne_head_textures[0] = resources["undyne_head1"].texture;
	undyne_head_textures[1] = resources["undyne_head2"].texture;
	undyne_head_textures[2] = resources["undyne_head3"].texture;
	undyne_head_textures[3] = resources["undyne_head4"].texture;
	for (var a = 0; a < undyne_head_textures.length; ++a) {
		undyne_head_textures[a].baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	}

	undyne_breastplate_texture = resources["undyne_breastplate"].texture;
	undyne_breastplate_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	undyne_leftarm_texture = resources["undyne_leftarm"].texture;
	undyne_leftarm_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	undyne_legs_texture = resources["undyne_legs"].texture;
	undyne_legs_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	undyne_rightarm_texture = resources["undyne_rightarm"].texture;
	undyne_rightarm_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	undyne_skirt_texture = resources["undyne_skirt"].texture;
	undyne_skirt_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	undyne_intro_hairless_texture = resources["undyne_intro_hairless"].texture;
	undyne_intro_hairless_texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

	markAssetLoaded("graphics");

}
