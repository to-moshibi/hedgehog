import React from 'react';
import { Client } from 'boardgame.io/react';
import { Hedgehog } from './Game';
import { HedgehogBoard } from './Board';

export const HedgehogClient = Client({
  game: Hedgehog,
  board: HedgehogBoard,
});

const App = () => (
  <div className='App'>

    <HedgehogClient />
    <div>
      <p>スマホをお使いの場合は、右下または右上のメニューを開き<br />
        「ホーム画面に追加」でアプリをインストールできます<br /><br />
        試行回数を増やすと強く、減らすと弱くなります<br />
        CPUのAIを作った人は3000でもあまり勝てません<br />
        増やしすぎると重くなるので注意してください<br />
      </p>

    </div>
    <div>
      <label>ルール</label>

      <ul>
        <li>相手の隣にコマを置くと相手が1マス逃げます</li>
        <li>相手が移動する場所にしかコマはおけません</li>
        <li>たて・よこ・ななめのいずれかの向きに相手の駒を4つ揃えたら勝ちです</li>
        <li>どこにおいても相手が動かない場合、相手の隣ならコマをどこでも置くことができます</li>
        <li>コマを置いたときに、自分のコマが4つ揃った場合はコマを置いた人が敗北します</li>
      </ul>
    </div>
    <footer>
      <p>このゲームはVRChatのワールド<a href='https://vrchat.com/home/world/wrld_e8db4bf4-9da9-4dd4-9dc3-1cd56820f038/info'>ちはるーむ</a>様にあるボードゲーム、"Hedgehog's dilemma"です</p>
      <p>非公式のWeb移植ですので、クレームや要望はtomoshibi.neko@gmailまでお願いします。</p>
      <p>このゲームを制作された<a href='https://x.com/IzzyVRC'>いじー</a>様、<a href='https://x.com/oha_oha_Ohashi'>フライングオニオオハシ</a>様に心より感謝いたします。</p>
    </footer>

  </div>
);

export default App;