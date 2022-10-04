let cameraPosition;
let videos;

AFRAME.registerComponent('positionlogger', {
    init: function(){
        this.cam = document.getElementById('rig');
        videos = document.getElementsByTagName('a-video');
    },
    tick: function(){
        cameraPosition = this.cam.object3D.getWorldPosition(new THREE.Vector3())
    }
})

AFRAME.registerComponent('videoloop', {
    schema: {type: 'int', default: 5},
    init: function (){
        // Set the static image source of the plane
        this.staticImageURL = './media/' + this.el.id + ".png"
        this.el.setAttribute('src', this.staticImageURL);
        this.el.setAttribute('rotation', '20,0,0')
        this.videoLoopURL = './media/' + this.el.id + "-loop.mp4"
        this.triggerDistance = 20;
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
        color: {default: '#fff'},
        target: {type: 'string', default: 'none'}
    },
    init: function(){
        this.width = 4;
        this.height = 4;
        // this.el.setAttribute('color', this.data.color);
        this.el.setAttribute(
            'material', {
                src: './media/feet.png',
                transparent: true
            })
        this.el.setAttribute('width', this.width)
        this.el.setAttribute('height', this.height)
        this.videoURL = './media/' + this.data.target + ".mp4"
        this.videoLoaded = false;

    },
    tick: function(){
        if(!this.videoLoaded){
            this.planePosition = this.el.getObject3D("mesh").getWorldPosition(new THREE.Vector3());
            this.distance = this.planePosition.distanceTo(cameraPosition)
            if(this.distance < this.width && this.distance < this.height){
                for(let i = 0; i < videos.length; i++){
                    if(videos[i].id === this.data.target){
                        videos[i].setAttribute('src', this.videoURL);
                    }
                }
                this.videoLoaded = true;
            }
        }
    }
})
