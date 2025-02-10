/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect, useState } from 'react';
import PinComponent from './PinComponent';
import PinPopup from './PinPopup';
import { useRecoilState } from 'recoil';
import { pinState } from '../../recoil/blueprint';

const A3_WIDTH = 1587; // A3 크기 (픽셀 단위)
const A3_HEIGHT = 1123; // A3 크기 (픽셀 단위)

const BlueprintCanvas = ({
  imageUrl,
  overlayImageUrl,
  overlayOpacity,
  isOverlayVisible,
  isPinButtonEnaled,
  onClickInfoButton,
}) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [pendingPin, setPendingPin] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imgRef = useRef(new Image());
  const overlayImgRef = useRef(new Image());

  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  const [pins, setPins] = useRecoilState(pinState);

  const adjustImagePosition = () => {
    const canvas = canvasRef.current;
    const scaleX = canvas.width / A3_WIDTH;
    const scaleY = canvas.height / A3_HEIGHT;
    const minScale = Math.min(scaleX, scaleY);

    setScale(minScale);
    setPosition({ x: canvas.width / 2, y: canvas.height / 2 });
  };

  useEffect(() => {
    if (!imageUrl) {
      return;
    }

    if (!overlayImageUrl) {
      return;
    }

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      adjustImagePosition();

      const ctx = canvas.getContext('2d');
      drawImage(ctx);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    imgRef.current.src = imageUrl;
    overlayImgRef.current.src = overlayImageUrl;

    imgRef.current.onload = () => {
      const ctx = canvas.getContext('2d');

      adjustImagePosition();
      drawImage(ctx);
    };

    overlayImgRef.current.onload = () => {
      const ctx = canvas.getContext('2d');

      adjustImagePosition();
      drawImage(ctx);
    };

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [imageUrl, overlayImageUrl]);

  const drawImage = (ctx) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    ctx.restore();
  };

  const handleWheel = (e) => {
    if (!isPinButtonEnaled) {
      const zoomSpeed = 0.1;
      setScale((prev) =>
        Math.max(0.5, prev + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)),
      );
    }
  };

  const handleMouseDown = (e) => {
    if (!isPinButtonEnaled) {
      setDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isPinButtonEnaled && dragging) {
      setPosition({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleCanvasClick = (e) => {
    if (!isPinButtonEnaled) {
      return; // 확대/축소 모드에서는 핀 추가 비활성화
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - position.x) / scale;
    const y = (e.clientY - rect.top - position.y) / scale;

    setPendingPin({
      has_unread_note: false,
      is_active: false,
      pin_group: {
        pin_group_color: 'violet',
        pin_group_id: '1',
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
    });

    setIsPopupOpen(true);
  };

  const handleConfirmPin = (name, groupId, groupColor, pinId) => {
    if (!pendingPin) return;

    const newPin = {
      ...pendingPin,
      pin_name: name,
      pin_group: {
        pin_group_id: groupId,
        pin_group_color: groupColor,
      },
      pin_id: pinId,
    };

    setPins((prevPins) => {
      console.log('잘봐라', [...prevPins, newPin]);
      return [...prevPins, newPin];
    });
    setPendingPin(null);
    setIsPopupOpen(false);
  };

  const handleCancelPin = () => {
    setPendingPin(null);
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawImage(ctx);
  }, [scale, position, pins, overlayOpacity]);

  return (
    <div className="relative w-full h-full">
      {pins.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${position.x + item.pin_x * scale}px`,
            top: `${position.y + item.pin_y * scale}px`,
            zIndex: 3,
            pointerEvents: 'auto',
            visibility: item.is_visible ? 'visible' : 'hidden',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <PinComponent
            blueprintId={blueprint_id}
            blueprintVersion={blueprint_version_id}
            pin={item}
            onClickInfoButton={() => onClickInfoButton(item)}
          />
        </div>
      ))}
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          border: '1px solid black',
          cursor: !isPinButtonEnaled
            ? dragging
              ? 'grabbing'
              : 'grab'
            : 'default',
          width: '100%',
          height: '100%',
        }}
      />
      {isPopupOpen && (
        <div style={{ zIndex: 50 }}>
          <PinPopup
            blueprintId={blueprint_id}
            blueprintVersion={blueprint_version_id}
            initialPin={pendingPin}
            onConfirm={handleConfirmPin}
            onCancel={handleCancelPin}
          />
        </div>
      )}
    </div>
  );
};

export default BlueprintCanvas;
