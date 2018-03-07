const THREE = require('three')
const STLLoader = require('three-stl-loader')(THREE)
const OrbitControls = require('three-orbit-controls')(THREE)

$(document).on("turbolinks:load", function() {
  var model_url_container = $("#model_url");
  if(model_url_container.length) {
    var model_url = model_url_container.html();

    //if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var container, stats;

    var camera, cameraTarget, scene, renderer, control, mesh;

    init();
    animate();

    function init() {

      var preview_box = $('#preview-box');
	    container = document.createElement('div');
      container.setAttribute('id', 'model-preview');
      container.setAttribute('class', 'model-preview');
      preview_box.append(container);

      camera = new THREE.PerspectiveCamera( 35, 1, 0.1, 15 );
	    camera.position.set( 3, 0.15, 3 );


	    cameraTarget = new THREE.Vector3( 0, 0, 0 );

	    scene = new THREE.Scene();
	    scene.background = new THREE.Color( 0x72645b );
	    scene.fog = new THREE.Fog( 0x72645b, 2, 15 );

	    var plane = new THREE.Mesh(
		    new THREE.PlaneBufferGeometry( 40, 40 ),
		    new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
	    );
	    plane.rotation.x = -Math.PI/2;
	    plane.position.y = -0.5;
	    scene.add( plane );

	    plane.receiveShadow = true;

	    var loader = new STLLoader();
	    var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );

	    loader.load( model_url, function ( geometry ) {

		    var meshMaterial = material;
		    if (geometry.hasColors) {
			    meshMaterial = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
		    }

		    mesh = new THREE.Mesh( geometry, meshMaterial );

		    mesh.position.set( 0, -0.5, 0 );
		    mesh.rotation.set( 3 * Math.PI / 2 , 0, 0 );
		    mesh.scale.set( 0.007, 0.007, 0.007 );

		    mesh.castShadow = true;
		    mesh.receiveShadow = true;

		    scene.add( mesh );

	    } );

	    // Lights

	    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

	    addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
	    addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
	    // renderer

	    renderer = new THREE.WebGLRenderer( { antialias: true } );
	    renderer.setPixelRatio( window.devicePixelRatio );
	    //renderer.setSize( window.innerWidth * 0.5, window.innerHeight * 0.5 );
      renderer.setSize( 250 , 250 , false );

	    renderer.gammaInput = true;
	    renderer.gammaOutput = true;

	    renderer.shadowMap.enabled = true;
	    renderer.shadowMap.renderReverseSided = false;

	    container.appendChild( renderer.domElement );

	    // stats

	    //stats = new Stats();
	    //container.appendChild( stats.dom );

	    //

	    $("#model-color").on( 'change', function(e){
        mesh.material.color.setHex( this.value );
      });
      $("#quality_ll").on( 'change', function(e){
        renderer.setSize( 150 , 150 , false );
        console.log("very low")
      });
      $("#quality_l").on( 'change', function(e){
        renderer.setSize( 200 , 200 , false );
        console.log("low")
      });
      $("#quality_m").on( 'change', function(e){
        renderer.setSize( 250 , 250 , false );
        console.log("medium")
      });
      $("#quality_h").on( 'change', function(e){
        renderer.setSize( 375 , 375 , false );
        console.log("high")
      });
      $("#quality_hh").on( 'change', function(e){
        renderer.setSize( 500 , 500 , false );
        console.log("very high")
      });
      controls = new OrbitControls( camera, renderer.domElement );
      controls.enablePan = false;

    }

    function addShadowedLight( x, y, z, color, intensity ) {

	    var directionalLight = new THREE.DirectionalLight( color, intensity );
	    directionalLight.position.set( x, y, z );
	    scene.add( directionalLight );

	    directionalLight.castShadow = true;

	    var d = 1;
	    directionalLight.shadow.camera.left = -d;
	    directionalLight.shadow.camera.right = d;
	    directionalLight.shadow.camera.top = d;
	    directionalLight.shadow.camera.bottom = -d;

	    directionalLight.shadow.camera.near = 1;
	    directionalLight.shadow.camera.far = 4;

	    directionalLight.shadow.mapSize.width = 1024;
	    directionalLight.shadow.mapSize.height = 1024;

	    directionalLight.shadow.bias = -0.005;

    }

    function animate() {

	    requestAnimationFrame( animate );

	    render();
	    //stats.update();

    }

    function render() {

	    var timer = Date.now() * 0.0005;

	    camera.lookAt( cameraTarget );

	    renderer.render( scene, camera );

    }
  }
})
