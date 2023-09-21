canvas.on('mousemove', e => {
  e.preventDefault();
  if (started) {
		const pos = (e.clientX - $(window).width() / 2) / (($(window).width() < 450? $(window).width(): 450) / 5);
		if (pos >= -3.5 && pos <= 3.5) {
			ball.mesh.position.x = pos;
			camera.position.x = pos / 7;
		}
  }
});
canvas.on('touchmove', e => {
  e.preventDefault();
	if (started) {
		const pos =
			(e.changedTouches[0].pageX - $(window).width() / 2) / (($(window).width() < 450? $(window).width(): 450) / 5);
		if (pos >= -3.5 && pos <= 3.5) {
			ball.mesh.position.x = pos;
			camera.position.x = pos / 7;
		}
	}
});


$(window).on('keydown', e => {
  if(started && !ball.count2Lose) keystate[e.keyCode] = true;
});

$(window).on('keyup', e => {
  delete keystate[e.keyCode];
});

$(window).on('resize', e => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});