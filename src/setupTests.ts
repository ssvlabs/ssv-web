// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import crypto from 'crypto';
import Enzyme from 'enzyme';
import 'jsdom-global/register';
import '@testing-library/jest-dom/extend-expect';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// @ts-ignore
window.crypto = {
    getRandomValues(buffer: Buffer) { return crypto.randomFillSync(buffer); },
};

Enzyme.configure({ adapter: new Adapter() });
