import * as THREE from 'three'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
import Memory from './memory.js';
import DungeonRenderer from './map/generator/dungeonrender.js';
import MapControl from './map/mapControl.js';
import LightBake from './shaders/lightbake.js';
import Stats from './util/stats.js';
import PlayerControl from './controls/PlayerControl.js';
import PointerLock from './pointerLock.js';

class Main {
  constructor() {
    this._camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
    this._camera.position.z = 10;
    Memory.load();

    this._scene = new THREE.Scene()
    this._scene.fog = new THREE.Fog(0x000000, 0.015, 2200);
    this.player = new PlayerControl(this._scene, this._camera);
    this._renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this._renderer.setPixelRatio(window.devicePixelRatio)
    this._renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this._renderer.domElement)


    this.mapControl = new MapControl();
    const dungeon = this.mapControl.generateDemoMap();
    console.log(dungeon);

    this.pointerLock = new PointerLock(this._camera, this._scene, this.player, dungeon);


    DungeonRenderer.renderDungeon(dungeon, this._scene);

    window.dungeon = dungeon;

    const initialRoom = dungeon.children[0];
    const initialPos = initialRoom.global_pos(initialRoom.get_center_pos());

    this.player.controls.getObject().position.x = initialPos[0] * DungeonRenderer.size;
    this.player.controls.getObject().position.z = initialPos[1] * DungeonRenderer.size;

    this.player.currentRoom = initialRoom;

    var stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    function animate() {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    }


    document.addEventListener("onwindowresize", this.onWindowResize);
    requestAnimationFrame(animate);

    this.animate()
  }

  get renderer () {
    return this._renderer
  }

  get camera () {
    return this._camera
  }

  get scene () {
    return this._scene
  }

  onWindowResize () {
    this._camera.aspect = window.innerWidth / window.innerHeight
    this._camera.updateProjectionMatrix()

    this._renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate (timestamp) {
    requestAnimationFrame(this.animate.bind(this))
    this._renderer.render(this._scene, this._camera)
  }
}

export default Main
