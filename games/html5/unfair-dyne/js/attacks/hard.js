var h_ag1 = {
	type: "arrow",
	next_time: 3.2,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.0, speed: 100 },
		{ direction: "$3", turntype: 0, target_time: 0.6, speed: 100 },
		{ direction: "$3", turntype: 0, target_time: 1.2, speed: 100 },
	],
	next_sets: ["h_ag2"], // TESTING
};


var h_ag2 = {
	type: "arrow",
	next_time: 4.5,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.0, speed: 150 },
		{ direction: "$3", turntype: 0, target_time: 0.5, speed: 150 },
		{ direction: "$2", turntype: 0, target_time: 1.0, speed: 150 },
		{ direction: "$2", turntype: 0, target_time: 1.5, speed: 150 },
		{ direction: "$4", turntype: 0, target_time: 2.0, speed: 150 },
		{ direction: "$4", turntype: 0, target_time: 2.5, speed: 150 },
	],
	next_sets: ["h_ag3"],
};


var h_ag3 = {
	type: "arrow",
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
	next_sets: ["h_ag4a", "h_ag4b"],
};


var h_ag4a = {
	type: "arrow",
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
	next_sets: ["h_ag5"],
};


var h_ag4b = {
	type: "arrow",
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
	next_sets: ["h_ag5"],
};


var h_ag5 = {
	type: "arrow",
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
	next_sets: ["h_ag6"],
};


var h_ag6 = {
	type: "arrow",
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
	next_sets: ["h_sp1"],
};



var h_sp1 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 600,
	next_sets: ["h_ag7"],
};



var h_ag7 = {
	type: "arrow",
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
	next_sets: ["h_ag8"],
};


var h_ag8 = {
	type: "arrow",
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
	next_sets: ["h_ag9"],
};



var h_ag9 = {
	type: "arrow",
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
	next_sets: ["h_ag10"],
};


var h_ag10 = {
	type: "arrow",
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
	next_sets: ["h_sp2"],
};


var h_sp2 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 500,
	next_sets: ["h_ag11"],
};


var h_ag11 = {
	type: "arrow",
	next_time: 3.2,
	arrows: [
		{ direction: "4", turntype: 0, target_time: 0.0, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 0.4, speed: 200 },
		{ direction: "4", turntype: 0, target_time: 0.8, speed: 200 },
		{ direction: "2", turntype: 0, target_time: 1.2, speed: 200 },
		{ direction: "4", turntype: 3, target_time: 1.6, speed: 300 },
	],
	next_sets: ["h_ag12"],
};

var h_ag12 = {
	type: "arrow",
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
	next_sets: ["h_ag13"],
};


var h_ag13 = {
	type: "arrow",
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
	next_sets: ["h_ag14"],
};


var h_ag14 = {
	type: "arrow",
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
	next_sets: ["h_ag15"],
};

var h_ag15 = {
	type: "arrow",
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
	next_sets: ["h_ag16"],
};


var h_ag16 = {
	type: "arrow",
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
	next_sets: ["h_ag17"],
};


var h_ag17 = {
	type: "arrow",
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
	next_sets: ["h_ag18"],
};


var h_ag18 = {
	type: "arrow",
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
	next_sets: ["h_sp3"],
};


var h_sp3 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 400,
	next_sets: ["h_ag19"],
};


var h_ag19 = {
	type: "arrow",
	next_time: 3.5,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 0.3, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 0.6, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 0.8, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 1.1, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 1.4, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 1.6, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 1.9, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 2.1, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 2.4, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 2.7, speed: 300 },
	],
	next_sets: ["h_ag20"],
};

var h_ag20 = {
	type: "arrow",
	next_time: 4.0,
	arrows: [
		{ direction: "$3", turntype: 0, target_time: 0.00, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.15, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.30, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.45, speed: 500 },
		{ direction: "$2", turntype: 0, target_time: 0.80, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.95, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.10, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.25, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.40, speed: 500 },
		{ direction: "$4", turntype: 0, target_time: 1.65, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.80, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.95, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.10, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.25, speed: 500 },
		{ direction: "$2", turntype: 0, target_time: 2.50, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.65, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.80, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.95, speed: 500 },
		{ direction: "$4", turntype: 0, target_time: 3.20, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 3.35, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 3.50, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 3.65, speed: 500 },
	],
	next_sets: ["h_ag21"],
};

var h_ag21 = {
	type: "arrow",
	next_time: 5.0,
	arrows: [
		{ direction: "1", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 0.25, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.5, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 0.75, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 1.0, speed: 300 },
		{ direction: "4", turntype: 2, target_time: 1.25, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 1.5, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 1.75, speed: 300 },
		{ direction: "1", turntype: 3, target_time: 2.5, speed: 300 },
		{ direction: "2", turntype: 3, target_time: 2.75, speed: 300 },
		{ direction: "3", turntype: 3, target_time: 3.0, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 3.25, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 3.5, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 3.75, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 4.0, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 4.25, speed: 300 },
	],
	next_sets: ["h_ag22"],
};

var h_ag22 = {
	type: "arrow",
	next_time: 4.0,
	arrows: [
		{ direction: "$2", turntype: 2, target_time: 0.0, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.15, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.3, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.45, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 0.6, speed: 500 },
		{ direction: "$4", turntype: 3, target_time: 0.85, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.0, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.15, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.3, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.45, speed: 500 },
		{ direction: "$2", turntype: 2, target_time: 1.7, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 1.85, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.0, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.15, speed: 500 },
		{ direction: "$4", turntype: 3, target_time: 2.4, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.55, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.7, speed: 500 },
		{ direction: "$3", turntype: 0, target_time: 2.85, speed: 500 },
	],
	next_sets: ["h_pk1"],
};


