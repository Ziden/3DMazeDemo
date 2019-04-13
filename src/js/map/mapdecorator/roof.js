import DungeonRender from '../generator/dungeonrender.js';
import Memory from '../../memory.js';

const Roof = {

    StandardRoofTile(scene, dungeon, room, wallPos, facing) {
        var plane = new THREE.Mesh(DungeonRender.geometry, Memory.materials.wall_dark);

        if(facing==90) {
            wallPos[0]++;
            plane.rotation.z += THREE.Math.degToRad(90);
            plane.rotation.y += THREE.Math.degToRad(45);
            plane.position.y += DungeonRender.size/4+DungeonRender.size/10;
            plane.position.x -= DungeonRender.size/4-DungeonRender.size/10;
            
        }  
        else if(facing==180) {
            wallPos[1]++;
            plane.rotation.x += THREE.Math.degToRad(45);
            plane.position.y += DungeonRender.size/4+DungeonRender.size/10;
            plane.position.z -= DungeonRender.size/4-DungeonRender.size/10;
            
        }
        else if(facing==270) {
            wallPos[0]--;
            plane.rotation.z += THREE.Math.degToRad(90);
            plane.rotation.y += THREE.Math.degToRad(-45);
            plane.position.y += DungeonRender.size/4+DungeonRender.size/10;
            plane.position.x += DungeonRender.size/4-DungeonRender.size/10;
        }
            
        else if(facing==0) {
            wallPos[1]--;
            plane.rotation.x += THREE.Math.degToRad(90+45);
            plane.position.y += DungeonRender.size/4+DungeonRender.size/10;
            plane.position.z += DungeonRender.size/4-DungeonRender.size/10;
        }
            
        plane.position.x += wallPos[0] * DungeonRender.size;
        plane.position.z += wallPos[1] * DungeonRender.size;

        plane.position.y += DungeonRender.size /2 ;
        if(plane.rotation.x == 0)
            plane.rotation.x = THREE.Math.degToRad(90);
        scene.add(plane);
    },

    StandardRoof(scene, dungeon, room) {

        room.exits.forEach(exit => {
            const wallPos = room.global_pos(exit[0]);
            const exitFacing = exit[1];

            var plane = new THREE.Mesh(DungeonRender.geometry, Memory.materials.wall_dark);
            plane.position.x += wallPos[0] * DungeonRender.size;
            plane.position.z += wallPos[1] * DungeonRender.size;
   
            plane.position.y += DungeonRender.size /2;
            if(plane.rotation.x == 0)
                plane.rotation.x = THREE.Math.degToRad(90);
            scene.add(plane);
        });

        room.perimeter.forEach(perimeter => {
     
            const wallPos = room.global_pos(perimeter[0]);
            let facing = perimeter[1];
           
            Roof.StandardRoofTile(scene, dungeon, room, wallPos, facing);

        });

        for(var i = 0 ; i < room.room_size[0] ; i++) {
            for(var j = 0 ; j < room.room_size[1] ; j++) {
                const x = i + room.position[0]+1;
                const y = j +room.position[1]+1;
     
                const ceil = new THREE.PlaneGeometry(DungeonRender.size,DungeonRender.size);

                var plane = new THREE.Mesh(ceil, Memory.materials.wall_dark);

                plane.rotation.x = THREE.Math.degToRad(90);
                plane.position.x = x * DungeonRender.size;
                plane.position.z = y * DungeonRender.size;
                plane.position.y = DungeonRender.size;
                scene.add(plane);
            }
        }

    }

}

export default Roof;