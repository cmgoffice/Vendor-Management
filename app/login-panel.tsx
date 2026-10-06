'use client';

import {useState} from 'react';
import {ArrowRight, Eye, EyeOff, Globe2, LockKeyhole, UserRound} from 'lucide-react';

type LoginPanelProps = {
  thai: boolean;
  onLanguageChange: () => void;
  onRegisterClick?: () => void;
};

export default function LoginPanel({thai, onLanguageChange, onRegisterClick}: LoginPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-panel" lang={thai ? 'th' : 'en'}>
      <div className="login-topbar">
        <div className="login-brand" aria-label="CMG Vendor Management">
          <span className="login-monogram" aria-hidden="true">CMG</span>
          <span className="login-wordmark">CMG Vendor Management<small>{thai ? 'พอร์ทัลสำหรับคู่ค้า' : 'PARTNER PORTAL'}</small></span>
        </div>
        <button type="button" className="login-language" onClick={onLanguageChange} aria-label={thai ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}>
          <Globe2 size={15} aria-hidden="true"/>{thai ? 'EN' : 'ไทย'}
        </button>
      </div>

      <div className="login-heading">
        <span className="login-eyebrow"><span aria-hidden="true"/>{thai ? 'ยินดีต้อนรับกลับ' : 'WELCOME BACK'}</span>
        <h1>{thai ? 'เข้าสู่ระบบ' : 'Sign in to your workspace'}</h1>
        <p>{thai ? 'กรอกข้อมูลบัญชีเพื่อเข้าสู่พื้นที่ของคุณ' : 'Your workspace for better partnerships.'}</p>
      </div>

      <form className="login-form" onSubmit={event => event.preventDefault()}>
        <div className="login-field">
          <label htmlFor="login-username">{thai ? 'ชื่อผู้ใช้' : 'Username'}</label>
          <div className="login-input-wrap">
            <UserRound size={18} className="login-input-icon" aria-hidden="true"/>
            <input id="login-username" name="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder={thai ? 'กรอกชื่อผู้ใช้' : 'Enter your username'}/>
          </div>
        </div>
        <div className="login-field">
          <label htmlFor="login-password">{thai ? 'รหัสผ่าน' : 'Password'}</label>
          <div className="login-input-wrap">
            <LockKeyhole size={18} className="login-input-icon" aria-hidden="true"/>
            <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder={thai ? 'กรอกรหัสผ่าน' : 'Enter your password'}/>
            <button type="button" className="login-password-toggle" aria-label={thai ? (showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน') : (showPassword ? 'Hide password' : 'Show password')} aria-pressed={showPassword} aria-controls="login-password" onClick={() => setShowPassword(value => !value)}>
              {showPassword ? <EyeOff size={18} aria-hidden="true"/> : <Eye size={18} aria-hidden="true"/>}
            </button>
          </div>
        </div>
        <button type="submit" className="login-submit">{thai ? 'เข้าสู่ระบบ' : 'Log in'}<ArrowRight size={18} aria-hidden="true"/></button>
      </form>

      <div className="login-divider"><span/>{thai ? 'หรือเข้าสู่ระบบด้วย' : 'OR CONTINUE WITH'}<span/></div>
      <button type="button" className="login-google">
        <svg aria-hidden="true" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6c4.51-4.16 7.11-10.29 7.11-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59A14.37 14.37 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.86 23.86 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"/>
        </svg>
        {thai ? 'เข้าสู่ระบบด้วย Google' : 'Continue with Google'}
      </button>
      <p className="login-preview-note">{thai ? 'ตัวอย่างหน้าจอ · ยังไม่ได้เชื่อมต่อระบบเข้าสู่ระบบ' : 'UI preview · sign-in is not connected yet'}</p>

      <div className="registration-card-footer registration-switch login-register-footer">
        <span>{thai ? 'ยังไม่มีบัญชี?' : "Don't have an account?"}</span>
        <button type="button" className="login-register-btn" onClick={onRegisterClick}>
          {thai ? 'ลงทะเบียน' : 'Register'}
        </button>
      </div>
    </div>
  );
}
