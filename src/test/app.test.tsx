import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('SkillBridge RPL App UI Navigation & Workflows', () => {
  it('renders platform header and default worker self-declaration', () => {
    render(<App />);
    expect(screen.getAllByText(/SkillBridge RPL/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Candidate Self-Declaration of Prior Learning/i)).toBeInTheDocument();
  });

  it('switches between Worker Portal, Assessor Desk, and Quality Audit views', () => {
    render(<App />);

    // Switch to Assessor Desk
    const assessorBtn = screen.getByRole('button', { name: /Assessor Desk/i });
    fireEvent.click(assessorBtn);
    expect(screen.getByText(/Assessor Decision & Verification Desk/i)).toBeInTheDocument();

    // Switch to Quality Audit
    const auditBtn = screen.getByRole('button', { name: /Quality Audit/i });
    fireEvent.click(auditBtn);
    expect(screen.getByText(/System Compliance & Verification Audit/i)).toBeInTheDocument();

    // Switch back to Worker Portal
    const workerBtn = screen.getByRole('button', { name: /Worker Portal/i });
    fireEvent.click(workerBtn);
    expect(screen.getByText(/Candidate Self-Declaration of Prior Learning/i)).toBeInTheDocument();
  });

  it('populates demo candidate profile on quick-fill button click', () => {
    render(<App />);

    const solarDemoBtn = screen.getByRole('button', { name: /Solar PV/i });
    fireEvent.click(solarDemoBtn);

    const nameInput = screen.getByLabelText(/Full Name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Anita Sharma');
  });
});
