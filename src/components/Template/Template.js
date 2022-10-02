/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import { useLoading } from '../../lib/loading';
import useApi from '../../hooks/useApi';
import issLocation from '../../api/iss-now';
import issPath from '../../api/iss-path';
import calcPosFromLatLonRad from '../../utils/calcPosFromLatLong';


const Template = () => {

  const scene = new THREE.Scene();
  //Groups
  const iss = new THREE.Group();
  const earth = new THREE.Group();

  const mountRef = useRef(null);
  const loading = useLoading();

  const [issInfo, setIssInfo] = useState({
    latitude: 0.0,
    longitude: 0.0,
    altitude: 0.0,
    velocity: 0.0,
  });
  const getIssLocationNow = useApi(issLocation.getIssLocationNow);
  const getIssPathNow = useApi(issPath.getIssPath);

  var position_original;
  var position_current;
  var positions = [];
  var interval_paint;
  // TODO: sacar a un parametro el tiempo de refresco y que se calcule solo

  const getIssLocation = async () => {
    const issLocation = await getIssLocationNow.request();
    var { altitude, latitude, longitude, velocity } = issLocation.data;

    position_current = { altitude, latitude, longitude, velocity }; 
    if (position_original == null) {
      position_original = position_current;
    }

    var altitude_dif  = (position_current.altitude - position_original.altitude) / 20;
    var latitude_dif  = (position_current.latitude - position_original.latitude) / 20;
    var longitude_dif = (position_current.longitude - position_original.longitude) / 20;
    var velocity_dif  = (position_current.velocity - position_original.velocity) / 20;
    altitude  = position_original.altitude;
    latitude  = position_original.latitude;
    longitude = position_original.longitude;
    velocity  = position_original.velocity;
    for (var i = 0; i < 20; i++) {
      positions.push( {altitude, latitude, longitude, velocity }); 
      altitude  = altitude  + altitude_dif;
      latitude  = latitude  + latitude_dif;
      longitude = longitude + longitude_dif;
      velocity  = velocity  + velocity_dif;
    }
    position_original = position_current;

    if (interval_paint == null) {
      interval_paint = setInterval(() => paintIssLocation(), 500);
    }
  };

  const paintIssLocation = async () => {

    var position_current = positions.shift();

    setIssInfo( position_current );

    const pos = calcPosFromLatLonRad({
      lat: position_current.latitude,
      lon: position_current.longitude,
      radius: 1,
    });

    iss.position.set(pos.x, pos.y, pos.z);
  }
  
  const getIssPath = async () => {
    const issPath = await getIssPathNow.request();
    const data = issPath.data;

    const points = [];
    for (const property in data) {
      const { altitude, latitude, longitude, velocity } = data[property];
      const pos = calcPosFromLatLonRad({
        lat: latitude,
        lon: longitude,
        radius: 1,
      });
  
      points.push( new THREE.Vector3( pos.x, pos.y, pos.z ) );
    }

    console.log ("Time: " + (new Date().getTime()));

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    scene.add(curveObject);
  };


  useEffect(() => {
    //Data from the canvas
    const currentRef = mountRef.current;
    const { clientWidth: width, clientHeight: height } = currentRef;

    //Scene, camera, renderer
    const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
    scene.add(camera);
    camera.position.set(3, 3, 3);
    camera.lookAt(new THREE.Vector3());

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    currentRef.appendChild(renderer.domElement);

    //PAint path
    getIssPath();

    //Interval update position
    getIssLocation();
    const interval = setInterval(() => getIssLocation(), 10000);

    //OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    //Resize canvas
    const resize = () => {
      renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
      camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);

    //Draco Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./draco/');

    //GLTF Loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    //ISS Model
    gltfLoader.load(
      './models/iss/issDraco.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.005, 0.005, 0.005);
        iss.add(gltf.scene);
        scene.add(iss);
      },
      () => {
        loading.navigate(true);
      }
    );

    //Earth Model
    gltfLoader.load(
      './models/earth/earthDraco.gltf',
      (gltf) => {
        gltf.scene.scale.set(0.02, 0.02, 0.02);
        gltf.scene.rotateY(-4.7);
        earth.add(gltf.scene);
        scene.add(earth);
        loading.navigate(false);
      },
      () => {
        loading.navigate(true);
      },
      () => {
        loading.navigate(false);
      }
    );

    //Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(6, 6, 6);
    scene.add(pointLight);

    //Animate the scene
    const animate = () => {
      orbitControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      currentRef.removeChild(renderer.domElement);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div
        className="Contenedor3D"
        ref={mountRef}
        style={{ width: '100%', height: '100vh' }}
      ></div>

      {!loading.loading && (
        <section
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 1,
            marginRight: 15,
            marginTop: 15,
            padding: '1em',
            width: 148,
            color: '#000',
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '.5em',
            fontSize: 12,
            lineHeight: 1.2,
          }}
        >
          <p>
            <strong>Localización actual:</strong>
          </p>
          <span>{`${issInfo.latitude.toFixed(4)}, ${issInfo.longitude.toFixed(
            4
          )}`}</span>

          <br />
          <br />

          <p>
            <strong>Altitud:</strong>
          </p>
          <span>{`${issInfo.altitude.toFixed(4)} Km`}</span>

          <br />
          <br />

          <p>
            <strong>Velocidad:</strong>
          </p>
          <span>{`${issInfo.velocity.toFixed(4)} Km/h`}</span>
        </section>
      )}
    </>
  );
};

export default Template;
