import { fabric } from 'fabric-near-erasing';
import Ahead from './ahead';

class Draw extends Ahead {
  async drawImage(
    canvas: fabric.Canvas,
    src: string,
    options = {}
  ): Promise<fabric.Image> {
    // return new Promise((resolve) => {
    //   fabric.Image.fromURL(
    //     '',
    //     function (img) {
    //       img.padding = 0;
    //       img.top = 0;
    //       img.left = 0;
    //       img.scaleToHeight(200);
    //       canvas.add(img);
    //       resolve(img);
    //     },
    //     {
    //       crossOrigin: 'Anonymous'
    //     }
    //   );
    // });

    const imgEl = new Image();
    imgEl.src = src;

    return new Promise((resolve) => {
      imgEl.onload = () => {
        const img = new fabric.Image(imgEl, {
          crossOrigin: 'anonymous',
          ...options
        });
        img.scaleToHeight(300);
        canvas.centerObject(img);
        canvas.add(img);
        resolve(img);
      };
    });
  }

  drawTextBox(
    canvas: fabric.Canvas,
    text: string,
    options: fabric.ITextboxOptions
  ): fabric.Textbox {
    var rect = new fabric.Textbox(text, {
      selectable: true,
      ...options,
      splitByGrapheme: true
    });
    canvas.add(rect);
    canvas.centerObject(rect);
    return rect;
  }

  addRect(canvas: fabric.Canvas, options: fabric.IRectOptions) {
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      stroke: '#000',
      ...options
    });

    canvas.centerObject(rect);
    canvas.add(rect);
    canvas.renderAll();

    return rect;
  }

  addRectWithCoord = (
    canvas: fabric.Canvas,
    downPoint: fabric.Point | undefined,
    pointer: typeof downPoint
  ): fabric.Rect | undefined => {
    if (!downPoint || !pointer) return;
    if (downPoint.x === pointer.x && downPoint.y === pointer.y) return;

    let top = Math.min(downPoint.y, pointer.y);
    let left = Math.min(downPoint.x, pointer.x);
    let width = Math.abs(downPoint.x - pointer.x);
    let height = Math.abs(downPoint.y - pointer.y);

    return this.addRect(canvas, { top, left, width, height });
  };

  onClip(
    canvas: fabric.Canvas,
    rect: fabric.Image,
    clipPath: fabric.Object
  ): fabric.Object {
    // @ts-ignore-next-line
    const newRect = new fabric.Image(rect.getElement(), {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      flipX: rect.flipX,
      flipY: rect.flipY,
      angle: rect.angle,
      scaleX: rect.scaleX,
      scaleY: rect.scaleY,
      // @ts-ignore-next-line
      cacheKey: `${rect.cacheKey}_clip_${Date.now()}`
    });

    // @ts-ignore-next-line
    this.sendObjectToPlane(clipPath, undefined, newRect.calcTransformMatrix());
    newRect.set({ clipPath: clipPath });

    canvas.isDrawingMode = false;
    canvas.add(newRect);
    newRect.setOptions({ left: newRect.left! + 10, top: newRect.top! + 10 });
    canvas.setActiveObject(newRect);
    return newRect;
  }
}

export default new Draw();
