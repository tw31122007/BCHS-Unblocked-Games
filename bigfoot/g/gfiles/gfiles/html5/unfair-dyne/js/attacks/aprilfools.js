var af_intro1 = {
	type: "arrow",
	next_time: 3.2,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.8, speed: 80 },
		{ direction: "$3", turntype: 0, target_time: 1.6, speed: 80 },
		{ direction: "$3", turntype: 0, target_time: 2.4, speed: 80 },
	],
	next_sets: ["af_intro2"]
};

var af_intro2 = {
	type: "spear",
	next_time: 3.2,
	buffer_time: 0.4,
	spear_interval: 800,
	next_sets: ["af_ag1"]
};

var af_ag1 = {
	type: "arrow",
	next_time: 6.4,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.6, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.7, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.9, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.1, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.4, speed: 500 },

		{ direction: "R", turntype: 0, target_time: 1.6, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.8, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.3, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.5, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.7, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.8, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.0, speed: 500 },

		{ direction: "R", turntype: 0, target_time: 3.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.6, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.8, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.9, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 4.1, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 4.3, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 4.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 4.6, speed: 500 },

		{ direction: "R", turntype: 0, target_time: 4.8, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.5, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.7, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 5.9, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 6.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 6.2, speed: 500 },
	],
	next_sets: ["af_ag2"],
};

var af_ag2 = {
	type: "arrow",
	next_time: 1.6,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.6, speed: 500 },
		{ direction: "+0", turntype: 2, target_time: 0.7, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.9, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.1, speed: 500 },
		{ direction: "+0", turntype: 3, target_time: 1.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.4, speed: 500 },
	],
	next_sets: ["af_ag2"],
};
