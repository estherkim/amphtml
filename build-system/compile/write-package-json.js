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
 * Creates a package.json for a given extension and release to be published on npm.
 *
 * The Github Action that runs this is triggered by releases. See .github/workflows/publish-npm-packages.yml
 */

const [extension, ampversion] = process.argv.slice(2);
const {writeFile} = require('fs/promises');

function generatePackageJson(extension, version) {
  const json = {
    name: `@estherproject/${extension}`,
    version: getNpmVersion(),
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
        require: 'dist/component.react.js',
      },
    },
    files: ['dist/*'],
    repository: {
      type: 'git',
      url: 'https://github.com/ampproject/amphtml.git',
      directory: `extensions/${extension}/${version}`,
    },
    homepage: `https://github.com/ampproject/amphtml/tree/master/extensions/${extension}/${version}`,
    peerDependencies: {
      preact: '^10.2.1',
      react: '^17.0.0',
    },
  };

  const jsonFile = `extensions/${extension}/${version}/package.json`;
  writeFile(jsonFile, JSON.stringify(json)).catch((e) => {
    console./*OK*/ error(e);
    process.exitCode = 1;
  });
  console./*OK*/ log('Wrote', jsonFile);
}

function getNpmVersion() {
  return 'estherversion';
}

function main() {
  console.log('AMP version', ampversion);
  generatePackageJson(extension, '1.0');
}

main();
