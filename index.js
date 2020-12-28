import express from 'express';
import competitions from './competitions.js'
import * as match from './euroleague/match.js';
import * as player from './euroleague/player.js';
import * as round from './euroleague/round.js';
import * as team from './euroleague/team.js';

const app = express();

app.disable("x-powered-by")

app.get('/', (req, res) => {
  res.send('')
});

app.put('/euroleague/player/refresh', (req, res) => {
  player.setViewPlayersTeam().then(
    response => {      
      res.send(JSON.stringify(response))
    }
  )
});

app.post('/euroleague/player/:codeteam/:season', (req, res) => {
  const { codeteam, season } = req.params
  player.savePlayers(codeteam, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/euroleague/player/:codeteam/:playercode/:season', (req, res) => {
  const { codeteam, playercode, season } = req.params
  player.savePlayer(playercode, codeteam, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.get('/euroleague/team/pending/:season', (req, res) => {
  const season = req.params.season
  team.getPendingTeams(season, competitions.EUROLEAGUE).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/euroleague/match/:gamecode/:season', (req, res) => {
  const { gamecode, season } = req.params
  match.processMatchData(gamecode, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {
      res.send(response)
  })
});

app.post('/euroleague/round/:roundNumber/:phase/:season', (req, res) => {
  const { roundNumber, phase, season } = req.params
  round.processRound(roundNumber, phase, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {
      res.send(JSON.stringify(response))
  })
});

app.post('/eurocup/player/:codeteam/:season', (req, res) => {
  const { codeteam, season } = req.params
  player.savePlayers(codeteam, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/eurocup/player/:codeteam/:playercode/:season', (req, res) => {
  const { codeteam, playercode, season } = req.params
  player.savePlayer(playercode, codeteam, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.get('/eurocup/team/pending/:season', (req, res) => {
  const season = req.params.season
  team.getPendingTeams(season, competitions.EUROCUP).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/eurocup/match/:gamecode/:season', (req, res) => {
  const { gamecode, season } = req.params
  match.processMatchData(gamecode, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {
      res.send(response)
  })
  
});

app.post('/eurocup/round/:roundNumber/:phase/:season', (req, res) => {
  const { roundNumber, phase, season } = req.params
  round.processRound(roundNumber, phase, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {
      res.send(JSON.stringify(response))
  })
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});