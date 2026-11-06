import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

// Mock the auth store
vi.mock('../../stores/authStore', () => ({
  default: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  let mockAuthStore;

  beforeEach(() => {
    mockAuthStore = {
      login: vi.fn(),
      loading: false,
      isAuthenticated: false,
    };
    useAuthStore.mockReturnValue(mockAuthStore);
    vi.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  it('renders login form correctly', () => {
    renderLogin();

    expect(screen.getByText(/Welcome to/)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    renderLogin();

    const form = document.querySelector('form');
    fireEvent.submit(form);

    expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('calls login function with correct credentials', async () => {
    const user = userEvent.setup();
    mockAuthStore.login.mockResolvedValue({ success: true });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('navigates to home on successful login', async () => {
    const user = userEvent.setup();
    mockAuthStore.login.mockResolvedValue({ success: true });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
      expect(toast.success).toHaveBeenCalledWith('Welcome back, Scholar!');
    });
  });

  it('shows error message on login failure', async () => {
    const user = userEvent.setup();
    mockAuthStore.login.mockResolvedValue({ success: false, message: 'Invalid credentials' });

    renderLogin();

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByPlaceholderText('••••••••');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('redirects if already authenticated', () => {
    mockAuthStore.isAuthenticated = true;

    renderLogin();

    expect(screen.queryByText('Welcome to EduAI')).not.toBeInTheDocument();
  });
});