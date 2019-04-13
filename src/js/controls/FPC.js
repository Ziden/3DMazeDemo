var PI_2 = Math.PI / 2;

class FPC {

    constructor(camera) {
        this.camera = camera;
        camera.rotation.set( 0, 0, 0 );
    
        this.getObject = this.getObject.bind(this);
       
        var pitchObject = new THREE.Object3D();
        pitchObject.add( camera );
        this.pitchObject = pitchObject;
        var yawObject = new THREE.Object3D();
        yawObject.position.y = 10;
        yawObject.add( pitchObject );
        this.yawObject = yawObject;
        this.PI_2 = Math.PI / 2;
        document.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

        this.enabled = false;
        
        this.getDirection = function() {

            var direction = new THREE.Vector3( 0, 0, - 1 );
            var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
    
            return function( v ) {
    
                rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
    
                v.copy( direction ).applyEuler( rotation );
    
                return v;
    
            }.bind(this);
    
        }.bind(this)();
    }

    getObject() {
        return this.yawObject;
    }

    onMouseMove(event) {
        if ( this.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		this.yawObject.rotation.y -= movementX * 0.002;
        this.pitchObject.rotation.x -= movementY * 0.002;

		this.pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, this.pitchObject.rotation.x ) );
    }

    dispose() {
        document.removeEventListener( 'mousemove', this.onMouseMove.bind(this), false );
    }

};

export default FPC;