import { configure } from '@storybook/react';
import './test'
configure(require.context('../stories', true, /\.stories\.js$/), module);
