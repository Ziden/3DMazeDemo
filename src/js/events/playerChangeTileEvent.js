export default class PlayerChangeTileEvent {

    constructor(player, oldTile, newTile) {
        this.player = player;
        this.oldTile = oldTile;
        this.newTile = newTile;
    }

}