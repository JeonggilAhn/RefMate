/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect, useState } from 'react';
import PinComponent from './PinComponent';
import PinPopup from './PinPopup';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';
import { useParams } from 'react-router-dom';
import { modalState } from '../../recoil/common/modal';

const A3_WIDTH = 1587;
const A3_HEIGHT = 1123;

const CURSOR_SVG = `
<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#shadow)">
    <path d="M20 6L14.6667 11.3333L9.33337 13.3333L7.33337 15.3333L16.6667 24.6667L18.6667 22.6667L20.6667 17.3333L26 12L20 6Z" fill="white"/>
    <path d="M12 20L4 28" fill="white" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 6L14.6667 11.3333L9.33337 13.3333L7.33337 15.3333L16.6667 24.6667L18.6667 22.6667L20.6667 17.3333L26 12L20 6Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 20L4 28" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
    <filter id="shadow" x="-2" y="-2" width="36" height="36" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
  </defs>
</svg>
`;

// SVG 커서가 지원되지 않을 경우를 대비한 fallback 처리
const getCustomCursor = () => {
  try {
    return `url('data:image/svg+xml;base64,${btoa(CURSOR_SVG)}') 4 28, crosshair`;
  } catch (e) {
    return 'crosshair';
  }
};

const PIN_CURSOR = getCustomCursor();

const BlueprintCanvas = ({
  projectId,
  imageUrl,
  overlayImageUrl,
  overlayOpacity,
  isOverlayVisible,
  isPinButtonEnaled,
  onClickPin,
}) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [pendingPin, setPendingPin] = useState(null);
  const imgRef = useRef(new Image());
  const overlayImgRef = useRef(new Image());
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  const { blueprint_id, blueprint_version_id } = useParams();

  const [pins, setPins] = useRecoilState(pinState);
  const [modal, setModal] = useRecoilState(modalState);

  const adjustImagePosition = () => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / A3_WIDTH;
    const scaleY = canvas.height / A3_HEIGHT;
    const minScale = Math.min(scaleX, scaleY);

    setScale(minScale);
    setPosition({ x: canvas.width / 2, y: canvas.height / 2 });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    adjustImagePosition();

    const ctx = canvas.getContext('2d');
    drawImage(ctx);
  };

  useEffect(() => {
    if (!imageUrl) {
      return;
    }

    imgRef.current.src = imageUrl;
    const canvas = canvasRef.current;

    imgRef.current.onload = () => {
      const ctx = canvas.getContext('2d');
      adjustImagePosition();
      drawImage(ctx);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!overlayImageUrl) {
      return;
    }

    overlayImgRef.current.src = overlayImageUrl;
    const canvas = canvasRef.current;

    overlayImgRef.current.onload = () => {
      const ctx = canvas.getContext('2d');
      adjustImagePosition();
      drawImage(ctx);
    };
  }, [overlayImageUrl]);

  useEffect(() => {
    if (!imageUrl || !overlayImageUrl) {
      return;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [imageUrl, overlayImageUrl]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const drawImage = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (
      !imgRef.current.complete ||
      imgRef.current.naturalWidth === 0 ||
      imgRef.current.naturalHeight === 0
    ) {
      return;
    }

    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);

    ctx.drawImage(
      imgRef.current,
      -A3_WIDTH / 2,
      -A3_HEIGHT / 2,
      A3_WIDTH,
      A3_HEIGHT,
    );

    if (isOverlayVisible) {
      if (
        overlayImgRef.current.complete &&
        overlayImgRef.current.naturalWidth > 0 &&
        overlayImgRef.current.naturalHeight > 0
      ) {
        ctx.globalAlpha = overlayOpacity;
        ctx.drawImage(
          overlayImgRef.current,
          -A3_WIDTH / 2,
          -A3_HEIGHT / 2,
          A3_WIDTH,
          A3_HEIGHT,
        );
        ctx.globalAlpha = 1;
      }
    }

    ctx.restore();
  };

  const handleWheel = (e) => {
    if (isPinButtonEnaled) return;

    const zoomSpeed = 0.1;
    setScale((prev) => {
      const newScale = Math.max(
        0.5,
        prev + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed),
      );
      return newScale;
    });
  };

  const handleMouseDown = (e) => {
    if (isPinButtonEnaled) return;

    setDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isPinButtonEnaled) return;

    if (dragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCanvasClick = (e) => {
    if (!isPinButtonEnaled && !e.ctrlKey) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - position.x) / scale;
    const y = (e.clientY - rect.top - position.y) / scale;

    const pin = {
      has_unread_note: false,
      is_active: false,
      pin_group: {
        pin_group_color: 'violet',
        pin_group_id: 1,
        pingroup_name: '새 핀',
      },
      pin_id: null,
      pin_name: '',
      pin_x: x,
      pin_y: y,
      preview_image_count: 0,
      preview_image_list: [],
      is_visible: true,
      is_open_note: false,
      is_open_image: false,
      pinDetailNotes: [],
      pinDetailImages: [],
    };

    setPendingPin(pin);

    setModal({
      type: 'modal',
      title: '핀 생성',
      content: (
        <PinPopup
          isCreate={true}
          blueprintId={blueprint_id}
          blueprintVersion={blueprint_version_id}
          initialPin={pin}
          onConfirm={handleConfirmPin}
        />
      ),
    });
  };

  const handleConfirmPin = (pin) => {
    const newPin = {
      ...pin,
      is_visible: true,
      is_open_note: false,
      is_open_image: false,
      pinDetailNotes: [],
      pinDetailImages: [],
    };

    setPins((prevPins) => {
      return [...prevPins, newPin];
    });
    setModal(null);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawImage(ctx);
  }, [scale, position, pins, overlayOpacity]);

  return (
    <div className="relative w-full h-full" onWheel={handleWheel}>
      {pins.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${position.x + item.pin_x * scale}px`,
            top: `${position.y + item.pin_y * scale}px`,
            zIndex: 1,
            pointerEvents: 'auto',
            visibility: item.is_visible ? 'visible' : 'hidden',
            transform: `translate(-50%, -50%) scale(${scale})`, // 핀 크기 자동 확대/축소
            transformOrigin: 'center center', // 중심을 기준으로 크기 변경
          }}
        >
          <PinComponent
            blueprintId={blueprint_id}
            blueprintVersion={blueprint_version_id}
            projectId={projectId}
            pin={item}
            onClickPin={() => onClickPin(item)}
          />
        </div>
      ))}

      <canvas
        ref={canvasRef}
        // onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          cursor:
            isPinButtonEnaled || isCtrlPressed
              ? PIN_CURSOR
              : dragging
                ? 'grabbing'
                : 'grab',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default BlueprintCanvas;
