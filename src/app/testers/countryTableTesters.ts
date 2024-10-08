// testers/countryTableTester.ts

import { rankWith, scopeEndsWith } from '@jsonforms/core';

export const countryTableTester = (uiSchema: any, schema: any, path: any) => {
    return rankWith(3, scopeEndsWith('countries'))(uiSchema, schema, path);
};
