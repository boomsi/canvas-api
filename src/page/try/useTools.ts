import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { fabric } from 'fabric-near-erasing';

import draw from './draw';

interface IProps {
  canvas: fabric.Canvas;
}

type Elements = (fabric.Image | fabric.Textbox | fabric.Object)[];

const DEFAULT_TEXT_OPTIONS: fabric.ITextboxOptions = {
  left: 200,
  top: 200,
  fill: 'red',
  fontSize: 30,
  selectable: true
};

let onEraseElement: fabric.Object;
const useTools = ({ canvas }: IProps) => {
  const [elements, setElements] = useState<Elements>([]);

  const addRect = (options?: fabric.IRectOptions) => {
    const rect = draw.addRect(canvas, {
      fill: 'green',
      width: 300,
      height: 300,
      ...options
    });
    // animate(rect);
    return rect;
  };

  const addImage = (url: string) => {
    const key = uuidv4();
    draw.drawImage(canvas, url, { cacheKey: key }).then((imgEl) => {
      setElements(elements.concat(imgEl));
      imgEl.name = key;
    });
  };

  const addTextBox = (text: string) => {
    const key = uuidv4();
    const rect = draw.drawTextBox(canvas, text, DEFAULT_TEXT_OPTIONS);
    rect.name = key;
    setElements(elements.concat(rect));
  };

  const updateElement = (options: fabric.ITextboxOptions) => {
    const target = canvas.getActiveObject();
    if (!target) return;
    target.setOptions(options);
    canvas.renderAll();
  };

  const addGroup = () => {
    // FIXME
    // const objects = canvas.getActiveObjects();
    const a1 = new fabric.Text('2333');
    const a2 = new fabric.Rect({
      width: 40,
      height: 40,
      fill: '#07689f',
      left: 300,
      top: 400
    });
    const group = new fabric.Group([a1, a2]);
    canvas.add(group);
    canvas.renderAll();
  };

  const exportPng = () => {
    // FIXME
    const objects = canvas.getActiveObjects();
    const tempCanvas = new fabric.StaticCanvas(null, {
      width: canvas.width,
      height: canvas.height
    });

    tempCanvas.add(...objects);
    const url = tempCanvas.toDataURL({
      format: 'png',
      quality: 0.1,
      enableRetinaScaling: true
    });
    console.log(url);
  };

  const animate = (target: fabric.Object | null) => {
    if (!target) return;
    try {
      target.animate('top', target.get('top') === 500 ? '100' : '500', {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: () => animate(target)
      });
    } catch (error) {
      setTimeout(animate, 500);
    }
  };

  const onErase = () => {
    const rect = canvas.getActiveObject();

    if (rect && !rect.erasable) {
      onEraseElement = rect;
      rect.set('erasable', true);
      canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
      // canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      //   blur: 0,
      //   offsetX: 1,
      //   offsetY: 1,
      //   affectStroke: true,
      //   color: 'transparent'
      // });
      canvas.freeDrawingBrush.width = 10;
      canvas.isDrawingMode = true;

      return;
    }
    if (onEraseElement && onEraseElement.erasable) {
      onEraseElement.set('erasable', false);
      canvas.isDrawingMode = false;
    }
  };

  const onZIndexSort = () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    canvas.discardActiveObject();
    activeObject.sendBackwards();
    // activeObject.bringForward();
  };

  const onToggleDrawMode = () => {
    if (canvas.isDrawingMode) {
      canvas.isDrawingMode = false;
      return;
    }
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.freeDrawingBrush.color = 'green';
  };

  const onClipWithCustom = () => {
    let rect = canvas.getActiveObject() as fabric.Image;
    if (!rect) {
      return;
    }

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = '#000';

    canvas.on('path:created', (e: any) => {
      if (!rect) return;

      const path = e.path;
      path.set({ left: path.left, top: path.top, fill: 'transparent' });
      canvas.remove(path);

      const newRect = draw.onClip(canvas, rect, path);
      setElements(elements.concat(newRect));
      canvas.off('path:created');
    });
  };

  const onClipWithRect = () => {
    const target = canvas.getActiveObject() as fabric.Image;
    if (!target) return;

    let downPoint: fabric.Point | undefined;
    _changeType('rect');
    canvas.on('mouse:down', (e) => {
      downPoint = e.absolutePointer;

      canvas.on('mouse:up', (e) => {
        _changeType('default');
        canvas.off('mouse:down');
        canvas.off('mouse:up');

        const rect = draw.addRectWithCoord(
          canvas,
          downPoint,
          e.absolutePointer
        );
        if (rect) {
          canvas.remove(rect);
          const newRect = draw.onClip(canvas, target, rect);
          setElements(elements.concat(newRect));
        }
      });
    });
  };

  const toJson = () => {
    const json = canvas.toJSON(['name', 'cacheKey']);
    console.log(json);
  };

  const exportJson = (json: string) => {
    if (!json) return;
    canvas.loadFromJSON(json, () => {
      canvas.renderAll();
      canvas.getObjects().forEach((obj) => {
        console.log(obj, obj.name, 1);
      });
    });
  };

  const _changeType = (val = 'default') => {
    switch (val) {
      case 'default':
        canvas.selection = true;
        canvas.selectionColor = 'rgba(100, 100, 255, 0.3)';
        canvas.selectionBorderColor = 'rgba(255, 255, 255, 0.3)';
        canvas.skipTargetFind = false; // selectable
        break;
      case 'rect':
        canvas.selectionColor = 'transparent';
        canvas.selectionBorderColor = 'rgba(0, 0, 0, 0.2)';
        canvas.skipTargetFind = true;
        break;
      default:
        break;
    }
  };

  return {
    elements,
    addRect,
    addImage,
    addTextBox,
    updateElement,
    addGroup,
    exportPng,
    onErase,
    onZIndexSort,
    onToggleDrawMode,
    onClipWithCustom,
    onClipWithRect,
    toJson,
    exportJson
  };
};

export default useTools;
