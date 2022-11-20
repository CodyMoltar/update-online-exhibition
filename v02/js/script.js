const enterBtn = document.getElementById('enter-button');
const welcomeScreen = document.getElementById('welcome-screen');
const cameraRig = document.getElementById('cameraRig');
const scene = document.getElementById('aframe-scene')

//REMOVE DEFAULT CAMERA
const wrongCamera = document.querySelectorAll('[camera]')[0];
wrongCamera.remove();
// console.log(wrongCamera);

if (scene.hasLoaded) {
    console.log('loaded the scene');
} else {
    
    scene.addEventListener('loaded', function(){
        console.log('event listened: loaded');
    });
}


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

const INTRO_ACTIVE = false;

if(!INTRO_ACTIVE){
    cameraRig.setAttribute('position', { x: -14, y: 0, z: 0});
    cameraRig.setAttribute('rotation', { x: 0, y: 90, z: 0});
    welcomeScreen.style.display = 'none';
    scene.setAttribute('fog', 'color', '#ebe1d5');
    scene.setAttribute('fog', 'density', '0.01');
}

if(INTRO_ACTIVE){
    if(!console.log(AFRAME.utils.device.isMobile())){
        document.addEventListener('mousemove', introHover);
    }
    
    function introHover(e){
    
        const offset=2;
    
        cameraRig.object3D.rotation.y = THREE.Math.degToRad(map_range( e.clientX, 0, window.innerWidth, 90 + offset,90 - offset));
        cameraRig.object3D.rotation.x = THREE.Math.degToRad(map_range( e.clientY, 0, window.innerHeight, offset,-offset));
    }
    
    enterBtn.addEventListener('click', function(){
    
        enterBtn.classList.remove('button_hover');
        document.removeEventListener('mousemove', introHover);
    
        anime({
            targets:enterBtn,
            opacity:[1, 0],
            easing:'linear',
            complete:function(){
    
                welcomeScreen.style.display = 'none'
                cameraRig.emit(`enter`, null, false);
                scene.emit(`enter`, null, false);
    
                
    
            }
        })
    
    })
}
