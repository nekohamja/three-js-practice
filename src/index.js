import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// screen size data
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
createBall();

function createBall() {
  const scene = new THREE.Scene();

  // create sphere
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "orange",
    roughness: 0.2,
  });

  // add the mesh(geo + material) to the scene
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // add light (color, intensity, distance)
  const light = new THREE.PointLight(0xffffff, 100, 100);
  light.position.set(0, 10, 10);
  scene.add(light);

  // add camera (fov, aspect ratio, near & far clipping)
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 20;
  scene.add(camera);

  // renderer
  const canvas = document.querySelector(".canvas");
  const render = new THREE.WebGLRenderer({ canvas });
  render.setSize(sizes.width, sizes.height);
  render.setPixelRatio(2);
  render.render(scene, camera);

  //control ball rotation with mouse
  const controller = new OrbitControls(camera, canvas);
  controller.enableDamping = true;
  controller.enablePan = false;
  controller.enableZoom = false;
  controller.autoRotate = true;
  controller.autoRotateSpeed = 5;

  //resize canvas based on screen size
  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    render.setSize(sizes.width, sizes.height);
  });

  //continuously refresh animation frames
  const loop = () => {
    controller.update();
    render.render(scene, camera);
    window.requestAnimationFrame(loop);
  };
  loop();

  animate(mesh);
  mouseEventHandler(mesh);
}

// mouse event change color
function mouseEventHandler(mesh) {
  let mouseDown = false;
  let rgb = [];
  window.addEventListener("mousedown", () => (mouseDown = true));
  window.addEventListener("mouseup", () => (mouseDown = false));
  window.addEventListener("mousemove", (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.height) * 255),
        150,
      ];
      let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
      gsap.to(mesh.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      });
    }
  });
}

function animate(mesh) {
  const tl = gsap.timeline({ defaults: { duration: 1 } });
  tl.set(mesh.scale, { z: 0, x: 0, y: 0 });
  tl.to(mesh.scale, { z: 1, x: 1, y: 1 });
  tl.from("nav", { y: "-100%" }, "<");
  tl.from(".title", { opacity: 0 });
}
