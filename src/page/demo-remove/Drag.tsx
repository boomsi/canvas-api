import { useEffect } from 'react';
import interact from 'interactjs';

import './index.less';

const Drag = ({ drag, children }: any) => {
  useEffect(() => {
    interact('.draggable').draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      // enable autoScroll
      autoScroll: true,

      listeners: {
        move: dragMoveListener,
        end(event: any) {
          var textEl = event.target.querySelector('p');

          textEl &&
            (textEl.textContent =
              'moved a distance of ' +
              Math.sqrt(
                (Math.pow(event.pageX - event.x0, 2) +
                  Math.pow(event.pageY - event.y0, 2)) |
                  0
              ).toFixed(2) +
              'px');
        }
      }
    });
    // @ts-ignore
    window.dragMoveListener = dragMoveListener;
  }, []);

  useEffect(() => {
    if (drag) {
      interact('.draggable').draggable(true);
    } else {
      interact('.draggable').draggable(false);
    }
  }, [drag]);

  function dragMoveListener(event: any) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  return (
    <div className="container">
      <div id="drag-1" className="draggable">
        {children}
      </div>
    </div>
  );
};

export default Drag;
