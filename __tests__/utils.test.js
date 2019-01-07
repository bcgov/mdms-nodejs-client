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

import { defaultRequestParams } from '../src/libs/utils';

jest.mock('request-promise-native');

describe('AirWatch helper functions should', () => {
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

  test('set the default request with authentication options', () => {
    const expected = {
      auth: { pass: 'password1', user: 'user1' },
      headers: {
        'Content-Type': 'application/json',
        'aw-tenant-code': 'test1',
      },
    };
    const option = AUTH_OPTIONS.OPTION_1;
    const defaultReq = defaultRequestParams(option);
    expect(defaultReq).toEqual(expected);
  });

  test('defaultRequestParams handles when missing options', () => {
    const option = AUTH_OPTIONS.OPTION_2;
    expect(() => {
      defaultRequestParams(option);
    }).toThrow('The service account username must be provided');
  });
});
