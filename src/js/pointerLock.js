import PlayerControl from './controls/PlayerControl.js';


class PointerLock {

  constructor(camera, scene, player, dungeon) {
    this.blocker = document.getElementById('blocker');
    this.instructions = document.getElementById('instructions');
    this.controlsEnabled = false;
    this.dungeon = dungeon;
    this.player = player;

    this.update = this.update.bind(this);
 
    this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (this.havePointerLock) {

      this.element = document.body;

      this.pointerlockchange = function (event) {

        if (document.pointerLockElement === this.element || document.mozPointerLockElement === this.element || document.webkitPointerLockElement === this.element) {

          this.controlsEnabled = true;

          this.blocker.style.display = 'none';

        } else {
          this.controlsEnabled = false;

          this.blocker.style.display = 'block';

          this.instructions.style.display = '';

        }

      }.bind(this);

      this.pointerlockerror = function (event) {

        this.instructions.style.display = '';

      }.bind(this);

      // Hook pointer lock state change events
      document.addEventListener('pointerlockchange', this.pointerlockchange.bind(this), false);
      document.addEventListener('mozpointerlockchange', this.pointerlockchange.bind(this), false);
      document.addEventListener('webkitpointerlockchange', this.pointerlockchange.bind(this), false);

      document.addEventListener('pointerlockerror', this.pointerlockerror.bind(this), false);
      document.addEventListener('mozpointerlockerror', this.pointerlockerror.bind(this), false);
      document.addEventListener('webkitpointerlockerror', this.pointerlockerror.bind(this), false);

      this.instructions.addEventListener('click', function (event) {

        this.instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        this.element.requestPointerLock = this.element.requestPointerLock || this.element.mozRequestPointerLock || this.element.webkitRequestPointerLock;
        this.element.requestPointerLock();

      }.bind(this), false);

    } else {

      this.instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
    this.update(dungeon);
  }

  update() {
    requestAnimationFrame(this.update);
    if (this.controlsEnabled === true) {
      this.player.controls.enabled = true;
      this.player.update(this.dungeon);
    } else {
      this.player.controls.enabled = false;
    }
  }
}

export default PointerLock;