var h_pk1 = {
	type: "pike",
	next_time: 6,
	buffer_time: 0.8,
	pike_interval: 500,
	down: false,
	next_sets: ["h_ag23", "h_ag24", "h_ag25", "h_ag26", "h_ag27"],
};

var h_ag23 = {
	type: "arrow",
	next_time: 4.8,
	arrows: [
		{ direction: "1", turntype: 0, target_time: 0.0, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.2, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 0.4, speed: 300 },
		{ direction: "3", turntype: 0, target_time: 0.6, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 1.2, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 1.4, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 1.6, speed: 300 },
		{ direction: "4", turntype: 0, target_time: 1.8, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 2.4, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 2.6, speed: 300 },
		{ direction: "1", turntype: 0, target_time: 2.8, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 3.0, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 3.6, speed: 300 },
		{ direction: "2", turntype: 3, target_time: 3.8, speed: 300 },
		{ direction: "2", turntype: 0, target_time: 4.0, speed: 300 },
		{ direction: "2", turntype: 3, target_time: 4.2, speed: 300 },
	],
	next_sets: ["h_sp4", "h_pk1", "h_ag24", "h_ag25", "h_ag26", "h_ag27"],
};

var h_ag24 = {
	type: "arrow",
	next_time: 5.5,
	arrows: [
		{ direction: "1", turntype: 2, target_time: 0.0, speed: 300 },
		{ direction: "2", turntype: 3, target_time: 0.3, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 0.6, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 0.9, speed: 300 },
		{ direction: "1", turntype: 3, target_time: 1.2, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 1.5, speed: 300 },
		{ direction: "3", turntype: 3, target_time: 1.8, speed: 300 },
		{ direction: "4", turntype: 2, target_time: 2.1, speed: 300 },
		{ direction: "1", turntype: 2, target_time: 2.4, speed: 300 },
		{ direction: "3", turntype: 2, target_time: 2.7, speed: 300 },
		{ direction: "2", turntype: 3, target_time: 3.0, speed: 300 },
		{ direction: "4", turntype: 3, target_time: 3.3, speed: 300 },
		{ direction: "1", turntype: 3, target_time: 3.6, speed: 300 },
		{ direction: "3", turntype: 3, target_time: 3.9, speed: 300 },
		{ direction: "2", turntype: 2, target_time: 4.2, speed: 300 },
		{ direction: "4", turntype: 2, target_time: 4.5, speed: 300 },
	],
	next_sets: ["h_sp4", "h_ag23", "h_pk1", "h_ag25", "h_ag26", "h_ag27"],
};

var h_ag25 = {
	type: "arrow",
	next_time: 5.0,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 400 },
		{ direction: "+0", turntype: 3, target_time: 0.2, speed: 400 },
		{ direction: "+0", turntype: 0, target_time: 0.6, speed: 400 },
		{ direction: "+0", turntype: 3, target_time: 0.8, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 1.2, speed: 400 },
		{ direction: "+0", turntype: 2, target_time: 1.4, speed: 400 },
		{ direction: "+0", turntype: 0, target_time: 1.8, speed: 400 },
		{ direction: "+0", turntype: 2, target_time: 2.0, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 2.4, speed: 400 },
		{ direction: "+0", turntype: 2, target_time: 2.6, speed: 400 },
		{ direction: "+0", turntype: 0, target_time: 3.0, speed: 400 },
		{ direction: "+0", turntype: 3, target_time: 3.2, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 3.6, speed: 400 },
		{ direction: "+0", turntype: 3, target_time: 3.8, speed: 400 },
		{ direction: "+0", turntype: 0, target_time: 4.2, speed: 400 },
		{ direction: "+0", turntype: 2, target_time: 4.4, speed: 400 },
	],
	next_sets: ["h_sp4", "h_ag23", "h_ag24", "h_pk1", "h_ag26", "h_ag27"],
};

var h_ag26 = {
	type: "arrow",
	next_time: 4.2,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.3, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.6, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.9, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.2, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.5, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.8, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.1, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.4, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.7, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.3, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 3.6, speed: 500 },
	],
	next_sets: ["h_sp4", "h_ag23", "h_ag24", "h_ag25", "h_pk1", "h_ag27"],
};

var h_ag27 = {
	type: "arrow",
	next_time: 3.7,
	arrows: [
		{ direction: "R", turntype: 0, target_time: 0.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 0.3, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 0.6, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 0.9, speed: 200 },
		{ direction: "R", turntype: 0, target_time: 1.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 1.3, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 1.5, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 1.7, speed: 200 },
		{ direction: "R", turntype: 0, target_time: 2.0, speed: 500 },
		{ direction: "R", turntype: 0, target_time: 2.4, speed: 400 },
		{ direction: "R", turntype: 0, target_time: 2.5, speed: 300 },
		{ direction: "R", turntype: 0, target_time: 2.7, speed: 200 },
		{ direction: "R", turntype: 0, target_time: 2.8, speed: 500 },
	],
	next_sets: ["h_sp4", "h_ag23", "h_ag24", "h_ag25", "h_ag26", "h_pk1"],
};

var h_pk2 = {
	type: "pike",
	next_time: 6,
	buffer_time: 0.8,
	pike_interval: 400,
	down: true,
	next_sets: ["h_ag23", "h_ag24", "h_ag25", "h_ag26", "h_ag27"],
};

var h_sp4 = {
	type: "spear",
	next_time: 10,
	buffer_time: 2,
	spear_interval: 300,
	next_sets: ["h_ag23", "h_ag24", "h_ag25", "h_ag26", "h_ag27"],
};
