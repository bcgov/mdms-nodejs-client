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
import { AW_SUB_URL } from '../constants';
import { defaultRequestParams } from './utils';

/**
 * Generate array of child organization groups
 * @param {Object} jsonRes the full list
 * @param {Integer} parentOrgID the parent Organization Group ID
 * @return array of organization groups
 */
export const childrenList = (jsonRes, parentOrgID) => {
  try {
    return jsonRes
      .filter(org => org.ParentLocationGroup.Id.Value === parentOrgID)
      .map(org => ({
        name: org.Name,
        groupId: org.GroupId,
        id: org.Id.Value,
        parentId: org.ParentLocationGroup.Id.Value,
        uuid: org.Uuid,
      }));
  } catch (err) {
    return [];
  }
};

/**
 * Fetch all organization groups
 * @param {Object} credential the authentication options
 * @param {Integer} rootOrgID the root Organization Group ID
 * @param {Boolean} includeChildren include the array of child org groups
 * @return array of organization groups
 */
export const getAllOrgGroups = async (credential, rootOrgID, includeChildren) => {
  // check and set default request header and auth
  const defaultReq = defaultRequestParams(credential);
  // set the sub-url of the request
  const subUrl = AW_SUB_URL.ORG_GROUP.concat(rootOrgID, AW_SUB_URL.ORG_GROUP_CHILDREN);
  // combine the request option
  const options = {
    ...defaultReq,
    ...{
      uri: url.resolve(credential.host, subUrl),
      method: 'GET',
    },
  };

  try {
    const res = await request(options);
    const jsonRes = JSON.parse(res);

    // get all org groups directly under root org group
    const topLevelOrgGroups = childrenList(jsonRes, rootOrgID);
    if (!includeChildren) return topLevelOrgGroups;

    const allOrgGroups = topLevelOrgGroups.map(org => ({
      ...org,
      ...{ children: childrenList(jsonRes, org.id) },
    }));
    return allOrgGroups;
  } catch (err) {
    throw new Error(`Cannot get all of organization groups: ${err}`);
  }
};

/**
 * Get the details of an organization group
 * @param {Object} credential the authentication options
 * @param {Integer} orgID the Organization Group ID to look for
 * @param {Boolean} includeChildren include the array of child org groups
 * @return array of organization groups
 */
export const getOrgGroupDetail = async (credential, orgID, includeChildren) => {
  // check and set default request header and auth
  const defaultReq = defaultRequestParams(credential);
  // set the sub-url of the request
  const subUrl = includeChildren
    ? AW_SUB_URL.ORG_GROUP.concat(orgID, AW_SUB_URL.ORG_GROUP_CHILDREN)
    : AW_SUB_URL.ORG_GROUP.concat(orgID);
  // combine the request option
  const options = {
    ...defaultReq,
    ...{
      uri: url.resolve(credential.host, subUrl),
      method: 'GET',
    },
  };

  try {
    const res = await request(options);
    const jsonRes = JSON.parse(res);
    // return full detail, not children info
    if (!includeChildren) return jsonRes;
    const orgGroupDetail = jsonRes.filter(org => org.Id.Value === orgID);
    // Org group has no children
    if (jsonRes.length === 1) {
      return { ...orgGroupDetail[0], ...{ children: [] } };
    }
    // Org group has list of children

    return { ...orgGroupDetail[0], ...{ children: childrenList(jsonRes, orgID) } };
  } catch (err) {
    throw new Error(`Cannot get the list of organization groups: ${err}`);
  }
};
