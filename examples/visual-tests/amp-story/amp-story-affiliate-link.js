/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
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
'use strict';

const {verifySelectorsVisible} = require('../../../build-system/tasks/visual-diff/helpers');

module.exports = {
  'tapping on an affiliate link should expand the link': async (page, name) => {
    const screen = page.touchscreen;
    await screen.tap(200, 240);
    await page.waitFor('amp-story-page#page-1[active]');
    await page.waitFor(150); // For animations to finish.
    await screen.tap(200, 240);
    await page.waitFor('amp-story-page#page-2[active]');
    await page.waitFor(150); // For animations to finish.
    await page.tap('a#blink-1');
    await page.waitFor(1500); // For animations to finish.
  },

  '[RTL] tapping on an affiliate link should expand the link': async (page, name) => {
    const screen = page.touchscreen;
    await page.$eval('body', e => e.setAttribute('dir', 'rtl'));
    await screen.tap(200, 240);
    await page.waitFor('amp-story-page#page-1[active]');
    await page.waitFor(150); // For animations to finish.
    await screen.tap(200, 240);
    await page.waitFor('amp-story-page#page-2[active]');
    await page.waitFor(150); // For animations to finish.
    await page.tap('a#blink-1');
    await page.waitFor(1500); // For animations to finish.
  }
}
