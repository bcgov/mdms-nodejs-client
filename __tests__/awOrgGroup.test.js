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

import { getAllOrgGroups, getOrgGroupDetail } from '../src/libs/awOrgGroup';
import { EXPECTED_ALL_ORG_GROUP, EXPEXTED_ORG_GROUP_DETAIL } from '../__fixtures__/awOrg-fixtures';

jest.mock('request-promise-native');

describe('AirWatch Organization Group helps should', () => {
  const AUTH_OPTIONS = {
    OPTION_1: {
      host: 'https://test.com',
      tenantCode: 'test1',
      username: 'user1',
      password: 'password1',
    },
    OPTION_2: {
      host: 'https://test.com',
      tenantCode: 'test1',
      password: 'password1',
    },
  };

  test('fetch all of organization groups', async () => {
    const orgGroupList = await getAllOrgGroups(AUTH_OPTIONS.OPTION_1, 1, false);
    expect(orgGroupList).toEqual(EXPECTED_ALL_ORG_GROUP.LIST_1);
  });

  test('fetch all of organization groups with children', async () => {
    const orgGroupList = await getAllOrgGroups(AUTH_OPTIONS.OPTION_1, 1, true);
    expect(orgGroupList).toEqual(EXPECTED_ALL_ORG_GROUP.LIST_2);
  });

  test('does not find any match org groups', async () => {
    const orgGroupList = await getAllOrgGroups(AUTH_OPTIONS.OPTION_1, 1000, true);
    expect(orgGroupList).toEqual([]);
  });

  test('handles when fail to fetch all of organization groups', async () => {
    await expect(getAllOrgGroups(AUTH_OPTIONS.OPTION_2, 0, false)).rejects.toThrow(
      'The service account username must be provided'
    );
  });

  test('fetch list of organization groups', async () => {
    const orgGroupList = await getOrgGroupDetail(AUTH_OPTIONS.OPTION_1, 2, false);
    expect(orgGroupList).toEqual(EXPEXTED_ORG_GROUP_DETAIL.LIST_1);
  });

  test('fetch list of organization groups with children', async () => {
    const orgGroupList = await getOrgGroupDetail(AUTH_OPTIONS.OPTION_1, 2, true);
    expect(orgGroupList).toEqual(EXPEXTED_ORG_GROUP_DETAIL.LIST_2);
  });

  test('does not find any match org groups for the id', async () => {
    const orgGroupList = await getOrgGroupDetail(AUTH_OPTIONS.OPTION_1, 1000, false);
    expect(orgGroupList).toEqual([]);
  });

  test('handles when fail to fetch list of organization groups', async () => {
    await expect(getOrgGroupDetail(AUTH_OPTIONS.OPTION_2, 0, false)).rejects.toThrow(
      'The service account username must be provided'
    );
  });
});
