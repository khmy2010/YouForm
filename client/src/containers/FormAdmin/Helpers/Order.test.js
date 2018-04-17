import React from 'react';

import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Order from './Order';
import Select from '../../../components/Select/Select';
import { EDIT_QUESTION } from '../../../actions/types';

configure({ adapter: new Adapter() }); //connect enzyme

const questions = [
    {
        options: [],
        _id: '5ad59baa6a4a940496e9730d',
        title: 'Bei Tai Nan',
        description: '',
        validation: '{"isRequired":false,"minCharCount":"","maxCharCount":""}',
        sequence: 1,
        type: 'SHORT_TEXT'
    },
    {
        options: [],
        _id: '5ad59ba66a4a940496e9730c',
        title: 'Nv Zhu Jiao',
        description: '',
        validation: '{"isRequired":false,"minCharCount":"","maxCharCount":""}',
        sequence: 2,
        type: 'SHORT_TEXT'
    },
    {
        options: [],
        _id: '5ad59ba26a4a940496e9730b',
        title: 'Nan Zhu Jiao',
        description: '',
        validation: '{"isRequired":false,"minCharCount":"","maxCharCount":""}',
        sequence: 3,
        type: 'SHORT_TEXT'
    }
];

let wrapper;
let changed;

beforeEach(() => {
    changed = jest.fn();
    wrapper = mount(<Order questions={questions} onChange={changed} ori={2} />);
});

it('should renders without crashing', () => {
    expect(wrapper.find('.EleField')).toHaveLength(1);
});

it('should renders the custom select', () => {
    expect(wrapper.find('.Y__Select')).toHaveLength(1);
});

it('should renders two + 1 items on the <li>', () => {
    //length = question.length - 1 + 1 (if it is NOT first element)
    expect(wrapper.find('li')).toHaveLength(questions.length);
});

it('should shows the menu when it is clicked', () => {
    const select = wrapper.find('.Select__Selected');
    expect(select).toHaveLength(1);
    select.simulate('click');
    const active = wrapper.find('.Select__Active');
});

it('should call changed with correct params when item is clicked', () => {
    const select = wrapper.find('.Select__Selected');
    select.simulate('click');
    const item = wrapper.find('li').at(1);
    const text = item.text();
    expect(text).toEqual(expect.stringContaining(questions[0].title));
    item.simulate('click');
    expect(changed.mock.calls.length).toBe(1);
    //because got <Place at First>
    expect(changed.mock.calls[0][0]).toBe(0);
});
