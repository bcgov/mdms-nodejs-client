//
// Code Signing
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
// Created by Shelly Han on 2018-12-19.
//

'use strict';

import { setDefaultRequest, fetchOrgGroups } from '../src/libs/awClient';
import { EXPECTED_ORG_GROUP_1, EXPECTED_ORG_GROUP_2 } from '../__fixtures__/awOrg-fixtures';

jest.mock('request-promise-native');

describe('AirWatch Client should', () => {
  const AUTH_OPTIONS = {
    OPTION_1: {
      host: 'https://test.com',
      token: 'test1',
      username: 'user1',
      password: 'password1',
    },
    OPTION_2: {
      host: 'https://test.com',
      token: 'test1',
      password: 'password1',
    },
  };

  const ORG_GROUP_OPTIONS = {
    OPTION_1: {
      headers: {
        'Content-Type': 'application/json',
        'aw-tenant-code': 'test1',
      },
      auth: {
        user: 'user1',
        pass: 'password1',
      },
      uri: 'https://test.com/api/system/groups/1/children',
      method: 'GET',
    },
    OPTION_2: {
      headers: {
        'Content-Type': 'application/json',
        'aw-tenant-code': 'test1',
      },
      auth: {
        user: 'user1',
        pass: 'password2',
      },
      uri: 'https://test.com/api/system/groups/1',
      method: 'GET',
    },
  };

  test('fetch all of organization groups as defualt', async () => {
    const option = ORG_GROUP_OPTIONS.OPTION_1;
    const orgGroupList = await fetchOrgGroups(option);
    expect(orgGroupList).toEqual(EXPECTED_ORG_GROUP_1);
  });

  test('fetch full info fo the organization group when OrgId specified', async () => {
    const option = ORG_GROUP_OPTIONS.OPTION_1;
    const orgGroupList = await fetchOrgGroups(option, 2);
    expect(orgGroupList).toEqual(EXPECTED_ORG_GROUP_2);
  });

  test('throw when not authed', async () => {
    const option = ORG_GROUP_OPTIONS.OPTION_2;
    await expect(fetchOrgGroups(option)).rejects.toThrow(
      'Cannot find list of organization groups: Unauthed'
    );
  });

  test('set the default request with authentication options', () => {
    const expected = {
      auth: { pass: 'password1', user: 'user1' },
      headers: {
        'Content-Type': 'application/json',
        'aw-tenant-code': 'test1',
      },
    };
    const option = AUTH_OPTIONS.OPTION_1;
    const defaultReq = setDefaultRequest(option);
    expect(defaultReq).toEqual(expected);
  });

  test('setDefaultRequest handles when missing options', () => {
    const option = AUTH_OPTIONS.OPTION_2;
    expect(() => {
      setDefaultRequest(option);
    }).toThrow('The service account username must be provided');
  });
});
