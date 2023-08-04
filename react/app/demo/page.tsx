'use client'

import React from 'react';
import DateSelector from '../components/DateSelector';
import {AppProvider} from '@shopify/polaris';
import en from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css'
 
function Demo() {
  return (
    <AppProvider i18n={en}>
        <DateSelector />
    </AppProvider>
  );
}

export default Demo;

