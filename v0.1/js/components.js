let cameraPosition;
let videos;

AFRAME.registerComponent('hide', {
    init: function () {
        console.log('hiding component attached');
        let mesh = this.el.getObject3D('mesh');
        mesh.material.color.set(0x0000ff);
        mesh.material.colorWrite = false; // <================= new
        mesh.renderOrder = 2;  
    }
});
  
AFRAME.registerComponent('show', {
    init: function () {
        console.log('occlusion-show componenent attached');
        let mesh = this.el.getObject3D('mesh');
        mesh.renderOrder = 3;
    }
});

AFRAME.registerComponent('positionlogger', {
    init: function(){
        this.cam = document.getElementById('rig');
        videos = document.getElementsByTagName('a-video');
    },
    tick: function(){
        cameraPosition = this.cam.object3D.getWorldPosition(new THREE.Vector3())
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

        // add the video as a video element to control playback
        this.videoSource = document.createElement('video');
        this.videoSource.id = this.data.target;
        this.videoSource.src = './media/videos/' + this.data.target + '.mp4';
        // this.video.onloadeddata = this.onLoaded.bind(this);
        document.body.appendChild(this.videoSource);

        // Create the frame entity
        this.frame = document.createElement('a-entity');
        this.el.appendChild(this.frame);
        this.frame.setAttribute('scale', { x: 0.090, y: 0.115, z: 0.100});
        this.frame.setAttribute('rotation', { x: 20, y: 0, z: -90 });
        this.frame.setAttribute('position', { x: -4.359, y: 3, z: -0.07 });
        this.frame.setAttribute('gltf-model', 'url(./media/3dmodels/frame.glb)')
        // this.frame.setAttribute('show', '');

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

            // if(!this.looploaded){
            //     if(this.distance < this.data.triggerdistance && this.distance < this.data.triggerdistance){
            //         console.log('loading loop..');
            //         this.video.setAttribute('src', this.loopURL);
            //         this.looploaded = true;
            //     }
            // }
            // else if(this.distance < this.data.planewidth && this.distance < this.data.planeheight){
            //     console.log('loading video...');
            //     this.video.setAttribute('src', this.videoURL);
            //     this.videoloaded = true;
            // }

            
            if(this.distance < this.data.planewidth && this.distance < this.data.planeheight){
                console.log('loading video...');
                this.video.setAttribute('material', 'src', '#' + this.data.target);
                this.videoSource.play();
                this.videoloaded = true;

            }

        }

    }
})

AFRAME.registerComponent('look-at-camera', {
    schema: { type: 'selector' },
  
    init: function () {},
  
    tick: function () {
      this.el.object3D.lookAt(cameraPosition)
    }
  })