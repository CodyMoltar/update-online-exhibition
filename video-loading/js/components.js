let cameraPosition;

AFRAME.registerComponent('positionlogger', {
    init: function(){
        this.cam = document.getElementById('rig');
    },
    tick: function(){
        cameraPosition = this.cam.object3D.getWorldPosition(new THREE.Vector3())
    }
})

AFRAME.registerComponent('videoloop', {
    schema: {type: 'int', default: 5},
    init: function () {
        // Set the static image source of the plane
        this.staticImageURL = '../media/' + this.el.id + ".png"
        this.el.setAttribute('src', this.staticImageURL);
        this.videoLoopURL = '../media/' + this.el.id + "-loop.mp4"

        this.triggerDistance = 40;

        this.loopLoaded = false;

    },
    tick: function(){

        if(!this.loopLoaded){
            this.videoPosition = this.el.getObject3D("mesh").getWorldPosition(new THREE.Vector3());
        
            this.distance = this.videoPosition.distanceTo(cameraPosition)

            if(this.distance < this.triggerDistance){
            
                console.log("Loading loop");

                this.el.setAttribute('src', this.videoLoopURL)

                this.loopLoaded = true;

            }
        }

        

    }
});

AFRAME.registerComponent('videoactivator', {
    schema:{
        color: {default: '#808080'},
        target: {type: 'string', default: 'none'}
    },
    init: function(){

        this.width = 2;
        this.height = 2;

        this.el.setAttribute('color', this.data.color);
        this.el.setAttribute('width', this.width)
        this.el.setAttribute('height', this.height)

    },
    tick: function(){

        this.planePosition = this.el.getObject3D("mesh").getWorldPosition(new THREE.Vector3());
        
        this.distance = this.planePosition.distanceTo(cameraPosition)

        if(this.distance < this.width && this.distance < this.height){
            
            

        }

    }
})

// AFRAME.registerComponent('videoplayer', {
//     schema: {type: 'string', default:'none'},
//     init: function () {
//         this.cam = document.getElementById('rig');
//         this.plane = this.el.object3D.getWorldPosition(new THREE.Vector3());
//         this.width = this.el.getAttribute('geometry').width;
//         this.hasBeenRestarted = false;
        
//     },
//     tick: function () {
//         let camPos = this.cam.object3D.getWorldPosition(new THREE.Vector3());
//         let distance = camPos.distanceTo(this.plane);
//         if (distance < this.width/2) {
//             for(let i = 0; i < videos.length; i++){
//                 if(videos[i].id == this.data){
//                     videos[i].muted = false;
//                     if(!this.hasBeenRestarted){
//                         videos[i].pause();
//                         videos[i].currentTime = 0;
//                         videos[i].load();
//                         this.hasBeenRestarted = true;
//                     }
//                 }
//             }
//         }else{
//             for(let i = 0; i < videos.length; i++){
//                 if(videos[i].id == this.data){
//                     videos[i].muted = true;
//                 }
//             }
//         }  
//     },
    
// });