import { describe, it, beforeEach } from 'storybook-addon-specifications';
import expect from 'expect';
import jest from 'jest-mock';
import { shallow, mount } from 'enzyme';
import { configure as enzymeConfigure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
enzymeConfigure({ adapter: new Adapter() });

window.describe = describe;
window.beforeEach = beforeEach;
window.it = it;
window.expect = expect;
window.jest = jest;
window.shallow = shallow;
window.mount = mount;
