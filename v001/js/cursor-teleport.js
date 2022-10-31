AFRAME.registerComponent('cursor-teleport', {
    schema: {
      cameraHead: { type: 'string', default: '' },
      cameraRig: { type: 'string', default: '' },
      collisionEntities: { type: 'string', default: '' },
      ignoreEntities: { type: 'string', default: '' },
      landingMaxAngle: { default: '45', min: 0, max: 360 },
      landingNormal: { type: 'vec3', default: {x: 0, y: 0.2, z: 0} }
    },
    init: function () {
      var camrig = this;
  
      // platform detect
      camrig.mobile = AFRAME.utils.device.isMobile();
  
      // main app
      camrig.scene = this.el.sceneEl;
      camrig.canvas = camrig.scene.renderer.domElement;
      //console.log(this)
  
      // camera
      document.querySelector(this.data.cameraHead).object3D.traverse(function (child) {
        if (child instanceof THREE.Camera) {
          camrig.cam = child;
        }
      });
  
      camrig.camPos = new THREE.Vector3();
      camrig.camRig = document.querySelector(this.data.cameraRig).object3D;
      camrig.camPos = camrig.camRig.position;
  
      //collision
      camrig.rayCaster = new THREE.Raycaster();
      camrig.referenceNormal = new THREE.Vector3();
      camrig.rayCastObjects = [];
  
      // Update collision normal
      camrig.referenceNormal.copy(this.data.landingNormal);
  
      // teleport indicator
      var geo = new THREE.RingGeometry(.25, .3, 32, 1);
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, .02, 0);
      var mat = new THREE.MeshBasicMaterial();
      camrig.teleportIndicator = new THREE.Mesh(geo, mat);
      camrig.scene.object3D.add(camrig.teleportIndicator);
  
      // transition
      camrig.transitioning = false;
      camrig.transitionProgress = 0;
      camrig.transitionSpeed = .01;
      camrig.transitionCamPosStart = new THREE.Vector3();
      camrig.transitionCamPosEnd = new THREE.Vector3();
  
      camrig.updateRaycastObjects = function () {
  
        // updates the array of meshes we will need to raycast to
  
        // clear the array of any existing meshes
        camrig.rayCastObjects = [];
  
        if (this.data.collisionEntities != '') {
          // traverse collision entities and add their meshes to the rayCastEntities array.
          var collisionEntities = camrig.scene.querySelectorAll(this.data.collisionEntities);
  
          collisionEntities.forEach(e => {
            e.object3D.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                // mark this mesh as a collision object
                child.userData.collision = true;
                camrig.rayCastObjects.push(child);
              }
            });
          });
        } else {
          // if no collision entities are specified, create a default ground plane collision.
          var geo = new THREE.PlaneGeometry(50, 50, 1);
          geo.rotateX(-Math.PI / 2);
          var mat = new THREE.MeshNormalMaterial();
          var collisionMesh = new THREE.Mesh(geo, mat);
          // mark this mesh as a collision object
          collisionMesh.userData.collision = true;
          camrig.rayCastObjects.push(collisionMesh);
        }
  
        // We may need some entities to be seen by the raycaster even though they are not teleportable.
        // This prevents the user from unnesserily teleporting when clicking things like buttons or UI.
        
        if(this.data.ignoreEntities != '') {
          var ignoreEntities = camrig.scene.querySelectorAll(this.data.ignoreEntities);
          ignoreEntities.forEach(e => {
            e.object3D.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                camrig.rayCastObjects.push(child);
              }
            });
          });
        }
      }
  
      function getMouseState(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        if (e.clientX != null) {
          return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          }
        } else if (e.touches[0] != null) {
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
          }
        }
      }
  
      camrig.getTeleportPosition = function (mouse_x, mouse_y) {
  
        if (camrig.rayCastObjects.length != 0) {
          if (camrig.hasOwnProperty('cam') && camrig.hasOwnProperty('canvas')) {
                    camrig.teleportIndicator.visible = false;
            var cam = camrig.cam;
            var rect = camrig.canvas.getBoundingClientRect();
            var mouse = new THREE.Vector2();
  
            mouse.x = (mouse_x / (rect.right - rect.left)) * 2 - 1;
            mouse.y = -(mouse_y / (rect.bottom - rect.top)) * 2 + 1;
  
            camrig.rayCaster.setFromCamera(mouse, cam);
            var intersects = camrig.rayCaster.intersectObjects(camrig.rayCastObjects);
  
            if (intersects.length != 0 && camrig.isValidNormalsAngle(intersects[0].face.normal)) {
              if (intersects[0].object.userData.collision == true) {
                return intersects[0].point;
              }
              return false
            } else {
              return false
            }
          } else {
            return false
          }
        } else {
          return false
        }
      }
  
      camrig.isValidNormalsAngle = function (collisionNormal) {
        var angleNormals = camrig.referenceNormal.angleTo(collisionNormal);
              camrig.teleportIndicator.visible = true;
        return (THREE.Math.RAD2DEG * angleNormals <= this.data.landingMaxAngle);
      }
  
      camrig.transition = function (destPos) {
        camrig.transitionProgress = 0;
  
        camrig.transitionCamPosEnd.x = destPos.x;
        camrig.transitionCamPosEnd.y = destPos.y;
        camrig.transitionCamPosEnd.z = destPos.z;
  
        camrig.transitionCamPosStart.x = camrig.camPos.x;
        camrig.transitionCamPosStart.y = camrig.camPos.y;
        camrig.transitionCamPosStart.z = camrig.camPos.z;
  
        camrig.transitioning = true;
      }
  
      function mouseMove(e) {
        var mouseState = getMouseState(camrig.canvas, e);
  
        camrig.mouseX = mouseState.x;
        camrig.mouseY = mouseState.y;
  
      }
  
      function mouseDown(e) {
        camrig.updateRaycastObjects();
  
        var mouseState = getMouseState(camrig.canvas, e);
        camrig.mouseX = mouseState.x;
        camrig.mouseY = mouseState.y;
  
        camrig.mouseXOrig = mouseState.x;
        camrig.mouseYOrig = mouseState.y;
  
      }
  
      function mouseUp(e) {
        if (camrig.mouseX == camrig.mouseXOrig && camrig.mouseY == camrig.mouseYOrig) {
          var pos = camrig.getTeleportPosition(camrig.mouseX, camrig.mouseY);
          if (pos) {
            camrig.teleportIndicator.position.x = pos.x;
            camrig.teleportIndicator.position.y = pos.y;
            camrig.teleportIndicator.position.z = pos.z;
            camrig.transition(pos);
          }
        }
      }
  
      camrig.updateRaycastObjects();
  
      // event listeners
      camrig.canvas.addEventListener('mousedown', mouseDown, false);
      camrig.canvas.addEventListener('mousemove', mouseMove, false);
      camrig.canvas.addEventListener('mouseup', mouseUp, false);
      camrig.canvas.addEventListener('touchstart', mouseDown, false);
      camrig.canvas.addEventListener('touchmove', mouseMove, false);
      camrig.canvas.addEventListener('touchend', mouseUp, false);
  
      // helper functions
      camrig.easeInOutQuad = function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      }
    },
    tick: function () {
      var camrig = this;
      if (!camrig.transitioning && !camrig.mobile) {
        var pos = camrig.getTeleportPosition(camrig.mouseX, camrig.mouseY);
        if (!camrig.mobile && pos) {
          camrig.teleportIndicator.position.x = pos.x;
          camrig.teleportIndicator.position.y = pos.y;
          camrig.teleportIndicator.position.z = pos.z;
        }
      }
      if (camrig.transitioning) {
        camrig.transitionProgress += camrig.transitionSpeed;
  
        // set camera position
        camrig.camPos.x = camrig.transitionCamPosStart.x + ((camrig.transitionCamPosEnd.x - camrig.transitionCamPosStart.x) * camrig.easeInOutQuad(camrig.transitionProgress));
        camrig.camPos.y = camrig.transitionCamPosStart.y + ((camrig.transitionCamPosEnd.y - camrig.transitionCamPosStart.y) * camrig.easeInOutQuad(camrig.transitionProgress));
        camrig.camPos.z = camrig.transitionCamPosStart.z + ((camrig.transitionCamPosEnd.z - camrig.transitionCamPosStart.z) * camrig.easeInOutQuad(camrig.transitionProgress));
  
        if (camrig.transitionProgress >= 1) {
          camrig.transitioning = false;
        }
      }
    }
  });