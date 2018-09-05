'use strict';
import {
  dummy,
  parse,
  audio_demo,
  audio_dummy,
  get_file,
  spotify_play,
  spotify_pause,
  spotify_seek,
  spotify_search,
} from '../controllers/controller'

export const routes = function(app) {

  // todoList Routes
  app.route('/dummy')
    .get(dummy)
    .post(parse);

  app.route('/dummy/music')
    .post(audio_demo)
    .get(audio_dummy);

  app.route('/file')
    .post(get_file);

  app.route('/spotify/play')
    .put(spotify_play)

  app.route('/spotify/pause')
    .put(spotify_pause)

  app.route('/spotify/seek')
    .put(spotify_seek)

  app.route('/spotify/seek')
    .put(spotify_search)

  app.route('/tasks/:taskId');

};
