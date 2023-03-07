import '!style-loader!css-loader!sass-loader!../src/assets/styles/global.scss';
import * as nextImage from 'next/image';
import {
	INITIAL_VIEWPORTS
} from '@storybook/addon-viewport';

Object.defineProperty(nextImage, 'default', {
  configurable: true,
  value: props => <img {...props} />
});

export const parameters = {
  viewMode: 'docs',
  layout: 'fullscreen',
  actions: {
    argTypesRegex: "^on[A-Z].*"
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}