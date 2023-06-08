class Ball {
  constructor() {
    this.geometry = new THREE.SphereGeometry(0.5, 100, 100);
    this.material = new THREE.MeshLambertMaterial({ color: 0xff1111 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0.6, 0);
    scene.add(this.mesh);
    this.speed = { z: 0, y: 0 };
    this.landed = true;
    //The position where the ball starts jumping
    this.tmpZ = 0;
    this.count2Lose = 0;
  }
  update() {
    this.mesh.position.y += this.speed.y;
    this.mesh.position.z += this.speed.z;
    camera.position.z += this.speed.z;
    if (this.mesh.position.y <= 0.6 && this.mesh.position.y > 0 && !this.count2Lose) {
      this.landed = false;
      world.forEach(v => {
        if (v instanceof Mat || v instanceof Bouncer) {
          if (v.detect()) {
            this.landed = true;
            this.speed.y = 0;
            this.mesh.position.y = 0.6;
            if (this.tmpZ) {
              this.mesh.position.z = this.tmpZ - 4;
              camera.position.z = this.tmpZ - 4 + distance;
              this.tmpZ = 0;
            }
          }
        }
      });

      if (!this.landed) {
        this.speed.y -= 0.04;
        if (!this.count2Lose) this.count2Lose = 1;
      }
      world.forEach(v => {
        if (v instanceof Bouncer && this.landed) {
          if (v.detect() && started) {
            this.landed = false;
            this.speed.y = 0.5;
            this.tmpZ = this.mesh.position.z;
            v.mesh.position.y = 1;
          }
        }
      });
    } else {
      this.landed = false;
      this.speed.y -= 0.04;
    }
    if (this.count2Lose) {
      this.count2Lose++;
      if (this.count2Lose >= 5) gameover();
    }
    world.forEach(v => {
      if (v instanceof Obstacle)
        if (v.detect()) gameover();
    });
  }
}

class Mat {
  constructor(xpos, zpos, color) {
    color = parseInt(color);
    this.geometry = new THREE.BoxGeometry(1, 0.2, 1);
    this.material = new THREE.MeshPhongMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.edgesGeometry = new THREE.EdgesGeometry(this.geometry);
    this.edgesMaterial = new THREE.LineBasicMaterial({ color: 0x909000 });
    this.line = new THREE.LineSegments(this.edgesGeometry, this.edgesMaterial);
    this.mesh.position.set(xpos, 0, zpos);
    this.line.position.set(xpos, 0, zpos);
    this.mesh.name = 'level component';
    this.line.name = 'level component';
    scene.add(this.line);
    scene.add(this.mesh);
  }
  detect() {
    if (
      ball.mesh.position.x >= this.mesh.position.x - 0.5 &&
      ball.mesh.position.x <= this.mesh.position.x + 0.5 &&
      ball.mesh.position.z >= this.mesh.position.z - 0.5 &&
      ball.mesh.position.z <= this.mesh.position.z + 0.5 &&
      ball.mesh.position.z <= 0.5
    ) return true;
  }
}
class Bouncer {

  constructor(xpos, zpos, color) {
    color = parseInt(color);
    this.geometry = new THREE.BoxGeometry(1, 0.2, 1);
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.edgesGeometry = new THREE.EdgesGeometry(this.geometry);
    this.edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    this.line = new THREE.LineSegments(this.edgesGeometry, this.edgesMaterial);
    this.mesh.position.set(xpos, 0, zpos);
    this.line.position.set(xpos, 0, zpos);
    this.mesh.name = 'level component';
    this.line.name = 'level component';
    scene.add(this.mesh);
  }
  detect() {
    if (
      ball.mesh.position.x >= this.mesh.position.x - 0.5 &&
      ball.mesh.position.x <= this.mesh.position.x + 0.5 &&
      ball.mesh.position.z >= this.mesh.position.z - 0.5 &&
      ball.mesh.position.z <= this.mesh.position.z + 0.5 &&
      ball.mesh.position.z <= 0.5
    ) return true;
  }
}

class Obstacle {
  constructor(xpos, zpos, color) {
    color = parseInt(color);
    this.geometry = new THREE.BoxGeometry(1, 0.7, 1);
    this.material = new THREE.MeshPhongMaterial({ color: color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.edgesGeometry = new THREE.EdgesGeometry(this.geometry);
    this.edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    this.line = new THREE.LineSegments(this.edgesGeometry, this.edgesMaterial);
    this.mesh.position.set(xpos, 0.45, zpos);
    this.line.position.set(xpos, 0.45, zpos);
    this.mesh.name = 'level component';
    this.line.name = 'level component';
    scene.add(this.line);
    scene.add(this.mesh);

  }
  detect() {
    if (
      ball.mesh.position.x >= this.mesh.position.x - 0.5 &&
      ball.mesh.position.x <= this.mesh.position.x + 0.5 &&
      ball.mesh.position.z >= this.mesh.position.z - 0.4 &&
      ball.mesh.position.z <= this.mesh.position.z + 0.5 &&
      ball.mesh.position.z <= 0.5 &&
      ball.mesh.position.y < this.mesh.position.y + 0.65
    ) return true;
  }
}
