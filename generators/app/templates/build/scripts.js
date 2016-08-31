/*eslint-env node */
var chalk = require('chalk'),
	argv = require('yargs').argv,
	pack = require('../package'),
	config = require('../server/config');

import {spawnCmd} from './utils'

export function deploy(cb) {
  console.log(chalk.green(`Deploying image: ${pack.namespace} v${pack.version} on port ${config.deployPort}`));
  
  spawnCmd({
    cmd: './build/deploy.sh',
    args: [pack.namespace, pack.version, config.deployPort]
  }).then(() => {
    console.log(chalk.green(`Image ${pack.namespace} v${pack.version} deployed successfully!`));
    cb();
  }).catch(err => {
    console.error(err);
    cb(err);
  })
}

export function build(cb) {
	console.log(chalk.green(`Building image: ${pack.namespace} v${pack.version}`));
  
  spawnCmd({
    cmd: './build/build.sh',
    args: [pack.namespace, pack.version]
  }).then(() => {
    console.log(chalk.green(`Image ${pack.namespace} v${pack.version} built successfully!`));
    cb();
  }).catch(err => {
    console.error(err);
    cb(err);
  })
}

export function launch(cb) {
	console.log(chalk.green(`Launching image: ${pack.namespace} v${pack.version}`));
  
  spawnCmd({
    cmd: 'sink',
    args: [`${pack.namespace}_web`]
  }).then(() =>
    spawnCmd({
      cmd: 'docker',
      args: ['run', '--name', `${pack.namespace}_web`, '--restart=always', '-d', '-p', `127.0.0.1:${config.deployPort}:80`, `${pack.namespace}/web:latest`]
    })
  ).then(() => console.log(chalk.green(`Image ${pack.namespace} v${pack.version} launched successfully!`))).catch(err => {
    console.error(err);
    cb(err);
  })
}
