// Uncomment these imports to begin using these cool features!

import {get, response} from '@loopback/rest';
import {ANDROID_FILE} from '../utils/app/asset-link';

export class WellKnownController {
  constructor() {}
  @get('/.well-known/assetlinks.json')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'object',
        },
      },
    },
  })
  async assetlinksJson(): Promise<object> {
    return ANDROID_FILE;
  }
}
