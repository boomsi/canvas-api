import React, { useState, useRef, useEffect } from 'react';
import './index.less';
import Drag from './Drag';

let lastPoint = [0, 0];
const Main: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<string>('');
  const [drawing, setDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [undoData, setUndoData] = useState<string[]>([]); // 存储绘制数据的数组
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [maskBase64, setMaskBase64] = useState<string>('');

  const [scale, setScale] = useState<number[]>([1, 1]);
  const [stop, setStop] = useState<boolean>(false);

  useEffect(() => {
    return;
    const target = document.querySelector('.main');
    const moveFn = (e: any) => {
      // 鼠标的位置
      const mouse = [e.clientX, e.clientY];

      onMoveTarget([mouse[0] - lastPoint[0], mouse[1] - lastPoint[1]]);
    };
    const upFn = () => {
      target?.removeEventListener('mousemove', moveFn);
      target?.removeEventListener('mouseup', upFn);
    };
    const fn = (e: any) => {
      lastPoint = [e.clientX, e.clientY];
      target?.addEventListener('mousemove', moveFn);
      const upFn = () => {
        target?.removeEventListener('mousemove', moveFn);
        target?.removeEventListener('mouseup', upFn);
      };
      target?.addEventListener('mouseup', upFn);
    };
    if (stop) {
      target?.addEventListener('mousedown', fn);
    } else {
      target?.removeEventListener('mousedown', fn);
    }

    return () => {
      target?.removeEventListener('mousedown', fn);
    };
  }, [stop]);

  const onMoveTarget = (point: number[]) => {
    const target = document.querySelector('.main') as HTMLElement;
    const style = target?.style.transform;
    target.style.transform = style.replace(
      /translate\(([-\d]+px), ([-\d]+px)\)/,
      `translate(${point[0]}px, ${point[1]}px)`
    );
  };

  const onTargetLoaded = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const target = document.querySelector('.imgs img') as HTMLImageElement;
    canvas.width = target?.getBoundingClientRect().width as number;
    canvas.height = target?.getBoundingClientRect().height as number;

    const width = target!.naturalWidth;
    const height = target!.naturalHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImg(reader.result as string);
    };
  };

  const transformPoint = (event: any) => {
    const canvas = canvasRef.current!
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;    // canvas实际宽度与显示宽度的比例
    const scaleY = canvas.height / rect.height;  // canvas实际高度与显示高度的比例

    // 计算鼠标在canvas内的实际像素坐标
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const {x, y} = transformPoint(e)
    setLastX(x);
    setLastY(y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const {x, y} = transformPoint(e)
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.strokeStyle = '#fff';
        context.lineJoin = 'round';
        context.lineWidth = 20;
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y); 
        context.closePath();
        context.stroke();
        setLastX(x);
        setLastY(y);
      }
    }
    // 更新当前鼠标位置
    setCurrentX(x);
    setCurrentY(y);
  };

  const handleMouseUp = () => {
    setDrawing(false);
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const dataURL = canvas.toDataURL(); // 获取当前画布的数据URL
      // 检查鼠标是否有移动，只有在移动时才添加撤销数据
      if (lastX !== currentX || lastY !== currentY) return;
      setUndoData([...undoData, dataURL]);
    }
  };

  const handleMouseLeave = () => {
    setDrawing(false);
  };

  const handleUndo = () => {
    if (undoData.length > 0) {
      const canvas = canvasRef.current;
      // 取出上一步的绘制数据
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // 清除整个画布
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // 绘制蒙版
          ctx.fillStyle = 'rgba(0, 0, 0, 1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (undoData.length !== 1) {
            // 加载上一步所有的数据并重新绘制
            const image = new Image();
            const lastDataURL = undoData[undoData.length - 2];
            image.src = lastDataURL;
            image.onload = () => {
              ctx.drawImage(image, 0, 0);
            };
          }
        }
      }
      // 从撤销数据数组中移除上一步数据
      setUndoData(undoData.slice(0, -1));
    }
  };

  const handleDownLoad = () => {
    if (canvasRef.current === null) return;
    const imageUrl = canvasRef.current.toDataURL('image/png');
    setMaskBase64(imageUrl);
  };

  return (
    <div className="img-container">
      <div className="btns">
        <input type="file" onChange={onChange} />
        <button onClick={handleUndo}>Undo</button>
        <button
          onClick={() => {
            setStop(!stop);
          }}
        >
          Stop / Move
        </button>
        <button
          onClick={() => {
            setScale([scale[0] + 0.2, scale[1] + 0.2]);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            if (scale[1] <= 0) return;
            setScale([scale[0] - 0.2, scale[1] - 0.2]);
          }}
        >
          -
        </button>
        <button onClick={handleDownLoad}>Generate</button>
      </div>
      <Drag drag={stop}>
        {maskBase64 ? (
          <div className="final">
            <img src={maskBase64} alt="" />
          </div>
        ) : (
          <div
            className="main"
            style={{
              transform: `translate(0px, 0px) scale(${scale[0]}, ${scale[1]})`
            }}
          >
            <div className="imgs">
              {img && <img src={img} alt="" onLoad={onTargetLoaded} />}
            </div>
            <div id="canvas" className="canvas">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>
            {stop && <div className="stop" />}
          </div>
        )}
      </Drag>
    </div>
  );
};

export default Main;
