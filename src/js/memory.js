import * as THREE from 'three';

class Memory {

    constructor() {
        this.load = this.load.bind(this);
        this.textures = {}; 
        this.materials = {};
    }

    load() {
        
        this.textures.lamp = new THREE.TextureLoader().load('static/textures/lamp.png');
        this.textures.metalPlate =  new THREE.TextureLoader().load('static/textures/metal_plate.png');
        this.textures.wall = new THREE.TextureLoader().load('static/textures/stone_wall.png');
        this.textures.wall.wrapS = THREE.RepeatWrapping;
        this.textures.wall.wrapT = THREE.RepeatWrapping;
        this.textures.wall.repeat.set( 2, 2 );

        this.materials.wall = new THREE.MeshLambertMaterial({ map: this.textures.wall , roughness: 1, metalness:0.5});
        this.materials.wall_dark = new THREE.MeshLambertMaterial({ map: this.textures.wall , roughness: 0.5, metalness:0.5, color:0xf5f5f0});
        this.materials.lamp = new THREE.MeshLambertMaterial({ map: this.textures.lamp , roughness: 1, metalness:0.7});
        this.materials.metalPlate = new THREE.MeshLambertMaterial({ map: this.textures.metalPlate , roughness: 1, metalness:0.7});
        this.materials.fire = new THREE.MeshBasicMaterial( {color: 0xDD4400} );
    }

}

export default new Memory();