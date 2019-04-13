import FirstPersonCamera from './FPC.js'
import DungeonRenderer from '../map/generator/dungeonrender.js';
import {
  iter_adjacent
} from '../map/generator/utils/index.js';
import EventManager from '../events/eventManager.js'
import PlayerMoveEvent from '../events/playerMoveEvent.js';
import PlayerChangePieceEvent from '../events/playerChangePieceEvent.js';
import PlayerChangeTileEvent from '../events/playerChangeTileEvent.js';
import PlayerListener from './playerListener.js';

class PlayerControl {

  constructor(scene, camera) {
    this.direction = null;
    this.hitObjects = [];
    this.arrow = undefined;
    this.update = this.update.bind(this);
    this.getTilePosition = this.getTilePosition.bind(this);
    this.getTileInnerPosition = this.getTileInnerPosition.bind(this);

    this.prevTime = performance.now();
    this.speed = 900;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.direction = new THREE.Vector3(0, 0, 0);
    this.movementRaycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 10);
    document.addEventListener('keydown', this.onKeyDown.bind(this), false);
    document.addEventListener('keyup', this.onKeyUp.bind(this), false);

    this.controls = new FirstPersonCamera(camera);
    scene.add(this.controls.getObject());

    this.listener = new PlayerListener(scene);
  }

  update(dungeon) {

    this.time = performance.now();
    this.delta = (this.time - this.prevTime) / 1000;

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
    this.direction.y = 0;
    this.direction.normalize();

    this.velocity.x = -this.direction.x * this.speed;
    this.velocity.z = -this.direction.z * this.speed;

    this.movementRaycaster.ray.origin.copy(this.controls.getObject().position);
    this.movementRaycaster.direction = this.direction;
    this.movementRaycaster.direction.y = 0;
    this.movementRaycaster.far = 50;

    var oldX = this.controls.getObject().position.x;
    var oldZ = this.controls.getObject().position.z;

    const oldTilePosition = this.currentTile || [0, 0];

    const oldInnerTilePosition = this.getTileInnerPosition();

    this.controls.getObject().translateX(this.velocity.x * this.delta);
    this.controls.getObject().translateY(this.velocity.y * this.delta);
    this.controls.getObject().translateZ(this.velocity.z * this.delta);

    const newTilePosition = this.getTilePosition();

    const newInnerTilePosition = this.getTileInnerPosition().slice();

    this.innerTilePosition = newInnerTilePosition;

    if (oldTilePosition[0] != newTilePosition[0] || oldTilePosition[1] != newTilePosition[1]) {

      console.log("changed tile " + Math.random());

      this.currentTile = newTilePosition.slice();

      const roomInTile = dungeon.getPiece(newTilePosition);

      console.log(this.currentRoom);

      if (!this.currentRoom || roomInTile.id != this.currentRoom.id) {

        const oldRoom = this.currentRoom;

        console.log("changed room to ",roomInTile.id);
        console.log("from ",oldRoom.id);

        this.currentRoom = roomInTile;

        const playerChangePieceEvent = new PlayerChangePieceEvent(this, oldRoom, this.currentRoom);
        EventManager.fire(playerChangePieceEvent)

      }

      const playerChangeTileEv = new PlayerChangeTileEvent(this, oldTilePosition, newTilePosition);
      EventManager.fire(playerChangeTileEv);

    }

    const playerMoveEvent = new PlayerMoveEvent(this, [oldX, oldZ], [this.controls.getObject().position.x, this.controls.getObject().position.z]);
    EventManager.fire(playerMoveEvent);

    /*
        var newX = Math.round(this.controls.getObject().position.x / DungeonRenderer.size);
        var newZ = Math.round(this.controls.getObject().position.z / DungeonRenderer.size);
        

        var tileX = ((this.controls.getObject().position.x - DungeonRenderer.size/2) % DungeonRenderer.size);
        var tileZ = ((this.controls.getObject().position.z - DungeonRenderer.size/2) % DungeonRenderer.size);

        let block = false;
        if(tileX > DungeonRenderer.size - DungeonRenderer.size/8) {
          if(dungeon.walls.get(([currentX+1,currentZ]))) {
            console.log("BLOCK");
            block = true;
          }
        }

        const isWall = dungeon.walls.get([currentX,currentZ]);
        if(isWall || block) {
          
          this.controls.getObject().position.x = oldX;
          this.controls.getObject().position.z = oldZ;
          return;
        }
        
    */


    /*
    this.floorRay.ray.origin.copy(this.controls.getObject().position);
    this.floorRay.ray.origin.y -= 10;

    this.intersections = this.floorRay.intersectObjects(this.objects);

    this.onObject = this.intersections.length > 0;

    this.time = performance.now();
    this.delta = (this.time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x * 10.0 * this.delta;
    this.velocity.z -= this.velocity.z * 10.0 * this.delta;

    this.velocity.y -= 9.8 * 20.0 * this.delta; // 100.0 = mass

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveLeft) - Number(this.moveRight);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward)
      this.velocity.z -= this.direction.z * 5000.0 * this.delta;
    if (this.moveLeft || this.moveRight)
      this.velocity.x -= this.direction.x * 5000.0 * this.delta;

    if (this.onObject === true) {

      this.velocity.y = Math.max(0, this.velocity.y);
      this.canJump = true;

    }

    var newPositionX = this.controls.getObject().position.x + this.velocity.x;
    var newPositionZ = this.controls.getObject().position.z + this.velocity.z;

    const wallX = Math.floor(newPositionX / DungeonRenderer.size);
    const wallZ = Math.floor(newPositionZ / DungeonRenderer.size);
 
    console.log(wallX + " - "+wallZ);

    const isWall = dungeon.walls.get([wallX,wallZ]);
    if(isWall) {
      this.velocity = new THREE.Vector3(0,0,0);
    }

    this.controls.getObject().translateX(this.velocity.x * this.delta);
    this.controls.getObject().translateY(this.velocity.y * this.delta);
    this.controls.getObject().translateZ(this.velocity.z * this.delta);

    if (this.controls.getObject().position.y < 10) {

      this.velocity.y = 0;
      this.controls.getObject().position.y = 10;

      this.canJump = true;

    }
    */
    this.prevTime = this.time;
  }

  getTilePosition() {
    return [
      Math.round(this.controls.getObject().position.x / DungeonRenderer.size),
      Math.round(this.controls.getObject().position.z / DungeonRenderer.size)
    ]
  }

  getTileInnerPosition() {
    return [
      (this.controls.getObject().position.x - DungeonRenderer.size / 2) % DungeonRenderer.size,
      (this.controls.getObject().position.z - DungeonRenderer.size / 2) % DungeonRenderer.size
    ];
  }

  onKeyUp(evemt) {
    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;

    }
  }

  onKeyDown(event) {
    switch (event.keyCode) {

      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;

      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;

      case 32: // space
        if (this.canJump === true) this.velocity.y += 350;
        this.canJump = false;
        break;

    }
  }
}

export default PlayerControl;
