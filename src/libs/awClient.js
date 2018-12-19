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
// Created by Jason Leach on 2018-01-15.
//

'use strict';

import request from 'request-promise-native';
import url from 'url';
import { AW_SUB_URL, AW_ROOT_ORG_GROUP_ID } from '../constants';

/**
 * Create the default request header with basic auth options
 * @param {Object} options contains the AW host, aw-tenant-code and user credential pair
 * @return request header with auth params
 */
const setDefaultRequest = options => {
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
 * @param {Object} req the request with auth and action options
 * @return array of organization groups with specified attributes
 */
const fetchOrgGroups = async req => {
  try {
    const res = await request(req);
    const jsonRes = JSON.parse(res);
    const filteredOrgs = jsonRes.filter(
      org => org.ParentLocationGroup.Id.Value === AW_ROOT_ORG_GROUP_ID
    );
    const targetOrgs = filteredOrgs.map(org => ({
      Name: org.Name,
      GroupId: org.GroupId,
      ParentId: org.ParentLocationGroup.Id.Value,
      Uuid: org.Uuid,
    }));

    return targetOrgs;
  } catch (err) {
    return err;
  }
};

/**
 * AirWatch client
 * @param {Object} authOptions contains the AW host, aw-tenant-code and user credential pair
 * @param {Object} actionOptions contains the specific options for different requests, optional
 */
export class AWClient {
  constructor(authOptions, actionOptions) {
    if (!authOptions || Object.keys(authOptions).length !== 4) {
      throw new Error('Invalid authentication options');
    }
    this.authOptions = authOptions;
    this.actionOptions = actionOptions;
  }

  async allOrgGroups() {
    const subUrl = AW_SUB_URL.ORG_GROUP.concat(AW_ROOT_ORG_GROUP_ID, AW_SUB_URL.ORG_GROUP_CHILDREN);
    this.authHeader = setDefaultRequest(this.authOptions);
    // conbine the request header
    const options = {
      ...this.authHeader,
      ...{
        uri: url.resolve(this.authOptions.host, subUrl),
        method: 'GET',
      },
    };
    try {
      const orgGroupList = await fetchOrgGroups(options);
      return orgGroupList;
    } catch (err) {
      throw Error('Cannot get list of organization groups: ', err);
    }
  }
}
