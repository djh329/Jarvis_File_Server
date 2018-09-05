var fs = require('fs');
var path = require('path');
var config = require('../../config/config')
config = config.config
var constance = require('../../Constance/constance');

// FILE LOCATIONS
// var ROOT = constance.root
// var DOCUMENTS = constance.documents
// var SONGS = constance.songs

import {DOCUMENTS, SONGS, ROOT} from '../../Constance/constance'

import {
  TEXT,
  AUDIO,
  ANY,
} from './commands'


function onFileError(err) {
  // console.log(err)
}

function findFileCallback(files) {
  console.log(files)
}

/** Returns the number of words the "str1" has in common with "str2" */
function wordsInCommon(str1, str2) {
  var str2Set = new Set()
  var inCommon = 0;
  str2.split(" ").forEach(function (word) {str2Set.add(word)})
  str1.split(" ").forEach(function (word) {
    if (str2Set.has(word)) {
      inCommon++
    }
  })
  return inCommon
}

/** Returns the number of words "str" has in common with the set "set"
 * Comparisons are case sensitive
 * A single word is not counted twice. That is, if the string is a "a test
 * is a test.", and the set is {is, test}, the number of matches will be 2,
 * not 3*/
function wordsInSet(str, set) {
  var inCommon = 0;
  var counted = new Set();
  str.split(" ").forEach(function (word) {
    if (set.has(word) && !counted.has(word)) {
      counted.add(word);
      inCommon++;
    }
  })
  str.split("_").forEach(function (word) {
    if (set.has(word) && !counted.has(word)) {
      counted.add(word);
      inCommon++;
    }
  })
  return inCommon
}

/** Returns the number of words in fileName that also appear in keyterm.
 * Comparisons are case insensitive
 * @param fileName: the name of the files
 * @param keyterm: the key phrase to match against
 */
function numMatches(fileName, keyterm) {
  let keySet = new Set()
  keyterm.split(" ").forEach(function (word) {
    word.split("_").forEach(function (word) {
      keySet.add(word.toLowerCase())
    })
  })
  console.log(keySet)
  let numMatches = wordsInSet(fileName.toLowerCase(), keySet)
  return numMatches
}

/** Returns true if this file is black listed as a directory Jarvis does
 * not have access to */
function isBlackListedDir(dir, fileType) {
  var isBlack = false;
  function checkBlack(blacked) {
    if (dir.toLowerCase().includes(blacked.toLowerCase())) {
      isBlack = true;
      return false;
    }
  }
  config.general_black_list.forEach(checkBlack)
  if(!isBlack) {
  switch (fileType) {
    case AUDIO:
    break;
    default:
  }
  }
  return isBlack;
  }

  var minMatches = 0
  var matchedFiles = []

  /** If an extension is of the correct file type for the given file type,
   * return true */
  function correctFileType(extension, fileType) {
    switch(fileType) {
      case AUDIO:
      return (config.audio_file_types.indexOf(extension) > -1)
      case TEXT:
      return (config.text_file_types.indexOf(extension) > -1)
      case ANY:
      return true
      default:
      return true
    }
  }


/** Recurseively searches the directory specified for matches to the specified
 * term to match. fileType is the type of file to be searched for
 * @param dir: the directory to search in
 * @param keyterm: the phrase we are looking to match to
 * @param fileType: A "FileType" enum, aiding where to search for the file
 * @param isRec: is true if the function is called recursively. This field
 * should never be set outside of this method
 */
function recursiveFileSearch(dir, keyterm, fileType, root, isRec=false) {
  // fs.readdir(dir, function(err, files) {
  var files = fs.readdirSync(dir)
    files.forEach(function(fileName) {
      if(fileName.length > 1 && (!(fileName.substring(0,1) == '.' || fileName.substring(0,1) == '_'))) {
      var file = path.resolve(dir,fileName)
      if (fs.existsSync(file)) {
      var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
          if (!(isBlackListedDir(fileName, fileType))) {
          recursiveFileSearch(file, keyterm, fileType, root, true)
        }
        }
        else if (stat && stat.isFile()) {
          var noExtension = fileName.split('.')[0]
          if (correctFileType(fileName.split('.')[1], fileType)) {
          var matches = numMatches(noExtension,keyterm)
          if(matches > minMatches) {
            matchedFiles=[]
            matchedFiles.push(path.relative(root, file))
            minMatches=matches
          }
          else if (matches!=0 && matches == minMatches) {
            matchedFiles.push(path.relative(root, file))
          }
        }
        }
        else {
          // onFileError(err)
      }
    }
    }
    })
    if(!isRec) {
      return matchedFiles;
    }
  // })
}

/** Searches the file system for a file that relates to keyterm
 * @param keyterm: the phrase we are looking to match to
 * @param fileType: A "FileType" enum, aiding where to search for the file
 */
export var searchFileSystem = function (keyterm, fileType=TEXT) {
  minMatches = 0
  matchedFiles = []
  var matches = []
  console.log("HERH",DOCUMENTS);
  switch(fileType) {
    case AUDIO:
      matches = recursiveFileSearch(SONGS, keyterm, fileType, DOCUMENTS)
      break;
    case TEXT:
      matches = recursiveFileSearch(DOCUMENTS, keyterm, fileType, DOCUMENTS)
      break;
    default:
      matches = recursiveFileSearch(DOCUMENTS, keyterm, fileType, DOCUMENTS)
  }
  console.log(minMatches)
  matches.forEach(function(file) {findFileCallback(file)})
  return matches;
}

// export searchFileSystem
