//
// mdms-nodejs-client
//
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Han on 2018-12-18.
//

'use strict';

import request from 'request-promise-native';
import url from 'url';
import { AW_SUB_URL, AW_ROOT_ORG_GROUP_ID } from '../constants';

/**
 * Create the default request with basic auth options
 * @param {Object} options contains the AW host, aw-tenant-code and user credential pair
 * @return request with auth params
 */
export const setDefaultRequest = options => {
  if (!options.host) throw new Error('A airwatch host url must be provided');
  if (!options.token) throw new Error('The aw-tenant-code must be provided');
  if (!options.username) throw new Error('The service account username must be provided');
  if (!options.password) throw new Error('The service account password must be provided');

  return {
    headers: {
      'Content-Type': 'application/json',
      'aw-tenant-code': options.token,
    },
    auth: {
      user: options.username,
      pass: options.password,
    },
  };
};

/**
 * Fetch list of organization groups
 * @param {Object} options the request with auth and action options
 * @param {int} orgID the Organization ID, default to be the root org
 * @return array of organization groups with specified attributes
 */
export const fetchOrgGroups = async (options, orgID) => {
  try {
    const res = await request(options);
    const jsonRes = JSON.parse(res);
    const filteredOrgs =
      orgID === undefined
        ? jsonRes.filter(org => org.ParentLocationGroup.Id.Value === AW_ROOT_ORG_GROUP_ID)
        : jsonRes.filter(org => org.Id.Value === orgID);
    if (orgID) {
      return filteredOrgs;
    }
    const targetOrgs = filteredOrgs.map(org => ({
      Name: org.Name,
      GroupId: org.GroupId,
      Id: org.Id.Value,
      ParentId: org.ParentLocationGroup.Id.Value,
      Uuid: org.Uuid,
    }));

    return targetOrgs;
  } catch (err) {
    throw new Error(`Cannot find list of organization groups: ${err}`);
  }
};

/**
 * AirWatch client
 * @param {Object} authOptions contains the AW host, aw-tenant-code and user credential pair
 */
export class AWClient {
  constructor(authOptions) {
    if (!authOptions || Object.keys(authOptions).length !== 4) {
      throw new Error('Invalid authentication options');
    }
    this.authOptions = authOptions;
  }

  /**
   * Fetch aw organization groups
   * @param {int} orgID optional. if not specified, return list of all org groups
   */
  async findOrgGroups(orgID) {
    const subUrl =
      orgID === undefined
        ? AW_SUB_URL.ORG_GROUP.concat(AW_ROOT_ORG_GROUP_ID, AW_SUB_URL.ORG_GROUP_CHILDREN)
        : AW_SUB_URL.ORG_GROUP.concat(orgID, AW_SUB_URL.ORG_GROUP_CHILDREN);
    this.defaultReq = setDefaultRequest(this.authOptions);
    // conbine the request options
    const options = {
      ...this.defaultReq,
      ...{
        uri: url.resolve(this.authOptions.host, subUrl),
        method: 'GET',
      },
    };
    return fetchOrgGroups(options, orgID);
  }
}
