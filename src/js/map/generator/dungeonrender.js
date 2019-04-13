import Memory from '../../memory.js';
import { iter_adjacent } from '../../map/generator/utils';
import RoofDecorator from '../../map/mapdecorator/roof.js';
import * as THREE from 'three';

const SIZE = 200;

class DungeonRender {

  constructor() {
    THREE.Cache.clear();
    this.renderDungeon = this.renderDungeon.bind(this);
    this.addTorch = this.addTorch.bind(this);
    this.decorate = this.decorate.bind(this);
    this.roof = this.roof.bind(this);
    this.size = SIZE;
    
    this.geometry = new THREE.PlaneGeometry(SIZE, SIZE);

    this.lampGeom = new THREE.BoxGeometry( 3, SIZE/4, 3 );

    this.lampBaseGeom = new THREE.BoxGeometry( SIZE/6, SIZE/4, SIZE/6 );

    this.bottomGeom = new THREE.BoxGeometry( SIZE/6, 10, SIZE/6 );
  }

  addTorch(dungeon, scene, pos, room) {


    var light = new THREE.PointLight(0xffb380, 1, room.size[0] * room.size[1] * 150,2);
    light.position.x = SIZE * pos[0];
    light.position.z = SIZE * pos[1];
    light.position.y = SIZE - SIZE/4;
    light.distance = 500;
    scene.add(light);

    dungeon.torches.push(light);
    
    var sphere = new THREE.Mesh( this.lampGeom, Memory.materials.lamp );
    sphere.position.x = light.position.x;
    sphere.position.y = light.position.y+SIZE/4;
    sphere.position.z = light.position.z;
    scene.add( sphere );

    var geometry = this.lampBaseGeom;
    var sphere = new THREE.Mesh( this.lampBaseGeom, Memory.materials.lamp );
    sphere.position.x = light.position.x;
    sphere.position.y = light.position.y;
    sphere.position.z = light.position.z;
    scene.add( sphere );

    var base = new THREE.Mesh( this.bottomGeom, Memory.materials.metalPlate );
    base.position.x = light.position.x;
    base.position.y = light.position.y-SIZE/8 - 5;
    base.position.z = light.position.z;
    scene.add( base );
    light.position.y -= 100;
  
  }

  roof(dungeon, scene) {

    dungeon.children.forEach(room => {

        RoofDecorator.StandardRoof(scene, dungeon, room);
       
    });
  }

  decorate(dungeon, scene) {

    var ambientLight = new THREE.AmbientLight(0xbbbb77, 1);
    scene.add(ambientLight);

    dungeon.children.filter(room => room.type === 'room').forEach(room => {

        var perimeter = room.perimeter[0];
        var pos = perimeter[0];
        var facing = perimeter[1];
        pos = room.global_pos(room.get_center_pos());
        this.addTorch(dungeon, scene, pos, room);
        
    });
  }

  renderDungeon(dungeon, scene) {
    
    var geometry = this.geometry;
    for (let y = 0; y < dungeon.size[1]; y++) {
      let row = '';
      for (let x = 0; x < dungeon.size[0]; x++) {

        const piece = dungeon.getPiece([x,y]);
        
        const isRoom = piece && piece.type === 'room';


        const wall = dungeon.walls.get([x, y]);
        if (wall) {

          const leftWall = dungeon.walls.get([x + 1, y]);
          if (!leftWall) {
            var left = new THREE.Mesh(geometry, Memory.materials.wall);
            left.position.x = x * SIZE + SIZE/2;
            left.position.z = y * SIZE;
            left.rotation.y = THREE.Math.degToRad(90);
            scene.add(left);
            if(isRoom)
              piece.wallMeshes.push(left);

          }

          const rightWall = dungeon.walls.get([x - 1, y]);
          if (!rightWall) {
            var right = new THREE.Mesh(geometry, Memory.materials.wall);
            right.position.x = x * SIZE - SIZE/2;
            right.position.z = y * SIZE;
            right.rotation.y = THREE.Math.degToRad(-90);
            scene.add(right);
            if(isRoom)
              piece.wallMeshes.push(right);
          }

          const topWall = dungeon.walls.get([x, y - 1]);
          if (!topWall) {
            var top = new THREE.Mesh(geometry, Memory.materials.wall);
            top.position.x = x * SIZE;
            top.position.z = y * SIZE - SIZE/2;
            top.rotation.y = THREE.Math.degToRad(180);
            scene.add(top);
            if(isRoom)
              piece.wallMeshes.push(top);
          }

          const botWall = dungeon.walls.get([x, y + 1]);
          if (!botWall) {
            var bot = new THREE.Mesh(geometry, Memory.materials.wall);
            bot.position.x = x * SIZE;
            bot.position.z = y * SIZE + SIZE/2;
            scene.add(bot);
            if(isRoom)
              piece.wallMeshes.push(bot);
          }
        } else {
          var floor = new THREE.Mesh(geometry, Memory.materials.metalPlate);
          floor.position.x = x * SIZE;
          floor.position.z = y * SIZE;
          floor.position.y = -SIZE/2;
          floor.rotation.x = THREE.Math.degToRad(-90);
          scene.add(floor);
        }
      }
    }
    this.roof(dungeon, scene);
    this.decorate(dungeon, scene);
  }

}

export default new DungeonRender();
