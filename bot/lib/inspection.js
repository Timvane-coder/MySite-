// ============================================================
// INSPECTION CAMERA OFFSETS
// ============================================================

const INSPECTION_OFFSETS = {

    Head:
        new THREE.Vector3(
            2.8,
            1.0,
            3.5
        ),

    LeftArm:
        new THREE.Vector3(
            3.2,
            0.7,
            3.3
        ),

    RightFoot:
        new THREE.Vector3(
            3.0,
            1.3,
            3.2
        )
};


// ============================================================
// GET INSPECTION POSITION
// ============================================================

function calculateInspectionCameraPosition(
    controller
) {

    const bonePosition =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    const offset =
        INSPECTION_OFFSETS[
            controller.inspectionBone
        ] ||
        INSPECTION_OFFSETS.Head;

    return bonePosition
        .clone()
        .add(offset);
}


// ============================================================
// LOOK CAMERA
// ============================================================

function lookAtInspection(
    controller
) {

    const target =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    camera.lookAt(
        target
    );
}


// ============================================================
// GENERIC CAMERA MOVE
// ============================================================

function moveCameraTo(
    position,
    duration,
    target = FORMATION_CENTER
) {

    return new Promise(
        resolve => {

            const start =
                camera.position.clone();

            const destination =
                position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// CAMERA → SPECIFIC AVATAR
// ============================================================

function moveCameraToInspection(
    controller,
    duration = 1800
) {

    return new Promise(
        resolve => {

            const destination =
                calculateInspectionCameraPosition(
                    controller
                );

            const start =
                camera.position.clone();

            const tweenObject = {
                t: 0
            };


            new TWEEN.Tween(
                tweenObject
            )
                .to(
                    {
                        t: 1
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position
                        .lerpVectors(
                            start,
                            destination,
                            tweenObject.t
                        );

                    lookAtInspection(
                        controller
                    );
                })
                .onComplete(() => {

                    camera.position.copy(
                        destination
                    );

                    lookAtInspection(
                        controller
                    );

                    resolve();
                })
                .start();
        }
    );
}


// ============================================================
// PERFORM AVATAR
// ============================================================

async function performAvatar(
    controller
) {

    setStatus(
        `Avatar ${controller.id} — ` +
        `${controller.definition.sentence}`
    );


    // Body animation
    controller.playClip();


    // Facial expression
    controller.expressionDriver.apply(
        controller.definition.expression
    );


    // Gesture
    controller.gestureDriver.setGesture(
        controller.definition.gesture
    );


    // Speech / visemes
    await controller.speechDriver.speak(
        controller.definition.sentence
    );
}


// ============================================================
// AVATAR INSPECTION SHOT DEFINITIONS
// ============================================================
//
// Avatar 1 → side profile
// Avatar 2 → gesture inspection
// Avatar 3 → accessory inspection
// Avatar 4 → face inspection
// Avatar 5 → upper-body inspection
// ============================================================

const AVATAR_INSPECTION_SHOTS = {

    1: {
        type: 'side_profile',
        duration: 2600
    },

    2: {
        type: 'gesture',
        duration: 1800
    },

    3: {
        type: 'accessory',
        duration: 4200
    },

    4: {
        type: 'face',
        duration: 3000
    },

    5: {
        type: 'upper_body',
        duration: 2400
    }
};


function getAvatarInspectionCenter(
    controller
) {

    return controller.model.getWorldPosition(
        new THREE.Vector3()
    );
}


function getAvatarInspectionHead(
    controller
) {

    return getBoneWorldPosition(
        controller,
        'Head'
    );
}


// ============================================================
// SIDE PROFILE
// ============================================================
//
// Camera moves to a clean 90-degree profile while keeping the
// head and upper body in frame.
// ============================================================

async function runAvatarSideProfileInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const target =
        getAvatarInspectionHead(
            controller
        ).add(
            new THREE.Vector3(
                0,
                -0.25,
                0
            )
        );

    const destination =
        center.clone().add(
            new THREE.Vector3(
                4.0,
                1.55,
                0.15
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// GESTURE INSPECTION
// ============================================================
//
// Camera stays close to the upper body/gesture area while the
// avatar performs its configured gesture and speech.
// ============================================================

async function runAvatarGestureInspection(
    controller,
    duration
) {

    const gestureBone =
        getBoneWorldPosition(
            controller,
            controller.inspectionBone
        );

    const destination =
        gestureBone.clone().add(
            new THREE.Vector3(
                2.7,
                0.65,
                2.8
            )
        );

    const target =
        gestureBone.clone().add(
            new THREE.Vector3(
                0,
                0.15,
                0
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// ACCESSORY INSPECTION
// ============================================================
//
// A close orbit keeps the avatar's attached accessories visible
// while the existing avatar performance runs.
// ============================================================

function runAvatarAccessoryOrbit(
    controller,
    duration
) {

    return new Promise(
        resolve => {

            const center =
                getAvatarInspectionCenter(
                    controller
                );

            const target =
                getAvatarInspectionHead(
                    controller
                ).add(
                    new THREE.Vector3(
                        0,
                        -0.45,
                        0
                    )
                );

            const startOffset =
                new THREE.Vector3(
                    4.2,
                    1.8,
                    4.2
                );

            const radius =
                Math.sqrt(
                    startOffset.x *
                    startOffset.x +

                    startOffset.z *
                    startOffset.z
                );

            const startAngle =
                Math.atan2(
                    startOffset.x,
                    startOffset.z
                );

            const state = {
                angle: startAngle
            };


            new TWEEN.Tween(
                state
            )
                .to(
                    {
                        angle:
                            startAngle +
                            Math.PI * 1.25
                    },
                    duration
                )
                .easing(
                    TWEEN.Easing.Cubic.InOut
                )
                .onUpdate(() => {

                    camera.position.x =
                        center.x +
                        Math.sin(
                            state.angle
                        ) *
                        radius;

                    camera.position.z =
                        center.z +
                        Math.cos(
                            state.angle
                        ) *
                        radius;

                    camera.position.y =
                        center.y +
                        1.8 +
                        Math.sin(
                            state.angle
                        ) *
                        0.25;

                    camera.lookAt(
                        target
                    );
                })
                .onComplete(() => {

                    camera.lookAt(
                        target
                    );

                    resolve();
                })
                .start();
        }
    );
}


async function runAvatarAccessoryInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const head =
        getAvatarInspectionHead(
            controller
        );

    const target =
        head.clone().add(
            new THREE.Vector3(
                0,
                -0.45,
                0
            )
        );

    const startPosition =
        center.clone().add(
            new THREE.Vector3(
                4.2,
                1.8,
                4.2
            )
        );

    await moveCameraTo(
        startPosition,
        900,
        target
    );

    const actionPromise =
        performAvatar(
            controller
        );

    const cameraPromise =
        runAvatarAccessoryOrbit(
            controller,
            duration
        );

    await Promise.all([
        actionPromise,
        cameraPromise
    ]);
}


// ============================================================
// FACE INSPECTION
// ============================================================
//
// Slow push toward the head for facial expression and viseme
// inspection.
// ============================================================

async function runAvatarFaceInspection(
    controller,
    duration
) {

    const head =
        getAvatarInspectionHead(
            controller
        );

    const startPosition =
        head.clone().add(
            new THREE.Vector3(
                2.2,
                0.35,
                2.6
            )
        );

    const closePosition =
        head.clone().add(
            new THREE.Vector3(
                1.35,
                0.18,
                1.65
            )
        );

    const target =
        head.clone();

    await moveCameraTo(
        startPosition,
        900,
        target
    );

    const actionPromise =
        performAvatar(
            controller
        );

    const cameraPromise =
        moveCameraTo(
            closePosition,
            duration,
            target
        );

    await Promise.all([
        actionPromise,
        cameraPromise
    ]);
}


// ============================================================
// UPPER-BODY INSPECTION
// ============================================================
//
// Frames chest + head for expression, gesture and speech.
// ============================================================

async function runAvatarUpperBodyInspection(
    controller,
    duration
) {

    const center =
        getAvatarInspectionCenter(
            controller
        );

    const head =
        getAvatarInspectionHead(
            controller
        );

    const destination =
        center.clone().add(
            new THREE.Vector3(
                3.6,
                1.8,
                4.0
            )
        );

    const target =
        head.clone().add(
            new THREE.Vector3(
                0,
                -0.55,
                0
            )
        );

    await moveCameraTo(
        destination,
        duration,
        target
    );

    await performAvatar(
        controller
    );
}


// ============================================================
// INSPECTION SHOT DISPATCHER
// ============================================================

async function inspectAvatar(
    controller
) {

    const config =
        AVATAR_INSPECTION_SHOTS[
            controller.id
        ] || {
            type: 'upper_body',
            duration: 2200
        };

    console.log(
        `Camera → Avatar ${controller.id} → ${config.type}`
    );

    setStatus(
        `Avatar ${controller.id} → ${config.type}`
    );


    switch (config.type) {

        case 'side_profile':

            await runAvatarSideProfileInspection(
                controller,
                config.duration
            );

            break;


        case 'gesture':

            await runAvatarGestureInspection(
                controller,
                config.duration
            );

            break;


        case 'accessory':

            await runAvatarAccessoryInspection(
                controller,
                config.duration
            );

            break;


        case 'face':

            await runAvatarFaceInspection(
                controller,
                config.duration
            );

            break;


        case 'upper_body':

            await runAvatarUpperBodyInspection(
                controller,
                config.duration
            );

            break;


        default:

            await runAvatarUpperBodyInspection(
                controller,
                config.duration
            );
    }


    console.log(
        `Avatar ${controller.id} inspection complete`
    );
}
