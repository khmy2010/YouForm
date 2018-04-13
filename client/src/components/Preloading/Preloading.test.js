import React from 'react';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Preloading from './Preloading';

configure({ adapter: new Adapter() }); //connect enzyme

let wrapper;

beforeEach(() => {
    wrapper = shallow(<Preloading />);
});

describe('<Preloading />', () => {
    it('should render Preloading correctly when it is shown', () => {
        wrapper.setProps({ show: true });
        expect(wrapper.find('.App-Preloading')).toHaveLength(1);
    });

    it('should hide Preloading correctly when it is not needed', () => {
        wrapper.setProps({ show: false });
        expect(wrapper.find('.App-Preloading')).toHaveLength(0);
    });
});
