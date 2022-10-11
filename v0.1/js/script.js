const locations = document.getElementById('legend-items').children;
const rig = document.getElementById('rig');

for(let i = 0; i < locations.length; i++){
    console.log(locations[i]);

    const target = locations[i].dataset.location;
    
    locations[i].addEventListener('click', function(){
        console.log(target);
        console.log(cameraPosition);
        // rig.setAttribute('animation', 'property: position; from: ${cameraPosition}; to: ${target}; dur: 700')
    })

}