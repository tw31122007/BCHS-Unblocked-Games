var ag1 = {
	type: "arrow",
	id: "ag1",
	next_time: 3.2,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.0, speed: 100 },
		{ direction: "$3", turntype: 0, target_time: 0.6, speed: 100 },
		{ direction: "$3", turntype: 0, target_time: 1.2, speed: 100 },
	],
	next_sets: ["ag2"],
};


var ag2 = {
	type: "arrow",
	id: "ag2",
	next_time: 4.5,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.0, speed: 150 },
		{ direction: "$3", turntype: 0, target_time: 0.5, speed: 150 },
		{ direction: "$2", turntype: 0, target_time: 1.0, speed: 150 },
		{ direction: "$2", turntype: 0, target_time: 1.5, speed: 150 },
		{ direction: "$4", turntype: 0, target_time: 2.0, speed: 150 },
		{ direction: "$4", turntype: 0, target_time: 2.5, speed: 150 },
	],
	next_sets: ["ag3"],
};


var ag3 = {
	type: "arrow",
	id: "ag3",
	next_time: 4.8,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.4, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.8, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 1.2, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 1.6, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 2.0, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 2.4, speed: 200 },
		{ direction: "1", turntype: 0, target_time: 2.8, speed: 200 },
	],
	next_sets: ["ag4a", "ag4b"],
};


var ag4a = {
	type: "arrow",
	id: "ag4a",
	next_time: 4.85,
	arrows: [
		{ direction: "1", turntype: 0, target_time: 0.0, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 0.3, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 0.6, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 0.9, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 1.2, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 1.5, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.8, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 2.1, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.4, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.55, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.7, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.85, speed: 250 },
	],
	next_sets: ["ag5"],
};


var ag4b = {
	type: "arrow",
	id: "ag4b",
	next_time: 4.85,
	arrows: [
		{ direction: "1", turntype: 0, target_time: 0.0, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 0.3, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 0.6, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 0.9, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 1.2, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 1.5, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.8, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 2.1, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.4, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.55, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.7, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.85, speed: 250 },
	],
	next_sets: ["ag5"],
};


var ag5 = {
	type: "arrow",
	id: "ag5",
	next_time: 4.1,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 0.3, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 0.45, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 0.75, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.05, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.2, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 1.5, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.8, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.1, speed: 250 },
	],
	next_sets: ["ag6"],
};


var ag6 = {
	type: "arrow",
	id: "ag6",
	next_time: 4.25,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 0.25, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 0.5, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 0.75, speed: 250 },
		{ direction: "2", turntype: 0, target_time: 1.0, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 1.25, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 1.5, speed: 250 },
		{ direction: "4", turntype: 0, target_time: 1.75, speed: 250 },
		{ direction: "1", turntype: 0, target_time: 2.0, speed: 250 },
		{ direction: "3", turntype: 0, target_time: 2.25, speed: 250 },
	],
	next_sets: ["sp1"],
};



var sp1 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 600,
	next_sets: ["ag7"],
};



var ag7 = {
	type: "arrow",
	id: "ag7",
	next_time: 4.0,
	arrows: [
		{ direction: "1", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.25, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 0.5, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.75, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 1.0, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 1.25, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 1.5, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 1.75, speed: 300 },
	],
	next_sets: ["ag8"],
};


var ag8 = {
	type: "arrow",
	id: "ag8",
	next_time: 2.5,
	arrows: [
		{ direction: "3", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 0.25, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 0.5, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.75, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 1.0, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 1.25, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 1.5, speed: 75 },
	],
	next_sets: ["ag9"],
};



var ag9 = {
	type: "arrow",
	id: "ag9",
	next_time: 3.6,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 400 },
		{ direction: "2", turntype: 0, target_time: 0.2, speed: 320 },
		{ direction: "2", turntype: 0, target_time: 0.5, speed: 240 },
		{ direction: "4", turntype: 0, target_time: 0.9, speed: 400 },
		{ direction: "4", turntype: 0, target_time: 1.1, speed: 320 },
		{ direction: "4", turntype: 0, target_time: 1.4, speed: 240 },
		{ direction: "1", turntype: 0, target_time: 1.7, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.0, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 2.3, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.6, speed: 300 },
	],
	next_sets: ["ag10"],
};


