import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let raycaster: THREE.Raycaster, mouse: THREE.Vector2;

function App() {
  const ref: React.RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);

  let test = 0.01;

  useEffect(() => {
    if (!ref.current) return;

    // camera size settings
    const cameraViewSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // mouse
        // レイキャスターの初期化(追記部分)
        raycaster = new THREE.Raycaster();

        //マウスベクトルの初期化(追記部分)
        mouse = new THREE.Vector2();
    
        // イベントリスナーの追加(追記部分)
        document.addEventListener('click', onMouseEvent, false);

    // scene
    const scene: THREE.Scene = new THREE.Scene();

    // Clock
    // const clock = new THREE.Clock();

    // camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      50, // FOVを75から50に減少
      cameraViewSize.width / cameraViewSize.height,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10); // カメラ位置を調整
    
    // renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: ref.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(cameraViewSize.width, cameraViewSize.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // light
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
      0xffffff,
      1.8
    );
    scene.add(ambientLight);
    const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
      0xffffff,
      1.2
    );
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // grid (本番環境ではコメントアウトすること)
    const gridHelper: THREE.GridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // model loader
    const fbxloader: FBXLoader = new FBXLoader();
    // let mixer: THREE.AnimationMixer;
    const loadedModels: THREE.Object3D[] = []; // Explicitly define the type
    const stageModels: THREE.Object3D[] = [];

    function loadFBXModel(_filename: string, _posX: number, _posY: number, _posZ: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.scale.set(_scale, _scale, _scale);
        loadedModels.push(object); // Store the model in the array

        scene.add(object);
      });
    }

    function loadFBXModelAsStage(_filename: string, _posX: number, _posY: number, _posZ: number, _scale: number) {
      fbxloader.load(_filename, (object) => {
        object.position.set(_posX, _posY, _posZ);
        object.scale.set(_scale, _scale, _scale);
        stageModels.push(object); // Store the model in the array

        scene.add(object);
      });
    }

    function loadMultipleFBXModels(_filename: string, _count: number, _scale: number) {
      for (let i = 0; i < _count; i++) {
        const posX = Math.random() * 10 - 5; // Random X position between -50 and 50
        const posY = Math.random() * 10 - 5; // Random Y position between -50 and 50
        const posZ = Math.random() * 10 - 5; // Random Z position between -50 and 50

        loadFBXModel(_filename, posX, posY, posZ, _scale);
      }
    }

    loadMultipleFBXModels("/react/models/car03.fbx", 3, 0.01);
    loadMultipleFBXModels("/react/models/car02.fbx", 3, 0.01);
    loadMultipleFBXModels("/react/models/car01.fbx", 3, 0.01);

    loadFBXModel("/react/models/niku.fbx", 0, 0, 0, 0.05); //使用例
    loadFBXModel("/react/models/tamanegi.fbx", 2, 0, 2, 0.05);

    loadFBXModelAsStage("/react/models/stage01.fbx", 0, 0, 0, 0.02);


    // オブジェクトが読み込まれた後にカメラの位置を自動調整
    /*
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= 1.5; // 少し余裕を持たせる
    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);
    controls.target.copy(center);
    */
    //カメラ関連、上の記述を参考に

    // イベントリスナーに対応する処理(追記部分)
function onMouseEvent(event: { preventDefault: () => void; clientX: number; clientY: number; }) {
  event.preventDefault();

  // 座標を正規化する呪文
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // レイキャスティングでマウスと重なるオブジェクトを取得
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  // 取得したオブジェクトの色を青色に変える
  for (let i = 0; i < intersects.length; i++) {
      //intersects[i].object.rotation.x += 10;
  }
  intersects[0].object.rotation.x += 1;
  
  //"a"という名前ならば追加で移動
  if(intersects[0].object.name == "a"){
    intersects[0].object.position.x += 100;
  }
  //"a"という名前を、クリックしたオブジェクト（もっとも近い）に付与
  //今後の展望、食べ物タグや背景タグを活用し、食べ物だけクリックして回収可能にするなどの運用をする。生成時に名づける。また、時間経過で焦げるときにも使う。
  //例えば、raw,cooked,burned,car,background,effect など
  intersects[0].object.name = "a";
}

    // 初回実行
    tick();

    function tick() {
      requestAnimationFrame(tick);
      loadedModels.forEach((model) => {
        model.rotation.y += test; // Rotate the loaded model
        model.position.y += test; // Translate the loaded model
      });

      renderer.render(scene, camera); // レンダリング
    }

    // リサイズ対応
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // クリックイベントリスナーを追加
    // クリックで箱が下向きに移動する
    window.addEventListener("click", () => {
      test = -0.01;
    });

    // クリーンアップ
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", () => {
      });
    };
  },);

  return (
    <main style={{ width: "100%",height:"100%" }}>
      <canvas ref={ref} style={{ width: "100%",height:"100%" }} />
    </main>
  );
}

export default App;
