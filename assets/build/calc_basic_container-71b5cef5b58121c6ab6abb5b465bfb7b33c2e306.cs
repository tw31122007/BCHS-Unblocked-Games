body.dcg-inverted-colors {
  filter: invert(100%);
}
body.dcg-inverted-colors .dcg-calc-basic-main,
body.dcg-inverted-colors .dcg-calc-matrix-main-wrapper {
  filter: invert(0%) !important;
}
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  background: #fff;
  -webkit-tap-highlight-color: transparent;
}
@media screen {
  body {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
#main {
  height: 550px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -275px;
}
#main.dcg-scientific-container,
#main.dcg-matrix-container {
  width: 600px;
  margin-left: -300px;
}
#main.dcg-four-function-container {
  width: 400px;
  margin-left: -200px;
}
@media screen and (max-width: 640px) {
  #main.dcg-scientific-container,
  #main.dcg-matrix-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    border: 0;
  }
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container {
    border: 0;
  }
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder {
    border: 0;
  }
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused),
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused) {
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
@media screen and (max-height: 650px) {
  #main.dcg-four-function-container,
  #main.dcg-scientific-container,
  #main.dcg-matrix-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container {
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder,
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder,
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder {
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused),
  #main.dcg-scientific-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused),
  #main.dcg-matrix-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused) {
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
@media screen and (max-width: 400px) {
  #main.dcg-four-function-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container {
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder {
    border: 0;
  }
  #main.dcg-four-function-container .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused) {
    border-left-color: transparent;
    border-right-color: transparent;
  }
}
body:not([dcg-platform="www"]) #main {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  border: 0;
}
body:not([dcg-platform="www"]) #main .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
body:not([dcg-platform="www"]) #main .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
body:not([dcg-platform="www"]) #main .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container {
  border: 0;
}
body:not([dcg-platform="www"]) #main .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder {
  border: 0;
}
body:not([dcg-platform="www"]) #main .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused) {
  border-left-color: transparent;
  border-right-color: transparent;
}
@media screen and (min-width: 640px) and (min-height: 600px) {
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    border: 0;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-calc-basic-main-wrapper .dcg-basic-list-container,
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container {
    border: 0;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-calc-basic-main-wrapper .dcg-basic-list-container .dcg-basic-list-placeholder {
    border: 0;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-calc-basic-main-wrapper .dcg-basic-expression:not(.dcg-focused) {
    border-left-color: transparent;
    border-right-color: transparent;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-basic-list-container {
    font-size: 150%;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-basic-list-container .dcg-basic-expression {
    padding: 10px 5px;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-basic-list-container .dcg-basic-expression .mq-ans:after {
    width: 28px;
    margin-left: -14px;
    height: 13px;
    line-height: 11px;
    font-size: 50%;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar {
    font-size: 150%;
    height: 60px;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar .dcg-keypad-control-btn.dcg-selectable-btn {
    height: 60px;
    line-height: 60px;
    max-width: 100px;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar .dcg-keypad-control-btn:not(.dcg-selectable-btn) {
    height: 50px;
    line-height: 50px;
    max-width: 100px;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar .dcg-keypad-control-btn:not(.dcg-selectable-btn) .dcg-icon-undo,
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar .dcg-keypad-control-btn:not(.dcg-selectable-btn) .dcg-icon-redo {
    top: 6px;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-keypad-control-bar .dcg-keypad-control-toggle {
    height: 36px;
    line-height: 36px;
    margin-top: 12px;
    max-width: 200px;
    margin: auto;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-basic-keypad {
    font-size: 150%;
  }
  .dcg-calc-basic-main.dcg-scientific-container.dcg-ipad .dcg-basic-keypad .dcg-keypad-btn-container {
    height: 60px;
  }
}
@media print {
  #main {
    height: calc(100% - 10px);
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 0;
  }
  #main.dcg-four-function-container,
  #main.dcg-scientific-container {
    width: calc(100% - 10px);
    margin-left: 0;
  }
  .dcg-calc-basic-main-wrapper .dcg-basic-list-container {
    border-top: none;
  }
  .dcg-calc-basic-main-wrapper .dcg-keypad-control-bar,
  .dcg-calc-basic-main-wrapper .dcg-basic-keypad-container,
  .dcg-calc-basic-main-wrapper .dcg-basic-list-placeholder {
    display: none;
  }
}
