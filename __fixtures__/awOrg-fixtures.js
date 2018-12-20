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
// Created by Shelly Han on 2018-12-19.
//

'use strict';

export const ORG_GROUP_ARRAY = [
  {
    Name: 'org 2',
    GroupId: 'org2',
    LocationGroupType: 'Container',
    Country: 'Canada',
    Locale: 'en-US',
    ParentLocationGroup: {
      Id: {
        Value: 574,
      },
      Uuid: '000',
    },
    CreatedOn: '4/19/2016 8:38:35 PM',
    LgLevel: 0,
    Users: '17139',
    Admins: '164',
    Devices: '5',
    Id: {
      Value: 2,
    },
    Uuid: '222',
  },
  {
    Name: 'org 3',
    GroupId: 'org3',
    LocationGroupType: 'Container',
    Country: 'Canada',
    Locale: 'en-US',
    ParentLocationGroup: {
      Id: {
        Value: 574,
      },
      Uuid: '000',
    },
    CreatedOn: '4/19/2016 10:16:51 PM',
    LgLevel: 1,
    Users: '0',
    Admins: '0',
    Devices: '198',
    Id: {
      Value: 3,
    },
    Uuid: '333',
  },
  {
    Name: 'org 4',
    GroupId: 'org4',
    LocationGroupType: 'Container',
    Country: 'Canada',
    Locale: 'en-US',
    ParentLocationGroup: {
      Id: {
        Value: 2,
      },
      Uuid: '222',
    },
    CreatedOn: '4/19/2016 10:17:19 PM',
    LgLevel: 1,
    Users: '1',
    Admins: '0',
    Devices: '785',
    Id: {
      Value: 4,
    },
    Uuid: '444',
  },
];

export const EXPECTED_ORG_GROUP_1 = [
  { GroupId: 'org2', Id: 2, Name: 'org 2', ParentId: 574, Uuid: '222' },
  { GroupId: 'org3', Id: 3, Name: 'org 3', ParentId: 574, Uuid: '333' },
];

export const EXPECTED_ORG_GROUP_2 = [
  {
    Admins: '164',
    Country: 'Canada',
    CreatedOn: '4/19/2016 8:38:35 PM',
    Devices: '5',
    GroupId: 'org2',
    Id: { Value: 2 },
    LgLevel: 0,
    Locale: 'en-US',
    LocationGroupType: 'Container',
    Name: 'org 2',
    ParentLocationGroup: { Id: { Value: 574 }, Uuid: '000' },
    Users: '17139',
    Uuid: '222',
  },
];

export const AUTH_PAIR = { user: 'user1', pass: 'password1' };
