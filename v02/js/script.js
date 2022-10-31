const enterBtn = document.getElementById('enter-button');
const welcomeScreen = document.getElementById('welcome-screen');
const cameraRig = document.getElementById('cameraRig');
const scene = document.getElementById('aframe-scene')


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

if(!console.log(AFRAME.utils.device.isMobile())){
    // document.addEventListener('mousemove', introHover);
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