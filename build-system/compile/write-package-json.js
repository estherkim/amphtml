/**
 * Copyright 2021 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview
 * Creates a package.json for a given extension to be published on npm.
 *
 * The Github Action that runs this is triggered by releases. See .github/workflows/publish-npm-packages.yml
 */

const [extension, extensionVersion, ampVersion] = process.argv.slice(2);
const {readFile, stat, writeFile} = require('fs/promises');

async function writePackageJson() {
  stat(`extensions/${extension}/${extensionVersion}`, (_, stats) => {
    if (!stats.isDirectory()) {
      console.log(`${extension} ${extensionVersion} does not exist; skipping`);
      return;
    }
  });

  const major = extensionVersion.split('.', 1);
  const minor = ampVersion.slice(0, 10);
  const patch = Number(ampVersion.slice(-3));
  const json = {
    name: `@estherproject/${extension}`,
    version: `${major}.${minor}.${patch}`,
    description: `AMP HTML ${extension} Component`,
    author: 'The AMP HTML Authors',
    license: 'Apache-2.0',
    main: 'dist/component.js',
    module: 'dist/component.mjs',
    exports: {
      '.': './preact',
      './preact': {
        import: 'dist/component-preact.mjs',
        require: 'dist/component-preact.js',
      },
      './react': {
        import: 'dist/component-react.mjs',
        require: 'dist/component-react.js',
      },
    },
    files: ['dist/*'],
    repository: {
      type: 'git',
      url: 'https://github.com/estherkim/amphtml.git',
      directory: `extensions/${extension}/${extensionVersion}`,
    },
    homepage: `https://github.com/estherkim/amphtml/tree/master/extensions/${extension}/${extensionVersion}`,
    peerDependencies: {
      preact: '^10.2.1',
      react: '^17.0.0',
    },
  };

  writeFile(
    `extensions/${extension}/${extensionVersion}/package.json`,
    JSON.stringify(json)
  ).catch((e) => {
    console./*OK*/ error(e);
    process.exitCode = 1;
  });
  console./*OK*/ log('Wrote package.json for', extension, extensionVersion);
}

writePackageJson();
