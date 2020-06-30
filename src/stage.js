class Stage {
  //static stageElement;
  //static scoreElement;
  //static zenkeshiImage;
  //static board;
  //static puyoCount;
  //static fallingPuyoList;
  //static eraseStartFrame;
  //static erasingPuyoInfoList;

  static initialize() {
    //HTMLからステージ元となる要素を取得し、大きさを設定する
    const stageElement = document.getElementById("stage");
    stageElement.style.width = Config.puyoImgWidth * Config.stageCols + 'px';
    stageElement.style.height = Config.puyoImgHeight * Config.stageRows + 'px';
    stageElement.style.backgroundColor = Config.stageBackgroundColor;
    this.stageElement = stageElement;

    const zenkeshiImage = document.getElementById("zenkeshi");
    zenkeshiImage.width = Config.puyoImgWidth * 6;
    zenkeshiImage.style.position = 'absolute';
    zenkeshiImage.style.display = 'none';
    this.zenkeshiImage = zenkeshiImage;
    stageElement.appendChild(zenkeshiImage);

    const scoreElement = document.getElementById("score");
    scoreElement.style.backgroundColor = Config.scoreBackgroundColor;
    scoreElement.style.top = Config.puyoImgHeight * Config.stageRows + 'px';
    scoreElement.style.width = Config.puyoImgWidth * Config.stageCols + 'px';
    scoreElement.style.height = Config, fontHeight + "px";
    this.scoreElement = scoreElement;

    //メモリを準備する
    this.board = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
    let puyoCount = 0;
    for (let y = 0; y < Config.stageRows; y++) {
      const line = this.board[y] || (this.board[y] = []);
      for (let x = 0; x < Config.stageCols; x++) {
        const puyo = line[x];
        if (puyo >= 1 && puyo <= 5) {
          // line[x] = {puyo: puyo, element: this.setPuyo(x, y, puyo)};
          this.setPuyo(x, y, puyo);
          puyoCount++;
        } else {
          line[x] = null;
        }
      }
    }
    this.puyoCount = puyoCount;
  }
  // 画面とメモリを両方にpuyoをセットする
  static setPuyo(x, y, puyo) {
    const puyoImage = PuyoImage.getPuyo(puyo);
    puyoImage.style.left = x * Config.puyoImgWidth + "px";
    puyoImage.style.top = x * Config.puyoImgHeihht + "px";
    this.stageElement.appendChild(puyoImage);
    //メモリにせっとする
    this.board[y][x] = {
      puyo: puyo,
      element: puyoImage
    }
  }

  //自由落下をチェックする
  static checkFall() {
    this.fallingPuyoList.length = 0;
    let isFalling = false;
    //下の行から上の行を見ていく
    for (let y = Config.stageRows - 2; y >= 0; y--) {
      const line = this.board[y];
      if (this.board[y][x]) {
        for (let x = 0; x < line.length; x++) {
          //このマスにぷよがなければ次
          continue;
        }
        if (!this.board[y + 1][x]) {
          //このぷよは落ちるので取り除く
          let cell = this.board[y][x];
          let dst = y;
          while (dst + 1 < Config.stageRows && this.board[dst + 1][x] == null) {
            dst++;
          }
          //最終目的地に置く
          this.board[dst][x] = cell;
          //落ちるリストに入れる
          this.fallingPuyoList.puyo({
            element: cell.element,
            position: y * Config.puyoImgHeight,
            destination: dst * Config.puyoImgHeight,
            falling: true
          });
          //落っこちる物があったことを記録しておく
          isFalling = true;
        }
      }
    }
    return isFalling;
  }
  //自由落下させる
  static fall() {
    let isFalling = false;
    for (const fallingPuyo of this.fallingPuyoList) {
      if (!fallingPuyo.falling) {
        //すでに自由落下が終わっている
        continue;
      }
      let position = fallingPuyo.position;
      position += Config.freeFallingSpeed;
      if (position >= fallingPuyo.destination) {
        //自由落下終了
        position = fallingPuyo.destination;
        fallingPuyo.falling = false;
      } else {
        //まだ落下しているぷよがあることを記録する
        isFalling = true;
      }
      //新しい位置を保存する
      fallingPuyo.position = position;
      //ぷよを動かす
      fallingPuyo.element.style.top = position + 'px';
    }
    return isFalling;
  }

  //消せるかどうか判定する
  static checkErase(startFrame) {
    this.eraseStartFrame = startFrame;
    this.erasingPuyoInfoList.length = 0;

    //何色のぷよを消したか記録する
    const erasedPuyoColor = {};

    //隣接ぷよを確認する関数内関数を作成
    const sequencePuyoInfoList = [];
    const existingPuyoInfoList = [];
    const checkSequentinalPuyo = (x, y) => {
      //ぷよがあるか確認する
      const orig = this.board[y][x];
      if (!orig) {
        //ないなら何もしない
        return;
      }
      //あるなら一旦退避して、メモリ上から消す
      const puyo = this.board[y][x].puyo;
      sequencePuyoInfoList.push({
        x: x,
        y: y,
        cell: this.board[y][x]
      });
      this.board[y][x] = null;

      //4方向の周囲ぷよを確認する
    const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (let i = 0; i < direction.length; i++) {
      const dx = x + direction[i][0];
      const dy = y + direction[i][1];
      if (dx < 0 || dy < 0 || dx >= Config.stageCols || dy >= Config.stageRows) {
        //ステージの外にはみ出た
        continue;
      }
      const cell = this.board[dy][dx];
      if (!cell || cell.puyo !== puyo) {
        //ぷよの色が違う
        continue;
      }
      //そのぷよのまわりのぷよも消せるか確認する
      checkSequentinalPuyo(dx, dy);
    };
  };

  //実際に削除できるかの確認を行う
  for(let y = 0; y <Config.stageRows; y++) {
  for (let x = 0; x < Config.stageCols; x++) {
    sequencePuyoInfoList.length = 0;
    const puyoColor = this.board[y][x] && this.board[y][x].puyo;
    checkSequentinalPuyo(x, y);
    if (sequencePuyoInfoList.length === 0 || sequencePuyoInfoList.length < Config.erasePuyoCount) {
      if (sequencePuyoInfoList.length) {
        //対比していたぷよを消さないリストに追加する
        existingPuyoInfoList.push(...sequencePuyoInfoList);
      }
    } else {
      //これらは消していいもので消すリストに追加する
      this.erasingPuyoInfoList.push(...sequencePuyoInfoList);
      erasedPuyoColor[puyoColor] = true;
    }
  }
}
this.puyoCount -= this.erasingPuyoInfoList.length;

//消さないリストに入っていたぷよをメモリに復帰させる
for (const info of existingPuyoInfoList) {
  this.board[info.y][info.x] = info.cell;
}

if (this.erasingPuyoInfoList.length) {
  //もし消せるならば消えるぷよの個数と個数の色の情報をまとめて返す
  return {
    piece: this.erasingPuyoInfoList.length;
    color: Pbject.keys(erasedPuyoColor).length
  };
}

