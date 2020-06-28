class Player {
  // static centerPuyo;
  // static movablePuyo;
  // static puyoStatus;
  // static centerPuyoElement;
  // static movableElement;

  // static groundFrame;
  // static keyStatus;

  // static actionStartFrame;
  // static moveSource;
  // static Destination;
  // static rotateBeforeLeft;
  // static rotateAfterLeft;
  // static rotateFromRotation;

  static initialize() {
    // キーボードの入力を確認する
    this.keyStatus = {
      right: false,
      left: false,
      up: false,
      down: false
    };
    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 37: //左キー
          this.keyStatus.left = true;
          e.preventDefault(); return false;

        case 38: //上キー
          this.keyStatus.up = true;
          e.preventDefault(); return false;

        case 39: //右キー
          this.keyStatus.right = true;
          e.preventDefault(); return false;

        case 40: //下キー
          this.keyStatus.down = true;
          e.preventDefault(); return false;
      }
    });
    document.addEventListener('keyup', (e) => {
      // キーボードが離された場合
      switch(e.keyCode){
        case 37: // 左
          this.keyStatus.left = false;
          e.preventDefault(); return false;

          case 38: // 上
          this.keyStatus.up = false;
          e.preventDefault(); return false;

          case 39: // 右
          this.keyStatus.right = false;
          e.preventDefault(); return false;

          case 40: // 下
          this.keyStatus.down = false;
          e.preventDefault(); return false;
      }
    });
    //タッチ操作追加
    this.touchPoint = {
      xs: 0,
      ys: 0,
      xe: 0,
      ye: 0
    }
    document.addEventListener('touchstart', (e) => {
      this.touchPoint.xs = e.touches[0].clientX,
      this.touchPoint.ys = e.touches[0].clientY
    })
    document.addEventListener('touchmove', (e) => {
      // 指が少し動いたときは無視
      if(Math.abs(e.touches[0].clientX - this.touchPoint.xs) < 20 &&
      Math.abs(e.touches[0].clientY - this.touchPoint.ys) < 20
      ){
        return
      }

      // 指の動きからジェスチャーによるKeyStatusプロパティを更新
      this.touchPoint.xe = e.touches[0].clientX
      this.touchPoint.ye = e.touches[0].clientY
      const {xs, ys, xe, ye} = this.touchPoint
      gesture(xs, ys, xe, ye)

      this.touchPoint.xs = this.touchPoint.xe
      this.touchPoint.ys = this.touchPoint.ye
    })
    document.addEventListener('touchend', (e) => {
      this.keyStatus.up = false
      this.keyStatus.down = false
      this.keyStatus.left = false
      this.keyStatus.right = false
    })

    //ジェスチャを判定してkeyStatusプロパティを変更する関数
    const gesture = (xs, ys, xe, ye) => {
      const horizonDirection = xe - xs;
      const verticalDirection = ye - ys;
      if(Math.abs(horizonDirection) < Math.abs(verticalDirection)){
        //縦方向
        if(verticalDirection < 0){
          // up
          this.keyStatus.up = true
          this.keyStatus.down = false
          this.keyStatus.left = false
          this.keyStatus.right = false
        } else if(0 <= verticalDirection){
          // up
          this.keyStatus.up = false
          this.keyStatus.down = true
          this.keyStatus.left = false
          this.keyStatus.right = false
        }
      } else {
        //横方向
        if(horizonDirection < 0){
          this.keyStatus.up = false
          this.keyStatus.down = false
          this.keyStatus.left = true
          this.keyStatus.right = false
        } else if(0 <= horizonDirection){
          this.keyStatus.up = false
          this.keyStatus.down = false
          this.keyStatus.left = false
          this.keyStatus.right = true
        }
      }
    }
  }
  //ぷよ設置確認
  static createNewPuyo(){
    //　ぷよぷよが置けるかどうか、一番上の段の左から3つ目を確認する

  }

//--------------------------------↑10pまで

  static fix(){
    //現在のぷよをステージ上に配置する
    const x = this.puyoStatus.x;
    const y = this.puyoStatus.y;
    const dx = this.puyoStatus.dx;
    const dy = this.puyoStatus.dy;
    if(y >= 0){
      //画面外のぷよは消してしまう
      Stage.setPuyo(x, y, this.centerPuyo);
      Stage.puyoCount++;
    }
    if(y + dy >= 0) {
      Stage.setPuyo(x + dx, y + dy, this.movablePuyo);
      Stage.puyoCount++;
    }
    // 操作用に作成したぷよ画像を消す
    Stage.stageElement.removeChild(this.centerPuyoElement);
    Stage.stageElement.removeChild(this.movabkePuyoElement);
    this.centerPuyoElement = null;
    this.movablePuyoElement = null;
  }
}



static batankyu(){
  if(this.keyStatus.up){
    location.reload()
  }
}
