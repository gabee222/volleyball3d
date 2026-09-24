import * as THREE from 'three'

export default class PickHelper {
    constructor (player) {
        this.raycaster = new THREE.Raycaster();
        this.pickedPlayer = player;
    }
    pick(normalizedPosition, scene, camera) {
        this.raycaster.setFromCamera(normalizedPosition, camera);
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length) {
            this.pickedObject = intersectedObjects[0].object;
            const i = 1;
            // #TODO ONLY PICK UP PLAYER OBJECTS <- DEFINE OBJECTS IN GLB FILE AS PLAYER OBJECTS
            // while (i >= intersectedObjects.length || typeof this.pickedObject !== 'Player'){
            //     this.pickedObject = intersectedObjects[i].object;
            //     i++;
            // }
            if (this.pickedObject.name.includes("Player")){
                console.log(this.pickedObject);
                return this.pickedObject.name;
            }
        }
        return ""
    }
}