import { portSchema } from '../src';

describe('portSchema', () => {
  it.each([1, 3002, 65535, '3002'])('aceita a porta %s', (input) => {
    expect(portSchema.parse(input)).toBe(Number(input));
  });
  it.each([0, 65536, -1, 1.5, '', ' ', 'abc', '3002x', true, null, undefined])(
    'rejeita a entrada %s',
    (input) => {
      expect(portSchema.safeParse(input).success).toBe(false);
    },
  );
});
