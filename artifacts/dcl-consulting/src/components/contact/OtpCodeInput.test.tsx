import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { OtpCodeInput } from './OtpCodeInput';

function Controlled() {
  const [value, setValue] = useState('');
  return <OtpCodeInput value={value} onChange={setValue} />;
}

describe('OtpCodeInput', () => {
  it('renders six digit cells', () => {
    render(<Controlled />);
    for (let i = 0; i < 6; i++) {
      expect(screen.getByTestId(`otp-digit-${i}`)).toBeInTheDocument();
    }
  });

  it('auto-advances focus after typing a digit', () => {
    render(<Controlled />);
    fireEvent.change(screen.getByTestId('otp-digit-0'), { target: { value: '3' } });
    expect(screen.getByTestId('otp-digit-1')).toHaveFocus();
  });

  it('moves focus back on backspace from an empty cell', () => {
    render(<Controlled />);
    const first = screen.getByTestId('otp-digit-0');
    const second = screen.getByTestId('otp-digit-1');
    fireEvent.change(first, { target: { value: '3' } });
    (second as HTMLInputElement).focus();
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(first).toHaveFocus();
  });

  it('fills every cell when the full code is pasted', () => {
    render(<Controlled />);
    fireEvent.paste(screen.getByTestId('otp-digit-0'), { clipboardData: { getData: () => '384271' } });
    for (const [index, digit] of ['3', '8', '4', '2', '7', '1'].entries()) {
      expect(screen.getByTestId(`otp-digit-${index}`)).toHaveValue(digit);
    }
  });

  it('only accepts numeric input', () => {
    render(<Controlled />);
    const first = screen.getByTestId('otp-digit-0');
    fireEvent.change(first, { target: { value: 'a' } });
    expect(first).toHaveValue('');
  });
});