var ag10 = {
	type: "arrow",
	id: "ag10",
	next_time: 3.75,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.25, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.5, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.75, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.9, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 1.15, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 1.4, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 1.65, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.0, speed: 400 },
		{ direction: "1", turntype: 0, target_time: 2.25, speed: 400 },
		{ direction: "4", turntype: 0, target_time: 2.5, speed: 400 },
		{ direction: "2", turntype: 0, target_time: 2.75, speed: 400 },
	],
	next_sets: ["sp2"],
};


var sp2 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 500,
	next_sets: ["ag11"],
};


var ag11 = {
	type: "arrow",
	id: "ag11",
	next_time: 3.2,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.4, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.8, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 1.2, speed: 200 },
		{ direction: "4", turntype: 3, target_time: 1.6, speed: 300 },
	],
	next_sets: ["ag12"],
};

var ag12 = {
	type: "arrow",
	id: "ag11",
	next_time: 4.4,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.4, speed: 200 },
		{ direction: "1", turntype: 2, target_time: 0.8, speed: 200 },
		{ direction: "1", turntype: 0, target_time: 1.2, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 1.6, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 2.0, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.4, speed: 300 },
		{ direction: "1", turntype: 3, target_time: 2.8, speed: 300 },
	],
	next_sets: ["ag13"],
};


var ag13 = {
	type: "arrow",
	id: "ag13",
	next_time: 4.4,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "1", turntype: 0, target_time: 0.4, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.8, speed: 200 },
		{ direction: "3", turntype: 0, target_time: 1.2, speed: 200 },
		{ direction: "4", turntype: 2, target_time: 2.0, speed: 300 },
		{ direction: "3", turntype: 3, target_time: 2.4, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 2.8, speed: 300 },
		{ direction: "1", turntype: 3, target_time: 3.2, speed: 300 },
	],
	next_sets: ["ag14"],
};


var ag14 = {
	type: "arrow",
	id: "ag14",
	next_time: 4.8,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.35, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.7, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 1.05, speed: 200 },
		{ direction: "1", turntype: 0, target_time: 1.4, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 1.75, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.1, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 2.45, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 2.8, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 3.3, speed: 500 },
		{ direction: "2", turntype: 0, target_time: 3.6, speed: 500 },
	],
	next_sets: ["ag15"],
};

var ag15 = {
	type: "arrow",
	id: "ag15",
	next_time: 4.7,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "3", turntype: 0, target_time: 0.35, speed: 200 },
		{ direction: "3", turntype: 0, target_time: 0.7, speed: 200 },
		{ direction: "3", turntype: 2, target_time: 1.6, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 1.8, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 2.6, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 2.9, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 3.2, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 3.5, speed: 300 },
	],
	next_sets: ["ag16"],
};


var ag16 = {
	type: "arrow",
	id: "ag16",
	next_time: 4.6,
	arrows: [
		{ direction: "3", turntype: 0, target_time: 0.0, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 0.4, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 0.8, speed: 500 },
		{ direction: "1", turntype: 0, target_time: 1.2, speed: 500 },
		{ direction: "1", turntype: 0, target_time: 1.6, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 2.0, speed: 500 },
		{ direction: "3", turntype: 0, target_time: 2.4, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 2.8, speed: 500 },
		{ direction: "4", turntype: 0, target_time: 3.2, speed: 500 },
		{ direction: "3", turntype: 0, target_time: 3.6, speed: 500 },
	],
	next_sets: ["ag17"],
};


var ag17 = {
	type: "arrow",
	id: "ag17",
	next_time: 4.5,
	arrows: [
		{ direction: "2", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 0.32, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 0.64, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 0.80, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 0.96, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 1.28, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 1.60, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 1.92, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 2.24, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 2.56, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 2.88, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 3.20, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 3.52, speed: 300 },
	],
	next_sets: ["ag18"],
};


var ag18 = {
	type: "arrow",
	id: "ag18",
	next_time: 4.5,
	arrows: [
		{ direction: "4", turntype: 3, target_time: 0.0, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 0.35, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 0.7, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 1.05, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 1.4, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 1.75, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 2.1, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 2.45, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 2.8, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 3.15, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 3.5, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 3.85, speed: 300 },
	],
	next_sets: ["sp2"],
};
