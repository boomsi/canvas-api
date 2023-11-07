import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { fabric } from 'fabric-near-erasing';

import useTools from './useTools';
import '@src/libs/draw-history';
import './index.less';

const Notfound = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasBoxRef = React.useRef<HTMLDivElement>(null);

  const [canvas, setCanvas] = React.useState<fabric.Canvas>(
    {} as fabric.Canvas
  );

  const {
    addRect,
    addImage,
    addTextBox,
    updateElement,
    // addGroup,
    exportPng,
    onErase,
    // elements,
    onZIndexSort,
    onToggleDrawMode,
    onClipWithCustom,
    onClipWithRect,
    toJson,
    exportJson
  } = useTools({
    canvas
  });

  const [textOptions] = useState<fabric.ITextboxOptions>({
    textAlign: 'center',
    fontFamily: 'MyFont1',
    fill: '#f40',
    fontSize: 40,
    opacity: 0.4,
    lineHeight: 1,
    fontWeight: 'bold',
    fontStyle: 'italic',
    charSpacing: 30,
    angle: 90
  });

  useEffect(() => {
    fabric.Object.prototype.erasable = false;
    fabric.Object.prototype.objectCaching = false;
    const canvasEditor = new fabric.Canvas(canvasRef.current);
    canvasEditor.preserveObjectStacking = true;
    canvasEditor.width = 1000;
    canvasEditor.height = 600;
    fabric.Object.prototype.transparentCorners = false;
    setCanvas(canvasEditor);

    return () => {
      canvasEditor.dispose();
      canvasEditor.off();
    };
  }, [canvasBoxRef.current]);

  const onDeleteSelectedRect = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keyCode = e.code;
    if (keyCode === 'Backspace') {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
      }
    }
  };

  const onGetInfo = () => {
    console.log(canvas.getObjects());
    // const ele = canvas.getActiveObject()
    // console.log(ele.fontFamily)
  };

  const onAddBg = () => {
    addRect({
      width: canvas.width,
      height: canvas.height,
      fill: '#f40',
      selectable: false,
      evented: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true
    });
  };

  const onDrawStart = () => {
    const img = canvas.getObjects('image')[0] as fabric.Image;
    if (!img) return;
    addRect({
      width: canvas.width,
      height: canvas.height,
      fill: 'rgba(0, 0, 255, .1)',
      selectable: false
    });
    canvas.renderAll();

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = 'rgba(0, 255, 0, .3)';
    canvas.freeDrawingBrush.width = 30;
  };

  const onDrawEnd = () => {
    canvas.isDrawingMode = false;
    const img = canvas.getObjects('image')[0] as fabric.Image;
    const index = canvas.getObjects().findIndex((i) => i.type === 'rect');
    const targets = canvas.getObjects().splice(index);
    targets[0].fill = 'rgba(0, 0, 0, 1)';
    targets.slice(1).map((i) => {
      i.stroke = 'rgba(255, 255, 255, 1)';
    });

    const url = canvas.toDataURL({
      format: 'png',
      quality: 1,
      enableRetinaScaling: true,
      multiplier: 1,
      left: img.left,
      top: img.top
      // width: img.width * img.scaleX,
      // height: img.height * img.scaleY
    });

    console.log(url);

    canvas.renderAll();
  };

  const changeUrl = () => {
    const target = canvas.getActiveObject() as fabric.Image;
    target.setSrc('/public/unknown.png', () => {
      target.scaleToHeight(200);
      target.scaleToWidth(200);
      canvas.renderAll();
    });
  };

  const onUndo = () => {
    // @ts-ignore
    canvas.undo();
  };

  const onRedo = () => {
    // @ts-ignore
    canvas.redo();
  };

  return (
    <div className="demo-container">
      <div className="options">
        <Button onClick={onDrawStart}>onDrawStart</Button>
        <Button onClick={onDrawEnd}>onDrawEnd</Button>
        <Button onClick={onAddBg}>addBG</Button>
        <Button onClick={() => addRect()}>addRect</Button>
        <Button onClick={() => addImage('/public/slot.png')}>AddImage</Button>
        <Button onClick={toJson}>ToJson</Button>
        <Button onClick={() => addTextBox('哈哈哈')}>AddText</Button>
        <Button onClick={() => updateElement(textOptions)}>Change Text</Button>
        <Button onClick={() => updateElement({ opacity: 0.5 })}>Opacity</Button>
        <Button onClick={onGetInfo}>GetInfo</Button>
        <Button onClick={onUndo}>Undo</Button>
        <Button onClick={onRedo}>Redo</Button>
        {/* <Button onClick={addGroup}>AddGroup</Button> */}
        <Button onClick={onZIndexSort}>-</Button>
        <Button onClick={exportPng}>Export</Button>
        <Button onClick={onToggleDrawMode}>Drawing</Button>
        <Button onClick={onErase}>Erase</Button>

        <Button onClick={onClipWithCustom}>Clip</Button>
        <Button onClick={onClipWithRect}>onClipWithRect</Button>

        <Button onClick={() => exportJson('')}>exportJson</Button>
        <Button onClick={changeUrl}>ChangeUrl</Button>

        {/* <Button onClick={onExit}>Exit</Button> */}
      </div>

      <div className="preload-fontface-area">abc</div>
      <div
        className="canvas"
        ref={canvasBoxRef}
        tabIndex={-1}
        style={{ outline: 'none' }}
        onKeyDown={onDeleteSelectedRect}
      >
        <canvas id="canvas" width="400" height="400" ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default Notfound;
