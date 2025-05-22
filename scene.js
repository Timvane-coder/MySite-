function anim_candidate_top_back() {
  clearInterval(top_interval);

  if (isMobile() && isPortrait()) {
    camera.position.set(-39.41, 572.79, 141.04);
    camera.rotation.set(-1.34, -0.077, -0.316);
  } else {
    camera.position.set(-19.43, 428.5, 111.8);
    camera.rotation.set(-1.2, -0.27, -0.6);
  }

  var _move = new TWEEN.Tween(camera.position)
    .to(
      {
        x: 79.57688077817748,
        y: 300,
        z: 35.04425838301818,
      },
      1000
    )
    .start();
  var _rot1 = new TWEEN.Tween(camera.rotation)
    .to(
      {
        x: -1.2388952252825272,
        y: 0.6445912708539492,
        z: 1.0500269045892787,
      },
      1000
    )
    .start()
    .onComplete(() => {
      pillar.material.color.set("rgb(0,150,230)");
      var _pivot = new THREE.Object3D();
      _pivot.name = "pivot";
      _pivot.position.set(0, 300, 0);
      _pivot.rotation.set(0, -0.9150000000000007, 0);
      scene.add(_pivot);
      _pivot.attach(camera);
      var _move1 = new TWEEN.Tween(_pivot.position)
        .to({ y: 200 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onUpdate(function () {
          _pivot.rotation.y += 0.015;
          camera.lookAt(0, 200, 0);
          camera.position.x -= 0.5;
          camera.position.z -= 0.3;
        })
        .onComplete(() => {
          scene.attach(camera);
          scene.remove(_pivot);
          light.sub.intensity = 30;
          camera.position.set(45.8, 200, -60);
          camera.rotation.set(0, 2.4, 0);
        });
    });
}

function anim_down() {
  if (isPortrait()) {
    camera.position.set(-17.499584230475314, 640.1, 187.500038711304);
    camera.rotation.set(-1.226319260222524, -0.11498077745995597, -0.3094938249958649);
  } else {
    camera.position.set(-19.43, 428.5, 111.8); // good
    camera.rotation.set(-1.2, -0.27, -0.6);
  }

  var _move = new TWEEN.Tween(camera.position)
    .to({ x: -38, y: 200, z: 57 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();

  var _rot = new TWEEN.Tween(camera.rotation)
    .to({ x: 0, y: -0.37, z: 0 }, 500)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .delay(700)
    .start();
}

function mark_forward() {
  if (mark.ring.parent !== mark) {
    mark.ring.position.copy(mark.body.position);
    mark.ring.position.x += 0.004;
    mark.ring.position.y += 0.03;
    mark.ring.rotation.y = -0.1;
    mark.ring.scale.set(1.04, 1.04, 1.04);
    mark.body.attach(mark.ring);
  }
  clearInterval(top_interval);
  var dest_scale = isMobile() ? 0.15 : 0.2;
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  mark.body.visible = true;
  if (isPortrait()) {
    mark.body.position.set(mark.pos.x + 3, mark.pos.y + 0.5, 50);
  } else {
    mark.body.position.set(mark.pos.x, mark.pos.y, 50);
  }

  mark.body.rotation.set(0, -0.37 - Math.PI, 0);
  mark.body.scale.set(0.01, 0.01, 0.01);

  var _move = new TWEEN.Tween(mark.body.position)
    .to(
      {
        x: -37 + (isPortrait() ? 1.55 : 0),
        y: 200 + (isPortrait() ? 1.2 : 1),
        z: 50,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start();

  var _scale = new TWEEN.Tween(mark.body.scale)
    .to(
      {
        x: isPortrait() ? dest_scale : 0.2,
        y: isPortrait() ? dest_scale : 0.2,
        z: isPortrait() ? dest_scale : 0.2,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start();

  var _rot = new TWEEN.Tween(mark.body.rotation)
    .to({ x: 0, y: -0.37, z: 0 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start()
    .onComplete(() => {
      // start of light animation
      mark.ring.visible = true;
      mark_light_animation();
    });
}

function mark_backward() {
  clearInterval(mark_interval);
  camera.position.set(-38, 200, 57);
  camera.rotation.set(0, -0.37, 0);
  bloomComposer.passes[1].strength = 1.5;
  mark.body.visible = true;
  mark.ring.visible = false;
  var _move = new TWEEN.Tween(mark.body.position)
    .to(
      {
        x: mark.pos.x + (isPortrait() ? 3 : 0),
        y: mark.pos.y + (isPortrait() ? 0.5 : 0),
        z: 50,
      },
      1200
    )
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start();

  var _scale = new TWEEN.Tween(mark.body.scale)
    .to({ x: 0.01, y: 0.01, z: 0.01 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start();
  var _rot = new TWEEN.Tween(mark.body.rotation)
    .to({ x: 0, y: -0.37 - Math.PI, z: 0 }, 1200)
    .easing(TWEEN.Easing.Sinusoidal.In)
    .start()
    .onComplete(() => {
      mark.body.visible = false;
      switch (camera_pos) {
        case 1:
          camera.position.set(-50, 200, -56);
          camera.rotation.set(0, 3.8, 0);
          break;
        case 2:
          camera.position.set(65, 200, 30);
          camera.rotation.set(0, (-Math.PI * 3) / 2 - 0.25, 0);
          break;
        case 3:
          camera.position.set(45.8, 200, -60);
          camera.rotation.set(0, 2.4, 0);
          break;
      }
    });
}

function mark_light_animation() {
  var strength = 0;
  var effect_direct = 1;
  mark_interval = setInterval(function () {
    if (isMobile()) markPosCorrection();
    strength += 0.1 * effect_direct;
    bloomComposer.passes[1].strength = strength;
    if (strength > 8) effect_direct = -1;
    if (strength < -5) effect_direct = 1;
  }, 20);
}

//mobile portait and landscape for mark
function markPosCorrection() {
  if (isMobile()) {
    light.mark.front.position.set(isPortrait() ? -36.4 : -38.2, 201.2, isPortrait() ? 53 : 52);
  }

  mark.body.position.set(-37 + (isPortrait() ? 1.55 : 0), 200 + (isPortrait() ? 1.2 : 1), 50);

  mark.body.scale.set(
    isPortrait() ? 0.15 : 0.2,
    isPortrait() ? 0.15 : 0.2,
    isPortrait() ? 0.15 : 0.2
  );
}

//mobile portait and landscape for top pos
function topPosCorrection() {
  top_interval = setInterval(function () {
    if (isPortrait()) {
      camera.position.set(-39.41, 572.79, 141.04);
      camera.rotation.set(-1.34, -0.077, -0.316);
    } else {
      camera.position.set(-19.43, 428.5, 111.8); // good
      camera.rotation.set(-1.2, -0.27, -0.6);
    }
  }, 50);
}

function darkenNonBloomed(obj) {
  if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    materials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial(obj) {
  if (materials[obj.uuid]) {
    obj.material = materials[obj.uuid];
    delete materials[obj.uuid];
  }
}
