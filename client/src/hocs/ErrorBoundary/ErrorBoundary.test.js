import React from 'react';

import { MemoryRouter } from 'react-router';

import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ErrorBoundary from './ErrorBoundary';

configure({ adapter: new Adapter() }); //connect enzyme

it('should renders without crashing', () => {
    const wrapper = shallow(<ErrorBoundary />);
    wrapper.setState({ hasError: true });

    expect(wrapper.hasClass('HuaiDiao')).toBeTruthy();
});

it('should renders the children when there is no error', () => {
    const wrapper = shallow(<ErrorBoundary>Children</ErrorBoundary>);

    expect(wrapper.text()).toBe('Children');
});
