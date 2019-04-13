export default class PlayerMoveEvent {

    constructor(player, oldWorldPos, newWorldPos) {
        this.player = player;
        this.oldWorldPos = oldWorldPos;
        this.newWorldPos = newWorldPos;
    }

}