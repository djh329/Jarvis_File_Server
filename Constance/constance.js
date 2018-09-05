exports.files = 'files'

var documents = '../../../'
exports.documents = documents
exports.root = documents + '..\/'
exports.songs = documents + 'songs/'
exports.fsurl = 'http://localhost:8081/'

export const DOCUMENTS = '../../../'
export const SONGS = DOCUMENTS + 'songs/'
export const ROOT = DOCUMENTS + '..\/'
export const FSURL = 'http://localhost:8081/'


//SPOTIFY
export const SPOTIFY_AUTH = 'https://accounts.spotify.com/authorize/'
export const SPOTIFY_CLIENT_ID = 'aa5500934aeb47e89a4fd17387928f73'
import {SPOT_SEC} from './secretkey'
export const SPOTIFY_CLIENT_SECTET = SPOT_SEC
export const SPOTIFY_REDIRECT = 'http://localhost:8080/callback'
export const SPOTIFY_GET_TOKEN = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_SCOPE = 'playlist-read-private'
export const SPOT_URL = `${SPOTIFY_AUTH}`+`?client_id=`+`${SPOTIFY_CLIENT_ID}`+`&response_type=code&redirect_uri=`+`${SPOTIFY_REDIRECT}`+`&scope=`+`${SPOTIFY_SCOPE}`;
export const SPOT_GET_TRACK = 'https://api.spotify.com/v1/tracks'
export const SPOT_GET_DEVICES = 'https://api.spotify.com/v1/me/player/devices'

export const DEV_ID = '2cdb5a9d9f8db384d50ad8a20214c9d850717d3f'
//SPOTIFY_CLIENT
export const SDK_BASE = 'https://api.spotify.com'
export const SPOTIFY_PLAY = SDK_BASE + '/v1/me/player/play'
export const SPOTIFY_PAUSE = SDK_BASE + '/v1/me/player/pause'
export const SPOTIFY_SEEK = SDK_BASE + '/v1/me/player/seek'
export const SPOTIFY_SEARCH = SDK_BASE + '/v1/search'
