import Dungeon from '../map/generator/generators/dungeon.js';

class MapControl {

    generateDemoMap() {
        let dungeon = new Dungeon({
            size: [100, 100], 
            //seed: 'abcd', //omit for generated seed
            rooms: {
                any: {
                    min_size: [2, 2],
                    max_size: [5, 5],
                    max_exits: 4
                }
            },
            max_corridor_length: 6,
            min_corridor_length: 2,
            corridor_density: 1, //corridors per room
            symmetric_rooms: false, // exits must be in the center of a wall if true
            interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
            max_interconnect_length: 10,
            room_count: 10
        });
        
        dungeon.generate();
        return dungeon;
    }

}

export default MapControl;