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
        this.staticImageURL = './media/videos/' + this.el.id + ".png"
        this.el.setAttribute('src', this.staticImageURL);
        this.el.setAttribute('rotation', '20,0,0')
        this.videoLoopURL = './media/videos/' + this.el.id + "-loop.mp4"
        this.triggerDistance = 10;
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
        this.width = 2;
        this.height = 2;
        // this.el.setAttribute('color', this.data.color);
        this.el.setAttribute(
            'material', {
                src: './media/textures/feet.png',
                transparent: true
            })
        this.el.setAttribute('position', { x: 0, y: 0.01, z: 0 });
        this.el.setAttribute('width', this.width)
        this.el.setAttribute('height', this.height)
        this.videoURL = './media/videos/' + this.data.target + ".mp4"
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

AFRAME.registerComponent('2dvideoplayer', {
    schema:{
        color: {default: '#fff'},
        target: {type: 'string', default: 'none'},
        videowidth: {default: 8},
        videoheight: {default: 4.5},
        planewidth: {default:2},
        planeheight: {default:2},
        triggerdistance: {default: 20}
    },
    init: function(){

        // Create the frame entity
        this.frame = document.createElement('a-entity');
        this.el.appendChild(this.frame);
        this.frame.setAttribute('scale', { x: 0.090, y: 0.115, z: 0.100});
        this.frame.setAttribute('rotation', { x: 20, y: 0, z: -90 });
        this.frame.setAttribute('position', { x: -4.359, y: 3, z: -0.07 });
        this.frame.setAttribute('gltf-model', 'url(./media/3dmodels/frame.glb)')

        // this.frame = document.createElement('a-obj-model');
        // this.el.appendChild(this.frame);
        // this.frame.setAttribute('scale', { x: 0.090, y: 0.115, z: 0.100});
        // this.frame.setAttribute('rotation', { x: 20, y: 0, z: -90 });
        // this.frame.setAttribute('position', { x: -4.359, y: 3, z: -0.07 });
        // this.frame.setAttribute('src', './media/3dmodels/frame.obj')

        // Create the video entity
        this.video = document.createElement('a-video');
        this.el.appendChild(this.video);
        // Set the default image source, width, height, position and rotation
        this.video.setAttribute('src', './media/videos/' + this.data.target + '.png');
        this.video.setAttribute('width', this.data.videowidth);
        this.video.setAttribute('height', this.data.videoheight);
        this.video.setAttribute('position', { x: 0, y: 3, z: 0 });
        this.video.setAttribute('rotation', '20,0,0');

        // Create the plane entity
        this.plane = document.createElement('a-plane');
        this.el.appendChild(this.plane);
        // Set the default image source, widht, height, position and rotation
        this.plane.setAttribute(
            'material', {
                src: './media/textures/feet.png',
                transparent: true
            })
        this.plane.setAttribute('width', '2');
        this.plane.setAttribute('height', '2');
        this.plane.setAttribute('position', { x: 0, y: 0.01, z: 5 });
        this.plane.setAttribute('rotation', '-90,0,0');

        this.videoloaded = false;
        this.looploaded = false;

        this.videoURL = './media/videos/' + this.data.target + '.mp4'
        this.loopURL = './media/videos/' + this.data.target + '-loop.mp4'

    },
    tick: function(){

        if(!this.videoloaded){

            this.planePosition = this.plane.getObject3D("mesh").getWorldPosition(new THREE.Vector3());
            this.distance = this.planePosition.distanceTo(cameraPosition);

            if(!this.looploaded){
                if(this.distance < this.data.triggerdistance && this.distance < this.data.triggerdistance){
                    console.log('loading loop..');
                    this.video.setAttribute('src', this.loopURL);
                    this.looploaded = true;
                }
            }
            else if(this.distance < this.data.planewidth && this.distance < this.data.planeheight){
                console.log('loading video...');
                this.video.setAttribute('src', this.videoURL);
                this.videoloaded = true;
            }

        }

    }
})
