import React from 'react';

import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Context } from './Context';

configure({ adapter: new Adapter() }); //connect enzyme

let wrapper;
const fileName = 'Running Man';
const welcome = { buttonText: 'Woon', description: 'Alo Is Me' };

beforeEach(() => {
    wrapper = mount(
        <Context
            fileName={fileName}
            fid="1234567890"
            welcome={welcome}
            thanks={{ buttonText: 'Foong', description: 'Alo Is Me' }}
        />
    );
});

it('should renders correctly', () => {
    expect(wrapper.find('.Context')).toHaveLength(1);
});

it('should have correct initial active state', () => {
    const state = wrapper.state('activeTab');
    expect(state).toBe('Welcome Screen');
});

it('should have correct file name', () => {
    const input = wrapper.find('input[type="text"][name="welcomeTitle"]');
    expect(input.get(0).props.value).toBe(fileName);
});

it('should have correct description', () => {
    const input = wrapper.find('input[type="text"][name="welcomeDescription"]');
    expect(input.get(0).props.value).toBe(welcome.description);
});

it('should have correct button text', () => {
    const input = wrapper.find('input[type="text"][name="welcomeButtonText"]');
    expect(input.get(0).props.value).toBe(welcome.buttonText);
});
