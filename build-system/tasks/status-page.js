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
const argv = require('minimist')(process.argv.slice(2));
const fetch = require('node-fetch');

const statusPageUrl = 'https://api.statuspage.io/v1/pages/amphtml';
const releaseUrl = 'https://github.com/ampproject/amphtml/releases/tag';

async function post(params, payload) {
  const url = `${statusPageUrl}/${params}`;
  return fetch(url, {method: 'POST', body: payload}).then((res) => res.json());
}

async function get(params) {
  const url = `${statusPageUrl}/${params}`;
  return fetch(url).then((res) => res.json());
}

const templates = (versions, description) => {
  return {
    'investigating': `We are investigating reports of ${description} that is seen in ${versions.join(
      ' and '
    )}`,
    'identified': 'The issue has been identified and a fix is underway.',
    'monitoring': `The fix has been deployed and is being rolled out to the CDN. \n
      Please allow up to 30 minutes for the CDN to pick up the fix.`,
    'resolved': `The fix has been confirmed on ${versions.join(' and ')}. \n
      This incident has been resolved.`,
  };
};

async function createIncident(versions, channels, description, components) {
  const incident = {
    'name': `Incident in ${channels.join(' and ').toUpperCase()}`,
    'body': templates(versions, description).investigating,
    'status': 'investigating',
    'component_ids': components,
  };
  await post('incidents', incident);
}

/**
 *
 * @param {*} versions
 * @return {Promise<Object|void>}
 */
async function getIncident(versions) {
  const versionsString = `${versions.join(' and ')}`;
  const incidents = await getUnresolvedIncidents();
  incidents.forEach((incident) => {
    incident.incident_updates.forEach((update) => {
      if (update.body.contains(versionsString)) {
        return incident;
      }
    });
  });
}

async function getUnresolvedIncidents() {
  return get('incidents/unresolved');
}

async function updateIncident(incidentId, versions, status, components) {
  const update = {
    'name': 'Incident update',
    'body': templates(versions)[status],
    'status': status,
    'component_ids': components,
  };
  await post(`incidents/${incidentId}`, update);
}

async function statusPage() {
  const {
    versions,
    description,
    channels,
    components,
    statusFrom,
    statusTo,
  } = argv;

  let incident = await getIncident(versions);
  if (!incident) {
    incident = await createIncident(
      versions,
      channels,
      description,
      components
    );
  }
  const updates = [];
  const statusFromIndex = templates.findIndex((status, value) => {
    return status == statusFrom;
  });
  const statusToIndex = templates.findIndex((status, value) => {
    return status == statusTo;
  });
  const index = statusFromIndex + 1;
  while (index <= statusToIndex) {
    updates.push(
      await updateIncident(incident.id, versions, templates, components)
    );
  }
  await updateIncident(incident.id, versions, statusTo, components);
}

export {statusPage};
statusPage.description = '';
statusPage.flags = {};
