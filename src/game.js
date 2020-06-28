//起動されたときに呼ばれる関数を登録する
window.addEventListener("load",() => {
  //まずステージを整える
  initialize();

  //ゲームを開始する
  loop();
});

let mode; //ゲームの現在の状況
let frame; //ゲームの現在のフレーム
let combiination = 0; //何連鎖？

function initialize(){
  //画像を準備する
  PuyoImage.initialize();

  //ステージを準備する
  Stage.initialize();

  //ユーザー操作の準備をする
  Player.initialize();

  //シーンを初期状態にセット
  Score.initialize();

  //スコア表示の準備をする
  mode = 'start';

  //フレームの初期化をする
  frame = 0;
}

function loop(){
  switch(mode){
    case 'start':
      //最初はもしかしたら空中にあるかもしれないぷよを自由落下させる
      mode = 'checkFall';
      break;
    case 'checkFall':
      //落ちるかどうかを判定
      if(Stage.checkFall()){
        mode = 'fall';
      } else {
        //落ちないようならばぷよを消せるかどうかを判定
        mode = 'checkErase';
      }
      break;
    case 'fall':
      if(!Stage.fall()){
        //すべて落ちきったらぷよを消せるかどうかを判定
        mode = 'checkErase';
      }
      break;
    case 'checkErase':
      //消せるかどうか判定する
      const eraseInfo = Stage.checkErase(frame);
      if(eraseInfo){
        mode = 'erasing';
        combinationCount++;
        //得点を計算する
        Score.calculateScore(combinationCount, eraseInfo.piece, eraseInfo.color);
        Stage.hideZenkeshi();
      } else {
        if(Stage.puyoCount == 0 && combinationCount > 0){
          //全消しの処理をする
          Stage.showZenkeshi();
          Score.addScore(3600);
        }
        combinationCount = 0;
        //消せなかった、新しいぷよを登場させる
        mode = 'newPuyo';
      }
      break;
    case 'erasing':
      if(!Stage.erasing(frame)){
        //消し終わったら再度落ちるかどうかを判定する
        mode = 'checkFall';
      }
      break;
    case 'newPuyo':
      if(!Player.createNewPuyo()){
        //新しい操作用ぷよを作成できなかったらゲームオーバー
        mode = 'gameOver';
      } else {
        //プレイヤーが操作可能
        mode = 'playing';
      }
      break;
    case 'playing':
      const action = Player.playing(frame);
      mode = action; // 'playing' 'moving' 'rotating' 'fix' のどれかが帰ってくる
      //最初はもしかしたら空中にあるかもしれないぷよを自由落下させる
      mode = 'checkFall';
      break;
    case 'moving':
      if(!Player.moving(flame)){
        //移動が終わったので操作可能にする
        mode = 'playing';
      }
      break;
    case 'rotating':
      if(!Player.rotating(frame)){
        //回転が終わったので操作可能にする
        mode = 'playing';
      }
      break;
    case 'fix':
      //現在の位置でぷよを固定する
      Player.fix();
      //固定したらまず自由落下を確認する
      mode = 'checkFall';
      break;
    case 'gameOver':
      //ばたんきゅーの準備をする
      PuyoImade.prepareBatankyu(frame);
      mode = 'batankyu';
      break;
    case 'batankyu':
      PuyoImade.batankyu(frame);
      Player.batankyu();
      break;
  }
  frame++;
  requestAnimationFrame(loop); // 1/60病後にもう一度呼び出す
}
