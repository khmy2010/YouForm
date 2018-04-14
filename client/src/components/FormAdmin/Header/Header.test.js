import React from 'react';

import { MemoryRouter } from 'react-router';

import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from './Header';

configure({ adapter: new Adapter() }); //connect enzyme

it('should renders without crashing', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.hasClass('FormAdmin__Header')).toBeTruthy();
});

it('should displays file name correctly', () => {
    const wrapper = shallow(<Header fileName="PUBG" />);
    expect(wrapper.find('.FormAdmin__Name')).toHaveLength(1);
});

it('should call onChange event once when changing file name', () => {
    const mockOnClick = jest.fn();
    const wrapper = shallow(<Header fileName="PUBG" onChange={mockOnClick} />);
    wrapper.find('.FormAdmin__Name').simulate('change', { value: 'Alo' });
    expect(mockOnClick.mock.calls.length).toBe(1);
});

it('should call onSave event with correct parameters when press enter', () => {
    const mockOnSaveFileName = jest.fn();
    const fileName = 'TIK-TOK';

    const wrapper = mount(
        <MemoryRouter>
            <Header fileName="PUBG" onSaveFileName={mockOnSaveFileName} />
        </MemoryRouter>
    );
    wrapper
        .find('.FormAdmin__Name')
        .simulate('keyPress', { charCode: 13, target: { value: fileName } });

    expect(mockOnSaveFileName.mock.calls.length).toBe(1);
    expect(mockOnSaveFileName.mock.calls[0][0]).toBe(fileName);
});
