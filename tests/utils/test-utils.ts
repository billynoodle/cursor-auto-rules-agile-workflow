import { render as rtlRender } from '@testing-library/react';
import { ReactElement } from 'react';

const render = (ui: ReactElement) => {
  return rtlRender(ui);
};

export * from '@testing-library/react';
export { render }; 