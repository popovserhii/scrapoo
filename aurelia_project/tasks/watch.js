import gulp from 'gulp';
import minimatch from 'minimatch';
import gulpWatch from 'gulp-watch';
import debounce from 'debounce';
import { build } from 'aurelia-cli';
import project from '../aurelia.json';
import transpile from './transpile';
import processMarkup from './process-markup';
import processCSS from './process-css';
import copyFiles from './copy-files';

const debounceWaitTime = 100;
let isBuilding = false;
let pendingRefreshPaths = [];
let watchCallback = () => { };
let watches = [
  { name: 'transpile', callback: transpile, _config: project.transpiler._config },
  { name: 'markup', callback: processMarkup, _config: project.markupProcessor._config },
  { name: 'CSS', callback: processCSS, _config: project.cssProcessor._config }
];

if (typeof project.build.copyFiles === 'object') {
  for (let src of Object.keys(project.build.copyFiles)) {
    watches.push({ name: 'file copy', callback: copyFiles, _config: src });
  }
}

let watch = (callback) => {
  watchCallback = callback || watchCallback;

  // watch every glob individually
  for(let watcher of watches) {
    if (Array.isArray(watcher._config)) {
      for(let glob of watcher._config) {
        watchPath(glob);
      }
    } else {
      watchPath(watcher._config);
    }
  }
};

let watchPath = (p) => {
  gulpWatch(
    p,
    {
      read: false, // performance optimization: do not read actual file contents
      verbose: true
    },
    (vinyl) => processChange(vinyl));
};

let processChange = (vinyl) => {
  if (vinyl.path && vinyl.cwd && vinyl.path.startsWith(vinyl.cwd)) {
    let pathToAdd = vinyl.path.substr(vinyl.cwd.length + 1);
    log(`Watcher: Adding path ${pathToAdd} to pending build changes...`);
    pendingRefreshPaths.push(pathToAdd);
    refresh();
  }
}

let refresh = debounce(() => {
  if (isBuilding) {
    log('Watcher: A build is already in progress, deferring change detection...');
    return;
  }

  isBuilding = true;

  let paths = pendingRefreshPaths.splice(0);
  let refreshTasks = [];

  // determine which tasks need to be executed
  // based on the files that have changed
  for (let watcher of watches) {    
    if (Array.isArray(watcher._config)) {
      for(let source of watcher._config) {
        if (paths.find(path => minimatch(path, source))) {
          refreshTasks.push(watcher);
        }
      }
    }
    else {
      if (paths.find(path => minimatch(path, watcher._config))) {
        refreshTasks.push(watcher);
      }
    }
  }

  if (refreshTasks.length === 0) {
    log('Watcher: No relevant changes found, skipping next build.');
    isBuilding = false;
    return;
  }

  log(`Watcher: Running ${refreshTasks.map(x => x.name).join(', ')} tasks on next build...`);

  let toExecute = gulp.series(
    readProjectConfiguration,
    gulp.parallel(refreshTasks.map(x => x.callback)),
    writeBundles,
    (done) => {
      isBuilding = false;
      watchCallback();
      done();
      if (pendingRefreshPaths.length > 0) {
        log('Watcher: Found more pending changes after finishing build, triggering next one...');
        refresh();
      }
    }
  );

  toExecute();
}, debounceWaitTime);

function log(message) {
  console.log(message);
}

function readProjectConfiguration() {
  return build.src(project);
}

function writeBundles() {
  return build.dest();
}

export default watch;