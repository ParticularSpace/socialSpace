import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const SPHERE_COUNT = 2000;
const RADIUS = 1;
const COLOR = "#FFFFFF";
const SIZE = 0.01;

let spherePoints = null;

export function Stars(props) {
  const ref = useRef();

  const rotatePoints = (delta) => {
    ref.current.rotation.x -= delta / 5;
    ref.current.rotation.y -= delta / 10;
  };

  useEffect(() => {
    if (!spherePoints) {
      // Generate once
      spherePoints = random.inSphere(new Float32Array(SPHERE_COUNT), { radius: RADIUS });
    }
  }, []);
  
  useFrame((state, delta) => {
    if (ref.current) {
      rotatePoints(delta);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {spherePoints && (
        <Points ref={ref} positions={spherePoints} stride={3} frustumCulled={false} {...props}>
          <PointMaterial transparent color={COLOR} size={SIZE} sizeAttenuation depthWrite={false} />
        </Points>
      )}
    </group>
  );
}

export default Stars;
