AFRAME.registerComponent('videoloop', {
    schema: {type: 'int', default: 5},
    init: function () {
        this.videoLoopURL = '../media/' + this.el.id + "-loop.mp4"
        // this.el.setAttribute('src', this.videoLoopURL);
    }
});

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