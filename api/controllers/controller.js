var fs = require('fs');
var constance = require('../../Constance/constance');
var files = constance.files
var documents = constance.documents
var path = require('path');
import {parser} from './parser'
var axios = require('axios');

var FS_URL = constance.fsurl;

import {CHOOSE_FILE} from './commands';

import {
  SPOTIFY_PLAY,
  SPOTIFY_PAUSE,
  SPOTIFY_SEEK,
  SPOTIFY_SEARCH,
  DEV_ID,
} from '../../Constance/constance'


export const dummy = function(req, res) {
    var dt = require('../../modules/myfirstmodule');
    fs.readFile('files/demofile.txt', function(err, data) {
    res.json({message: "Dummy Function called on:  " + data});
  });
}

/** Should only be called by a choose command*/
export const get_file = function(req,res) {
  var file_name = req.body.file_name;
  console.log(file_name);
  var filePath = path.relative('.',file_name)
  console.log(filePath)
  var extName = path.extname(filePath);
  res.json(
    {
      file: FS_URL + filePath
    }
  )
}

export const spotify_play = function(req,res) {
  // console.log('PLAY SPOTIFY\n',req.body)
  var config = {
    headers: {'Authorization': ('Bearer ' + req.body.access_token)}
  };
  var data = req.body.uri
  const request = axios.put(SPOTIFY_PLAY + `?device_id=${DEV_ID}`, data, config);
  request.then((result) => {
    res.json(
      {
        payload: result,
        command: 'spotify-play'
      }
    )
  }).catch((e) => {
    res.json(
      {
        payload: 0,
        command: 'spotify-play'
      }
    )
});
}

export const spotify_pause = function(req,res) {
  // console.log('PAUSE SPOTIFY\n',req.body)
  var config = {
    headers: {'Authorization': ('Bearer ' + req.body.access_token)}
  };
  const request = axios.put(SPOTIFY_PAUSE + `?device_id=${DEV_ID}`, undefined, config);
  request.then((result) => {
    res.json(
      {
        payload: result,
        command: 'spotify-pause'
      }
    )
  }).catch((e) => {
    console.log(e.response.data.error);
    res.json(
      {
        payload: 0,
        command: 'spotify-pause'
      }
    )

  });
}

export const spotify_seek = function(req,res) {
  console.log('SEEK SPOTIFY\n',req.body)
  var config = {
    headers: {'Authorization': ('Bearer ' + req.body.access_token)}
  };
  console.log(SPOTIFY_SEEK + `?position_ms=${req.body.position_ms}?device_id=${DEV_ID}`)
  const request = axios.put(SPOTIFY_SEEK + `?position_ms=${req.body.position_ms}&device_id=2cdb5a9d9f8db384d50ad8a20214c9d850717d3f`, undefined, config);
  request.then((result) => {
    res.json(
      {
        payload: 1,
        command: 'spotify-seek'
      }
    )
  }).catch((e) => {
    console.log('error: ', e);
    res.json(
      {
        payload: 0,
        command: 'spotify-seek'
      }
    )
  });
}

export const spotify_search = function(req,res) {
  var config = {
    headers: {'Authorization': ('Bearer ' + req.body.access_token)}
  };
  var q = req.body.q
  var types = !req.body.types ? 'album,artist,playlist,track' : req.body.types.toString()
  const request = axios.get(SPOTIFY_SEARCH + `?q=${q}?type=${types}`, config);
  request.then((result) => {
    res.json(
      {
        payload: result,
        command: 'spotify-search'
      }
    )
  }).catch((e) => {
    res.json(
      {
        payload: 0,
        command: 'spotify-search'
      }
    )
  });
}

/** Main function for parsing a message into its proper commands */
export const parse = function(req, res) {
  var message = req.body.message;
  const parsed = parser(message, req.body, res);
  if (!(typeof parsed.payload.then == 'function')) {
    res.json(
    {
      message: "Your name is: " + req.body.name,
      file: "Your message is: " + message,
      payload: parsed.payload,
      command: parsed.command,
    })
  }
  else {
    parsed.payload.then((result) => {
      parsed.funct(result, res, req)
    }
    ).catch((e) =>{
    console.log("POST Message ERROR: ", e);
    console.log(e.response.data)
    if(e.response.data.error.message == 'The access token expired') {
      console.log("hereo")
      parser('potato', req.body, res)
    }
  });
}
}

/** Given a request with an absolute file path, returns the contents of that
 * file, or an undefined message otherwise
 */
export const find_file = function(req, res) {
  var file_name = req.body.file_name;
  var message = req.body.message;
  if (file_name.includes('..')) {
    res.json({error: 'can not look above the programatic root'})
  }
  else {
  var pathTo = path.relative('.',file_name)
  fs.readFile(pathTo, function(err,data) {
    res.json(
    {
      message: "Your name is: " + req.body.name,
      file: "Read data: " + data
    }
  );
  });
}
}

export const audio_demo = function(req,res) {
    var file_name = req.body.file_name;
    var filePath = path.relative('.',file_name)
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}

export const audio_dummy = function(req,res) {
    var file_name = '/Users/daniel/Documents/Songs/Avicii -  Wake me up (Radio Edit).mp3';
    var filePath = path.relative('.',file_name)
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
}
