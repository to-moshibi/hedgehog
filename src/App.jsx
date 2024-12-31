// src/App.js

import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Hedgehog } from './Game';
import { HedgehogBoard } from './Board';

const HedgehogClient = Client({
  game: Hedgehog,
  board: HedgehogBoard,
  // multiplayer: Local(),
});

const App = () => (
  <div>
    <HedgehogClient/>
    {/* <HedgehogClient playerID="1" /> */}
  </div>
);

export default App;