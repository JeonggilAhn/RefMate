/* eslint-disable react-hooks/exhaustive-deps */

import React, { useRef, useEffect, useState } from 'react';
import PinComponent from './PinComponent';
import PinPopup from './PinPopup';

const A3_WIDTH = 1587; // A3 크기 (픽셀 단위)
const A3_HEIGHT = 1123; // A3 크기 (픽셀 단위)

const BlueprintCanvas = ({
  imageUrl,
  isPinButtonEnaled,
  initialPins,
  isAllPinVisible,
  isSidebarOpen,
}) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [pins, setPins] = useState([]);
  const [pendingPin, setPendingPin] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const imgRef = useRef(new Image());

  const blueprint_id = 1;
  const blueprint_version_id = 1987029227680993;

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const prevWidth = canvas.width;
      const prevHeight = canvas.height;

      canvas.width = canvas.parentElement.parentElement.clientWidth;
      canvas.height = canvas.parentElement.parentElement.clientHeight;

      const deltaX = (canvas.width - prevWidth) / 2;
      const deltaY = (canvas.height - prevHeight) / 2;

      setPosition((prevPos) => ({
        x: prevPos.x + deltaX,
        y: prevPos.y + deltaY,
      }));

      const ctx = canvas.getContext('2d');
      drawImage(ctx);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    imgRef.current.src = imageUrl;
    imgRef.current.onload = () => {
      const scaleX = A3_WIDTH / imgRef.current.width;
      const scaleY = A3_HEIGHT / imgRef.current.height;
      const initialScale = Math.min(1, Math.min(scaleX, scaleY) * 0.9); // 90% 크기로 제한
      setScale(initialScale);

      setPosition({ x: canvas.width / 2, y: canvas.height / 2 });

      const ctx = canvas.getContext('2d');
      drawImage(ctx, canvas.width / 2, canvas.height / 2, initialScale);
    };

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [imageUrl]);

  const drawImage = (
    ctx,
    x = position.x,
    y = position.y,
    customScale = scale,
  ) => {
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(x, y);

    ctx.scale(customScale, customScale);
    ctx.drawImage(
      imgRef.current,
      -A3_WIDTH / 2,
      -A3_HEIGHT / 2,
      A3_WIDTH,
      A3_HEIGHT,
    );

    ctx.restore();
  };

  const handleWheel = (e) => {
    e.preventDefault();
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
    });

    setIsPopupOpen(true);
  };

  const handleConfirmPin = (name, groupId, groupColor) => {
    if (!pendingPin) return;

    const newPin = {
      ...pendingPin,
      pin_name: name,
      pin_group: { pin_group_id: groupId, pin_group_color: groupColor },
    };

    setPins((prevPins) => [...prevPins, newPin]);
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
  }, [scale, position, pins]);

  useEffect(() => {
    // 목업 데이터 이상해서 잠시 주석 처리
    // setPins(initialPins);
  }, [initialPins]);

  return (
    <div className="relative w-full h-full">
      {pins.map((item, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: `${position.x + item.pin_x * scale}px`,
            top: `${position.y + item.pin_y * scale - 40}px`,
            zIndex: 3,
            pointerEvents: 'auto',
            visibility: isAllPinVisible ? 'visible' : 'hidden',
          }}
        >
          <PinComponent
            blueprintId={blueprint_id}
            blueprintVersion={blueprint_version_id}
            pin={item}
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
