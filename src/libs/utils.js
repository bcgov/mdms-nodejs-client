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

/**
 * Create the default request with basic auth options
 * @param {Object} options contains the AW host, aw-tenant-code and user credential pair
 * @return request with auth params
 */
export const defaultRequestParams = options => {
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
 * Get airwatch system info, serve as a health check of the request
 * @param {Object} options contains the AW host, aw-tenant-code and user credential pair
 * @return system info
 */
export const checkAWRequest = async options => {
  try {
    const defaultReq = defaultRequestParams(options);
    const defaultOpt = {
      ...defaultReq,
      ...{
        uri: url.resolve(options.host, AW_SUB_URL.SYS_INFO),
        method: 'GET',
      },
    };

    const res = await request(defaultOpt);
    const jsonRes = JSON.parse(res);
    return jsonRes;
  } catch (err) {
    throw new Error(`Cannot connect to AirWatch server: ${err}`);
  }
};
