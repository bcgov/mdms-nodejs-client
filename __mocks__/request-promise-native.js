//
// Code Sign
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
// Created by Jason Leach on 2018-05-06.
//

/* eslint-disable no-unused-vars */

'use strict';

import { ORG_GROUP_FULL_LIST, ORG_GROUP_SUB_LIST, AUTH_PAIR } from '../__fixtures__/awOrg-fixtures';

let rpn = jest.genMockFromModule('request-promise-native');

function request(options) {
  return new Promise((resolve, reject) => {
    if (JSON.stringify(options.auth) === JSON.stringify(AUTH_PAIR)) {
      if (options.uri.includes('system/groups')) {
        if (options.uri.includes('2')) {
          if (options.uri.includes('children')) {
            return resolve(JSON.stringify(ORG_GROUP_SUB_LIST));
          }
          return resolve(JSON.stringify(ORG_GROUP_FULL_LIST[1]));
        }
        if (options.uri.includes('1000')) {
          return resolve(JSON.stringify([]));
        }
        return resolve(JSON.stringify(ORG_GROUP_FULL_LIST));
      }
      return reject();
    }
    return reject(Error('Unauthed'));
  });
}

rpn = request;

module.exports = rpn;
