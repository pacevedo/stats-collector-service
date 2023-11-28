import express from 'express';
import cors from 'cors'
import competitions from './competitions.js'
import * as euroleagueMatch from './euroleague/match.js';
import * as euroleaguePlayer from './euroleague/player.js';
import * as euroleagueRound from './euroleague/round.js';
import * as febRound from './feb/round.js';
import * as febMatch from './feb/match.js';
import * as febPlayer from './feb/player.js';
import * as euroleagueTeam from './euroleague/team.js';


const app = express();

app.disable("x-powered-by")

app.use(cors())

app.get('/', (req, res) => {
  res.send('')
});

app.put('/euroleague/player/refresh', (req, res) => {
  euroleaguePlayer.setViewPlayersTeam().then(
    response => {      
      res.send(JSON.stringify(response))
    }
  )
});

app.post('/euroleague/player/:codeteam/:season', (req, res) => {
  const { codeteam, season } = req.params
  euroleaguePlayer.savePlayers(codeteam, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/euroleague/player/:codeteam/:playercode/:season', (req, res) => {
  const { codeteam, playercode, season } = req.params
  euroleaguePlayer.savePlayer(playercode, codeteam, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.get('/euroleague/team/pending/:season', (req, res) => {
  const season = req.params.season
  euroleagueTeam.getPendingTeams(season, competitions.EUROLEAGUE).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/euroleague/match/:gamecode/:season', (req, res) => {
  const { gamecode, season } = req.params
  euroleagueMatch.processMatchData(gamecode, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {
      res.send(response)
  })
});

app.get('/euroleague/match/:season', (req, res) => {
  euroleagueMatch.getNumMatches(req.params.season, competitions.EUROLEAGUE).then(
    response => {
      res.send(response)
  })
});

app.post('/euroleague/round/:roundNumber/:phase/:season', (req, res) => {
  const { roundNumber, phase, season } = req.params
  euroleagueRound.processRound(roundNumber, phase, competitions.getAbr(competitions.EUROLEAGUE), season).then(
    response => {
      res.send(JSON.stringify(response))
  })
});

app.post('/eurocup/player/:codeteam/:season', (req, res) => {
  const { codeteam, season } = req.params
  euroleaguePlayer.savePlayers(codeteam, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/eurocup/player/:codeteam/:playercode/:season', (req, res) => {
  const { codeteam, playercode, season } = req.params
  euroleaguePlayer.savePlayer(playercode, codeteam, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {      
      res.send(response)
    }
  )
});

app.get('/eurocup/team/pending/:season', (req, res) => {
  const season = req.params.season
  euroleagueTeam.getPendingTeams(season, competitions.EUROCUP).then(
    response => {      
      res.send(response)
    }
  )
});

app.post('/eurocup/match/:gamecode/:season', (req, res) => {
  const { gamecode, season } = req.params
  euroleagueMatch.processMatchData(gamecode, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {
      res.send(response)
  })
  
});

app.post('/eurocup/round/:roundNumber/:phase/:season', (req, res) => {
  const { roundNumber, phase, season } = req.params
  euroleagueRound.processRound(roundNumber, phase, competitions.getAbr(competitions.EUROCUP), season).then(
    response => {
      res.send(JSON.stringify(response))
  })
});

app.get('/eurocup/match/:season', (req, res) => {
  euroleagueMatch.getNumMatches(req.params.season, competitions.EUROCUP).then(
    response => {
      res.send(response)
  })
});

app.post('/feb/round/:competition/:roundNumber/:phase/:season', (req, res) => {
  const { competition, roundNumber, phase, season } = req.params
  febRound.processRound(roundNumber, phase, competition, season).then(
    response => {
      res.send(JSON.stringify(response))
  })
});

app.post('/feb/match/:gamecode/:roundNumber/:competition/:season', (req, res) => {
  const {gamecode, roundNumber, competition, season} = req.params
  febMatch.processMatchData(gamecode, roundNumber, competition, season).then(
    response => {
      res.send(response)
  })
  
});

app.post('/feb/player/:codeteam/:playercode/:season', (req, res) => {
  const { codeteam, playercode, season } = req.params
  febPlayer.savePlayer(playercode, codeteam, season).then(
    response => {      
      res.send(response)
    }
  )
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});