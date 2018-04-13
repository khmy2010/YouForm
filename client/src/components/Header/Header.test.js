import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Header from './Header';
import NavItem from './NavItem';

configure({ adapter: new Adapter() }); //connect enzyme

let wrapper;

beforeEach(() => {
    wrapper = shallow(<Header />);
});

describe('<Header />', () => {
    it('should renders properly', () => {
        expect(wrapper.find('.Header__Wrapper')).toHaveLength(1);
    });

    it('should render three NavItem elements if unauthenticated', () => {
        wrapper.setProps({ auth: false });
        expect(wrapper.find(NavItem)).toHaveLength(3);
    });

    it('should render three NavItem elements if authentifcated', () => {
        wrapper.setProps({ auth: 'alo' });
        expect(wrapper.find(NavItem)).toHaveLength(3);
    });

    it('should render logout button if authenticated', () => {
        wrapper.setProps({ auth: 'alo' });
        expect(wrapper.find('a[href="/api/logout"]')).toHaveLength(1);
    });
});
