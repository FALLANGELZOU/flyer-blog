import { combineReducers } from 'redux';

import artSum from './artSum';
import avatar from './avatar';
import email from './email';
import link from './link';
import mode from './mode';
import name from './name';
import navShow from './navShow';
import nav from './nav';
import { hiddenNav } from './common';
export default combineReducers({
  navShow,
  artSum,
  avatar,
  email,
  link,
  name,
  mode,
  nav,
  hiddenNav
});
