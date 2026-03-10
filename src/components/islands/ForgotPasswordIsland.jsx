/**
 * Forgot Password island – self-contained 3-step flow:
 *   Step 1: Request reset code (email input)
 *   Step 2: Enter code + new password
 *   Step 3: Success confirmation
 *
 * This replaces the 3-page React-Router flow (RequestReset + ResetPassword + ResetSuccess)
 * with a single-page multi-step wizard since Astro page transitions would lose React state.
 */
import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const API_URL = 'https://api.sightseeingroma.com';

const gradientStyle = {
  background: 'linear-gradient(135deg, #7F001D, #FFD600, #7F001D, #FFD600)',
  backgroundSize: '400% 400%',
  animation: 'gradientBG 25s ease-in-out infinite',
};

const animationCSS = `
  @keyframes gradientBG {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export default function ForgotPasswordIsland() {
  const [step, setStep] = useState(1); // 1=request, 2=reset, 3=success
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 2 state
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ── Step 1: Request reset code ── */
  const handleRequestReset = async (e) => {
    e.preventDefault();
    const emailValue = e.target.email.value;

    if (!/^\S+@\S+\.\S+$/.test(emailValue)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/request-password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });
      const data = await res.json();

      if (res.ok) {
        setEmail(emailValue);
        setStep(2);
      } else {
        setError(data.error || 'Failed to send reset code. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2: Verify code + reset password ── */
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      const next = document.querySelector(`input[name="code-${index + 1}"]`);
      if (next) next.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.querySelector(`input[name="code-${index - 1}"]`);
      if (prev) {
        prev.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    const newPassword = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (verificationCode.length !== 6) {
      setError('Please enter the complete verification code');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/verify-reset-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode, new_password: newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep(3);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared wrapper ── */
  const Wrapper = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={gradientStyle}>
      <style>{animationCSS}</style>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <div className="flex justify-center mb-8">
          <img src="/Logo.webp" alt="Logo" className="h-16" />
        </div>
        {children}
        <button
          onClick={() => (window.location.href = '/')}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors"
        >
          <RxCross2 size={20} />
        </button>
      </div>
    </div>
  );

  /* ── Step 1 UI ── */
  if (step === 1) {
    return (
      <Wrapper>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">Enter your email to receive a password reset code</p>
        </div>

        <form onSubmit={handleRequestReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email" name="email"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Enter your email" required
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <button type="submit" disabled={loading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7F001D] hover:bg-red-900'
            }`}>
            {loading ? <span className="flex items-center"><Spinner />Sending...</span> : 'Send Reset Code'}
          </button>

          <div className="text-center">
            <a href="/login" className="font-medium text-[#7F001D] hover:text-red-900">Back to Login</a>
          </div>
        </form>
      </Wrapper>
    );
  }

  /* ── Step 2 UI ── */
  if (step === 2) {
    return (
      <Wrapper>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter the verification code sent to your email</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Verification Code */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
            <div className="flex gap-2 justify-between">
              {code.map((digit, i) => (
                <input key={i} type="text" name={`code-${i}`} value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  maxLength={1} pattern="[0-9]" inputMode="numeric" required
                />
              ))}
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input type={showPassword ? 'text' : 'password'} name="password"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Enter new password" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                placeholder="Confirm new password" required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

          <button type="submit" disabled={loading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7F001D] hover:bg-red-900'
            }`}>
            {loading ? <span className="flex items-center"><Spinner />Resetting...</span> : 'Reset Password'}
          </button>

          <div className="text-center">
            <a href="/login" className="font-medium text-[#7F001D] hover:text-red-900">Back to Login</a>
          </div>
        </form>
      </Wrapper>
    );
  }

  /* ── Step 3 UI ── */
  return (
    <Wrapper>
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
        <p className="text-gray-600 mb-8">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <a href="/login"
          className="inline-block w-full bg-[#7F001D] text-white py-3 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors text-center">
          Back to Login
        </a>
      </div>
    </Wrapper>
  );
}
