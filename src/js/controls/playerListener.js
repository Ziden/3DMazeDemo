
import EventListener from '../events/eventListener.js';
import EventManager from '../events/eventManager.js';
import PlayerMoveEvent from '../events/playerMoveEvent.js';
import PlayerChangePieceEvent from '../events/playerChangePieceEvent.js';

export default class PlayerListener extends EventListener {
    
    constructor(scene) {
        super();
        this.scene = scene;
        EventManager.on(PlayerMoveEvent, this.playerMoveEvent.bind(this)); 
        EventManager.on(PlayerChangePieceEvent, this.changePieceEvent.bind(this)); 
    }

    changePieceEvent(event) {
        console.log("CHANGE ROOM");
    }

    playerMoveEvent(event) {
        const room = event.player.currentRoom;
        
        var intersects = event.player.movementRaycaster.intersectObjects( this.scene.children );

      //  if(intersects.length > 0)
      //   console.log(intersects);

    }


}