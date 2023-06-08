var sounds_loaded = {
	10: false,
	11: false,
	12: false,
	20: false,
	101: false,
	102: false,
	111: false,
	112: false,
	113: false,
	114: false,
	115: false,
	116: false,
	120: false,
	121: false,
	141: false,
}

// sounds that need to load before starting the game

function reg_sound(n) {
	return function() {
		sounds_loaded[n] = true;
		for (var i in sounds_loaded) {
			if (sounds_loaded[i] == false) return;
		}
		markAssetLoaded("sounds");
	}
}

// define sound names here. Maybe make a manifest for them later.

var bgm_undyne = new Howl({
	onload: reg_sound(10),
	src: ["audio/bgm/mus_undyne.ogg", "audio/bgm/mus_undyne.mp3"],
	loop: true,
	volume: 0.7,
});

var bgm_undyne1 = new Howl({
	onload: reg_sound(11),
	src: ["audio/bgm/mus_undyneboss.ogg", "audio/bgm/mus_undyneboss.mp3"],
	loop: true,
	volume: 0.7,
});

var bgm_undyne2 = new Howl({
	onload: reg_sound(12),
	src: ["audio/bgm/mus_x_undyne.ogg", "audio/bgm/mus_x_undyne.mp3"],
	loop: true,
	volume: 0.7,
});


var bgm_aprilfools = new Howl({
	onload: reg_sound(20),
	src: "audio/bgm/fork1.wav",
	loop: false,
	onend: () => {bgm_aprilfools2.play();},
	volume: 0.7,
});

var bgm_aprilfools2 = new Howl({
	onload: reg_sound(21),
	src: "audio/bgm/fork2.wav",
	loop: true,
	volume: 0.7,
});


var se_text_advance = new Howl({
	onload: reg_sound(101),
	src: "audio/se/000029ec.wav",
	loop: false,
	volume: 0.7,
});

var se_press_zed = new Howl({
	onload: reg_sound(102),
	src: "audio/se/000029ab.wav",
	loop: false,
	volume: 0.7,
});



var se_arrow_ding = new Howl({
	onload: reg_sound(111),
	src: "audio/se/000029aa.wav",
	loop: false,
	volume: 0.7,
});

var se_damage = new Howl({
	onload: reg_sound(112),
	src: "audio/se/000029c3.wav",
	loop: false,
	volume: 0.7,
});

var se_spear_appear = new Howl({
	onload: reg_sound(113),
	src: "audio/se/0000299b.wav",
	loop: false,
	volume: 0.7,
});

var se_spear_shoot = new Howl({
	onload: reg_sound(114),
	src: "audio/se/000029a2.wav",
	loop: false,
	volume: 0.7,
});

var se_attack = new Howl({
	onload: reg_sound(115),
	src: "audio/se/000029c1.wav",
	loop: false,
	volume: 0.7,
});

var se_pike_shoot = new Howl({
	onload: reg_sound(116),
	src: "audio/se/0000299c.wav",
	loop: false,
	volume: 0.7,
});



var se_menu_move = new Howl({
	onload: reg_sound(120),
	src: "audio/se/00002a00.wav",
	loop: false,
	volume: 0.7,
});

var se_menu_select = new Howl({
	onload: reg_sound(121),
	src: "audio/se/000029fd.wav",
	loop: false,
	volume: 0.7,
});


var se_undyne = new Howl({
	onload: reg_sound(141),
	src: "audio/se/000029dc.wav",
	loop: false,
	volume: 0.7,
});
