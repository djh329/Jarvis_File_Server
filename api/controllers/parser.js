var constance = require('../../Constance/constance');
var files = constance.files

var axios = require('axios');
var querystring = require('querystring');
import http from 'http';


// EXTERNAL METHODS
var searchFileSystem = require('./fileparser').searchFileSystem

// FILE TYPES
import {
    TEXT,
    AUDIO,
    ANY,
    UNDEFINED,
    CHOOSE_FILE,
    PLAY,
    OPEN,
  } from './commands';

  import {
          SPOTIFY_AUTH,
          SPOTIFY_REDIRECT,
          SPOTIFY_CLIENT_ID,
          SPOTIFY_CLIENT_SECTET,
          SPOTIFY_GET_TOKEN,
          SPOT_GET_TRACK,
          SPOT_GET_DEVICES,
        } from '../../Constance/constance';


/**Takes an input string and a keywords and sends back the part of the string after the
 * first instance of that keyword
 * If the keyword is not present, then return the original phrase
 * @param totalPhrase: the input to be cut
 * @param cutWord: the word to be cut after
 */
var afterWord = function (totalPhrase, cutWord) {
  if (totalPhrase.includes(cutWord)) {
      return totalPhrase.substring(totalPhrase.indexOf(cutWord)+cutWord.length).trim();
    }
    return totalPhrase;
}

/** Returns an object with a field type, with the command type to activate,
 * and zero or more supporting fields based on the type code*/
export const parser = function(message, req, res) {
  if(message.includes('potato')) {
    var auth_code = req.auth_code;
    var body = {
      grant_type: 'authorization_code',
      code: auth_code,
      redirect_uri: SPOTIFY_REDIRECT,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECTET,
    }
    var formData = querystring.stringify(body);
    var contentLength = formData.length;
    var instance = axios.create({headers: {'Content-Length': contentLength, 'Content-Type':'application/x-www-form-urlencoded'}})
    const request = instance.post(SPOTIFY_GET_TOKEN, formData)
    const onResolve = function(result, res, req) {
      res.json(
      {
        message: "Your DAYYY is: " + req.body.name,
        file: "Your message is: " + message,
        access_token: result.data.access_token,
        token_type: result.data.token_type,
        expires_in: result.data.expires_in,
        refresh_token: result.data.refresh_token,
        command: 'spotify',
      }
    )
  }
    return {
      command: 'spotify',
      payload: request,
      funct: onResolve,
    }


  }


  else if (message=='play-spot-track') {
    console.log("AYYYY")
    // console.log(req);
    const track_id = req.track_id
    const access_token = req.access_token
    const uris = req.uris
    const context_uri = req.context_uri
    const shuffle = req.shuffle
    var config = {
      headers: {'Authorization': ('Bearer ' + access_token)}
    };
    const onResolve = function(result, res, req) {
      console.log("IN PLAY SPOT TRACK")
      console.log(result)
      res.json(
      {
        message: "Your DAYYY is: " + req.body.name,
        file: "Your message is: " + message,
        payload: result.data,
        command: 'play-track',
      }
    )
  }
  console.log("AAAAA")

  var offset = Math.floor(Math.random() * 95);      // returns a number between 0 and 94

  const devReq = {
    context_uri: context_uri,
    offset: {position: offset}
  }

    // const request = axios.get(`${SPOT_GET_TRACK}` + '/' + `${track_id}`, config)
    const request = axios.put('https://api.spotify.com/v1/me/player/play?device_id=2cdb5a9d9f8db384d50ad8a20214c9d850717d3f', devReq, config)
    // const request = axios.get(`${SPOT_GET_DEVICES}`, config)
    return {
      command: 'play-track',
      payload: request,
      funct: onResolve,
    }

  }

  else if(message.includes("play")) {
    var afterPlay = afterWord(message, "play");
    var matchedFiles = searchFileSystem(afterPlay, AUDIO)
    if (matchedFiles.length == 0) {
      return {
        command: UNDEFINED,
        payload: UNDEFINED
      }
    }
    else if (matchedFiles.length == 1) {
      return {
        comand: OPEN,
        payload: matchedFiles[0]
      }
    }
    else {
      return {
        command: CHOOSE_FILE,
        payload: matchedFiles
      }
    }
  }
  else if(message.includes("open")) {
    var afterOpen = afterWord(message, "open");
    var matchedFiles = searchFileSystem(afterOpen, ANY)
    if (matchedFiles.length == 0) {
      return {
        command: UNDEFINED,
        payload: UNDEFINED
      }
    }
    else if (matchedFiles.length == 1) {
      return {
        comand: OPEN,
        payload: matchedFiles[0]
      }
    }
    else {
      return {
        command: CHOOSE_FILE,
        payload: matchedFiles
      }
    }
  }
  else {

  }

  // let command = commands.PLAY
  // command.file = message;
  // var res = command;
  return "failed parse";
}
