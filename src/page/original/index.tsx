import { useEffect, useRef, useState } from 'react';
import './index.less';
import { IRectOptions, ICircleOptions } from './interfaces';
import { rectDefaultOptions } from './default';

const Original = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    init();
  }, []);

  const addRect = (ctx: CanvasRenderingContext2D, options: IRectOptions) => {
    const { width, height, top, left, fillStyle, strokeStyle, lineWidth } =
      Object.assign(rectDefaultOptions, options);
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.closePath();
    ctx.lineWidth = lineWidth || 1;
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  };

  const toDataURL = (canvas: HTMLCanvasElement) => {
    return canvas.toDataURL('image/png');
  };

  const addCircle = (
    ctx: CanvasRenderingContext2D,
    options: ICircleOptions
  ) => {
    const { width, height, left, top } = options;

    if (width !== height) {
      // ctx.arc(left, top, width, 0, 2 * Math.PI);
    } else {
      ctx.arc(left, top, width, 0, 2 * Math.PI);
    }
  };

  const init = () => {
    const ctx = canvasRef.current!.getContext('2d')!;
    setCtx(ctx);
    // console.log(ctx);

    // ctx.globalAlpha = 0.5
    ctx.lineJoin = 'miter';

    ctx.save();

    ctx.beginPath();
    ctx.lineTo(400, 200);
    ctx.lineTo(800, 200);
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'red';
    ctx.stroke();

    ctx.shadowColor = 'rgba(0, 0, 0, .4)';
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 10;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.lineTo(800, 180);
    ctx.lineTo(820, 200);
    ctx.lineTo(800, 220);
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.fill();

    ctx.restore();

    // const gradientLiner = ctx.createLinearGradient(0, 0, 0, 1400)
    // gradientLiner.addColorStop(0, 'red')
    // gradientLiner.addColorStop(1, 'blue')
    // ctx.fillStyle = gradientLiner
    // ctx.fillRect(600, 600, 800, 800)

    // ctx.globalCompositeOperation = 'screen'

    // ctx.globalCompositeOperation = 'destination-over'
    // ctx.globalCompositeOperation = 'source-over'

    // ctx.fillStyle = 'green'
    // ctx.fillRect(500, 600, 400, 400)

    // ctx.clearRect(100, 100, 800, 800)
    // ctx.setLineDash([20, 10])
    // ctx.lineDashOffset = 20
    // ctx.strokeRect(100, 100, 800, 800)

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.moveTo(800, 200);
    ctx.moveTo(1200, 800);
    ctx.miterLimit = 1;

    ctx.beginPath();
    ctx.arc(400, 400, 200, 0, Math.PI / 2, false);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(500, 300);
    ctx.arcTo(400, 700, 500, 800, 100);
    ctx.arcTo(600, 700, 700, 1000, 100);
    ctx.lineTo(1000, 1200);
    ctx.stroke();

    // const img = new Image()
    // img.src = ''
    // img.onload = () => {
    //     ctx.beginPath()
    //     ctx.moveTo(100, 100)
    //     ctx.lineTo(600, 800)
    //     ctx.lineTo(400, 1200)
    //     ctx.clip()
    //     ctx.drawImage(img, 0, 0, 1200, 1200)
    // }

    // const img2 = new Image()
    // img2.src = ''
    // img2.onload = () => {
    //     var canvasCreated = document.createElement('canvas');
    //     canvasCreated.width = 300;
    //     canvasCreated.height = 640;
    //     canvasCreated.getContext('2d')!.drawImage(img2, 0, 0, 300, 640);
    //     const pattern = ctx.createPattern(canvasCreated, 'no-repeat')!;
    //     ctx.fillStyle = pattern
    //     ctx.fillRect(0, 0, 300, 640);

    //     ctx.drawImage(img2, 800, 800, 200, 200)
    //     ctx.drawImage(img2, 0, 0, 50, 50, 800, 800, 200, 200)
    // }

    ctx.beginPath();
    ctx.ellipse(400, 400, 100, 200, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.stroke();

    ctx.font = '100px Arial';
    ctx.fillText('hello world', 100, 100);

    // const imageData = ctx.getImageData(0, 0, 1000, 1000)
    // console.log(imageData, 'imageData')
    // var length = imageData.data.length;
    // for (var index = 0; index < length; index += 4) {
    //     var r = imageData.data[index];
    //     var g = imageData.data[index + 1];
    //     var b = imageData.data[index + 2];
    //     // 计算灰度
    //     var gray = r * 0.299 + g * 0.587 + b * 0.114;
    //     imageData.data[index] = gray;
    //     imageData.data[index + 1] = gray;
    //     imageData.data[index + 2] = gray;
    // }
    // // 更新新数据
    // ctx.putImageData(imageData, 0, 0);

    ctx.beginPath();
    // ctx.fillRect(100, 100, 800, 800)
    ctx.arc(600, 600, 200, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    

    // ctx.beginPath()
    // ctx.rotate(25 / Math.PI * 180)
    // ctx.moveTo(0, 20)
    // ctx.lineTo(2000, 2000)
    // ctx.stroke()

    // ctx.setTransform(1, 0, 0, 1, 0, 0)
    
    // ctx.fillRect(30, 30, 200, 300)


    ctx.save()
    ctx.scale(1, -1)
    ctx.font = '70px Arial'
    ctx.fillText('hello world', 200, -900)
    ctx.restore()
    ctx.fillText('hello world?', 200, 1100)

    console.log(ctx)


    // console.log(ctx.measureText('hello world'))

    // var gradientLinear = ctx.createLinearGradient(0, 0, 0, 100);
    // gradientLinear.addColorStop(0, 'red');
    // gradientLinear.addColorStop(1, 'green');
    // // 填充线性渐变
    // ctx.fillStyle = gradientLinear;
    // ctx.fillRect(10, 10, 100, 100);
    // addRect(ctx, {
    //   width: 200,
    //   height: 400,
    //   left: 20,
    //   top: 20,
    //   fillStyle: 'red',
    //   strokeStyle: 'blue'
    // });

    // canvasRef.current!.toBlob(
    //   (blob) => {
    //     if (!blob) return;
    //     const url = URL.createObjectURL(blob);
    //     console.log(url);
    //     document.getElementById('show')!.innerHTML = '<img src="' + url + '">';
    //   },
    //   'png',
    //   1
    // );
  };

  const onClick = (e: any) => {
    const ratio =
      canvasRef.current!.getBoundingClientRect().width /
      canvasRef.current!.width;
    const [x, y] = [e.clientX, e.clientY];
    console.log(ctx!.isPointInPath(x / ratio, y / ratio));
  };

  return (
    <div className="original-container">
      <canvas
        ref={canvasRef}
        id="canvas"
        width="2000"
        height="2000"
        onClick={onClick}
      ></canvas>
      <div id="show" className="show"></div>
    </div>
  );
};

export default Original;
