import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Plane } from '@react-three/drei';
import { TextureLoader, RepeatWrapping, LinearFilter } from 'three';
import Icon from '../components/common/Icon';
import MainBlue from '../assets/images/MainBlue.svg';
import MainGreen from '../assets/images/MainGreen.svg';
import MainRed from '../assets/images/MainRed.svg';
import MainYellow from '../assets/images/MainYellow.svg';
import MainBlueprint from '../assets/images/MainBlueprint.jpg';

// WebGL 컨텍스트 복구 핸들러
function ContextHandler() {
  const { gl } = useThree();

  useEffect(() => {
    function handleContextLost(event) {
      event.preventDefault();
      console.warn('WebGL context lost. Trying to restore...');
    }

    function handleContextRestored() {
      console.log('WebGL context restored!');
    }

    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener(
      'webglcontextrestored',
      handleContextRestored,
      false,
    );

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
}

// 📝 3D 도면 컴포넌트 (도면 크기 조정)
function Paper3D({ setPaperRef }) {
  const paperRef = useRef();
  const texture = useLoader(TextureLoader, MainBlueprint);

  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.minFilter = LinearFilter;

  useEffect(() => {
    if (paperRef.current) setPaperRef(paperRef);
  }, [setPaperRef]);

  useFrame(() => {
    if (paperRef.current) paperRef.current.rotation.x = -Math.PI / 4;
  });

  return (
    <mesh ref={paperRef} position={[0, -10, 0]}>
      <Plane args={[20, 14.4]} />
      {texture ? (
        <meshBasicMaterial attach="material" map={texture} />
      ) : (
        <meshBasicMaterial color="#e0e0e0" />
      )}
    </mesh>
  );
}

// 📝 메인 애니메이션 컴포넌트
export default function Animation() {
  const paperRef = useRef(null);
  const pinsRef = useRef([]);
  const imagesRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // ✅ 핀 크기 & 위치 조정
  const [pins] = useState([
    {
      id: 'pin-1',
      x: -12,
      y: 5,
      color: '#F8D477',
      images: [
        {
          id: 'img-1',
          src: MainYellow,
          top: '-50px',
          left: '',
          right: '85px',
          bottom: '',
        },
      ],
    },
    {
      id: 'pin-2',
      x: 10,
      y: 7,
      color: '#87B5FA',
      images: [
        {
          id: 'img-2',
          src: MainBlue,
          top: '-90px',
          left: '75px',
          right: '',
          bottom: '',
        },
      ],
    },
    {
      id: 'pin-3',
      x: 5,
      y: -6,
      color: '#ED3131',
      images: [
        {
          id: 'img-3',
          src: MainRed,
          top: '-220px',
          left: '80px',
          right: '',
          bottom: '',
        },
      ],
    },
    {
      id: 'pin-4',
      x: -8,
      y: -3,
      color: '#65B08E',
      images: [
        {
          id: 'img-4',
          src: MainGreen,
          top: '-300px',
          left: '',
          right: '-80px',
          bottom: '',
        },
      ],
    },
  ]);

  // 한 번만 실행되는 애니메이션
  useEffect(() => {
    if (!isLoaded || !paperRef.current || animationCompleted) return;

    // 초기 상태 설정
    paperRef.current.position.y = -40;
    paperRef.current.rotation.x = -Math.PI / 2;

    pinsRef.current.forEach((pin) =>
      gsap.set(pin, { y: -100, opacity: 0, scale: 0.7, display: 'none' }),
    );
    imagesRef.current
      .flat()
      .forEach((img) =>
        gsap.set(img, { y: -50, opacity: 0, scale: 0.8, display: 'none' }),
      );

    // 애니메이션 시작
    const tl = gsap.timeline({ onComplete: () => setAnimationCompleted(true) });

    // 1️⃣ 도면 애니메이션
    tl.to(paperRef.current.position, {
      y: 0,
      duration: 2,
      ease: 'power3.out',
      onUpdate: function () {
        if (paperRef.current) {
          const progress = this.progress();
          paperRef.current.rotation.x = -Math.PI / 2 + (Math.PI / 4) * progress;
        }
      },
    })
      // 2️⃣ 핀 애니메이션 (크기 키움)
      .to(
        pinsRef.current.filter(Boolean),
        {
          y: 0,
          opacity: 1,
          scale: 1, // ✅ 핀 크기 증가
          display: 'flex',
          duration: 1.5,
          stagger: 0.4,
          ease: 'elastic.out(1, 0.5)',
        },
        '-=0.5',
      )
      // 3️⃣ 이미지 애니메이션 (고정된 거리 유지)
      .to(
        imagesRef.current.flat().filter(Boolean),
        {
          y: 0,
          opacity: 1,
          scale: 1,
          display: 'block',
          duration: 1,
          stagger: 0.3,
          ease: 'power2.out',
        },
        '-=0.3',
      );
  }, [isLoaded, animationCompleted]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-center bg-gray-100">
      <Canvas camera={{ position: [0, 10, 20], fov: 50 }}>
        <ContextHandler />
        <ambientLight intensity={0.5} />
        <Paper3D
          setPaperRef={(ref) => {
            paperRef.current = ref.current;
            setIsLoaded(true);
          }}
        />
      </Canvas>

      {/* 📌 핀들 (크기 증가) */}
      {pins.map((pin, pinIndex) => (
        <div
          key={pin.id}
          ref={(el) => (pinsRef.current[pinIndex] = el)}
          className="absolute flex items-center justify-center w-10 h-10 hidden"
          style={{
            left: `${50 + pin.x * 2}%`,
            top: `${50 + pin.y * 2}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <Icon name="IconTbPinFill" color={pin.color} />

          {/* 📌 각 핀의 이미지들 (크기 증가) */}
          {pin.images.map((image, imgIndex) => {
            const isLeft = pin.x < 0;
            return (
              <div
                key={image.id}
                ref={(el) => {
                  if (!imagesRef.current[pinIndex])
                    imagesRef.current[pinIndex] = [];
                  imagesRef.current[pinIndex][imgIndex] = el;
                }}
                className="absolute shadow-lg hidden"
                style={{
                  left: isLeft ? '-220px' : '60px', // ✅ 고정값 증가
                  top: image.top,
                  bottom: image.bottom,
                  left: image.left,
                  right: image.right,
                  width: '200px',
                  height: '270px',
                  transform: 'none',
                  zIndex: 5,
                  borderRadius: '7px',
                }}
              >
                <img
                  src={image.src}
                  alt={`Note for ${pin.id}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
