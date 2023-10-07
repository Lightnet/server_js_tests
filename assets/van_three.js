/*
  Information:
    vanjs main client entry point
*/
//import * as THREE from 'three';
import * as THREE from 'https://unpkg.com/three@0.157.0/build/three.module.js';
import van from "https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.1.min.js";
const {button, canvas, input, label, div, script, pre, p, ul, li, a} = van.tags;

const ThreeEL = () => {

  //const threeCanvas = canvas();
  const threeCanvas = div();

  function initThree(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild( renderer.domElement );
    threeCanvas.append(renderer.domElement )

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    animate();
    console.log("init threejs")
  }

  initThree()

  return div(
    threeCanvas
  )
}

van.add(document.body, ThreeEL())

/*
const renderEL = () => {

  function init(){
    //const renderer = new THREE.WebGLRenderer();
    console.log(document.getElementById('test'));//null
  }

  init();

  return div(
    div({id:'test'}) //check if added to element
  )
}
van.add(document.body, renderEL())
*/

const renderEL = () => {

  const render = div({id:'test'})
  function init(){
    //const renderer = new THREE.WebGLRenderer();
    console.log(render);//
  }

  init();

  return div(
    div(
      render
    )
  )
}
van.add(document.body, renderEL())