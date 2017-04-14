var CreateDecalsTestScene = function (engine) {
	var scene = new BABYLON.Scene(engine);

	//Adding a light
	var light = new BABYLON.HemisphericLight("Hemi", new BABYLON.Vector3(0, 1, 0), scene);

	//Adding an Arc Rotate Camera
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, 1.3, 700, BABYLON.Vector3.Zero(), scene);

	// The first parameter can be used to specify which mesh to import. Here we import all meshes
	BABYLON.SceneLoader.ImportMesh("Jeep", "./Assets/", "Jeep.babylon", scene, function (newMeshes) {
		var jeep = newMeshes[0];

		// Set the target of the camera to the first imported mesh
		camera.target = jeep;

		var decalMaterial = new BABYLON.StandardMaterial("decalMat", scene);
		decalMaterial.diffuseTexture = new BABYLON.Texture("./Assets/impact.png", scene);
		decalMaterial.diffuseTexture.hasAlpha = true;
		decalMaterial.zOffset = -2;

		var onPointerDown = function (evt) {
			if (evt.button !== 0) {
				return;
			}

			// check if we are under a mesh
			var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh === jeep; });
			if (pickInfo.hit) {
				var decalSize = new BABYLON.Vector3(10, 10, 10);

				var newDecal = BABYLON.Mesh.CreateDecal("decal", jeep, pickInfo.pickedPoint, pickInfo.getNormal(true), decalSize);
				newDecal.material = decalMaterial;
			}
		}
		var canvas = engine.getRenderingCanvas();
		canvas.addEventListener("pointerdown", onPointerDown, false);

		scene.onDispose = function () {
			canvas.removeEventListener("pointerdown", onPointerDown);
		}
	});

	return scene;
};