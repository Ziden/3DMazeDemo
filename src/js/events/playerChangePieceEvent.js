export default class PlayerChangePieceEvent {

    constructor(player, oldPiece, newPiece) {
        this.player = player;
        this.oldPiece = oldPiece;
        this.newPiece = newPiece;
    }

}