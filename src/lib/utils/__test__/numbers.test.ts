import { formatFloatToMaxPrecision } from '~lib/utils/numbers';

describe('Test floating numbers', () => {
  it('Check 450.9999999999999718 as 451', () => {
    expect(formatFloatToMaxPrecision(450.9999999999999718)).toEqual('451');
  });
  it('Check 0.0000000000000001', () => {
    expect(formatFloatToMaxPrecision(0.0000000000000001)).toEqual('0.0000000000000001');
  });
  it('Check 1.0000000000000001', () => {
    expect(formatFloatToMaxPrecision(1.0000000000000001)).toEqual('1');
  });
  it('Check 1.0000000400000001', () => {
    expect(formatFloatToMaxPrecision(1.0000000400000001)).toEqual('1.0000000400000002');
  });
  it('Check 1234567890', () => {
    expect(formatFloatToMaxPrecision(1234567890)).toEqual('1234567890');
  });
  it('Check 123456789.987654321', () => {
    expect(formatFloatToMaxPrecision(123456789.987654321)).toEqual('123456789.987654328');
  });
  it('Check 0', () => {
    expect(formatFloatToMaxPrecision(0)).toEqual('0');
  });
  it('Check 0.0', () => {
    expect(formatFloatToMaxPrecision(0.0)).toEqual('0');
  });
  it('Check 123', () => {
    expect(formatFloatToMaxPrecision(123)).toEqual('123');
  });
  it('Check "0000"', () => {
    expect(formatFloatToMaxPrecision('0000')).toEqual('0');
  });
  it('Check "1.00"', () => {
    expect(formatFloatToMaxPrecision('1.00')).toEqual('1');
  });
  it('Check "abc"', () => {
    expect(formatFloatToMaxPrecision('abc')).toEqual('0.0');
  });
});
