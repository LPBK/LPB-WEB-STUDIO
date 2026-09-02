import { sql, isNeonConfigured } from '../db/neonClient';

// Master PIN and Lockout Configuration
const PIN_STORAGE_KEY = 'lpb_admin_pin_v1';
const ATTEMPTS_STORAGE_KEY = 'lpb_admin_pin_attempts_v1';
const LOCKOUT_UNTIL_KEY = 'lpb_admin_lockout_until_v1';

const DEFAULT_FALLBACK_PIN = '202688';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds modern standard lockout

export interface AuthState {
  isLocked: boolean;
  remainingLockoutSeconds: number;
  remainingAttempts: number;
}

export const adminAuthService = {
  // Sync PIN from Neon DB table admin_config
  async syncPinFromDB(): Promise<string> {
    if (isNeonConfigured && sql) {
      try {
        const rows = await sql`SELECT value FROM admin_config WHERE key = 'admin_pin' LIMIT 1`;
        if (rows && rows.length > 0 && rows[0].value) {
          const dbPin = String(rows[0].value).trim();
          localStorage.setItem(PIN_STORAGE_KEY, dbPin);
          return dbPin;
        }
      } catch (err) {
        console.warn('Neon DB PIN fetch fallback to local cache:', err);
      }
    }
    return this.getStoredPin();
  },

  getStoredPin(): string {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_FALLBACK_PIN;
  },

  async setNewPin(newPin: string): Promise<boolean> {
    if (!newPin || newPin.length !== 6) return false;
    localStorage.setItem(PIN_STORAGE_KEY, newPin);

    if (isNeonConfigured && sql) {
      try {
        await sql`
          INSERT INTO admin_config (key, value, updated_at)
          VALUES ('admin_pin', ${newPin}, CURRENT_TIMESTAMP)
          ON CONFLICT (key) DO UPDATE 
          SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
        `;
      } catch (err) {
        console.error('Error saving PIN to Neon DB:', err);
      }
    }
    return true;
  },

  getAuthState(): AuthState {
    const lockoutUntilRaw = localStorage.getItem(LOCKOUT_UNTIL_KEY);
    const now = Date.now();

    if (lockoutUntilRaw) {
      const lockoutUntil = parseInt(lockoutUntilRaw, 10);
      if (now < lockoutUntil) {
        const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
        return {
          isLocked: true,
          remainingLockoutSeconds: remainingSeconds,
          remainingAttempts: 0
        };
      } else {
        // Lockout expired, reset attempts
        localStorage.removeItem(LOCKOUT_UNTIL_KEY);
        localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      }
    }

    const failedAttempts = parseInt(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || '0', 10);
    return {
      isLocked: false,
      remainingLockoutSeconds: 0,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - failedAttempts)
    };
  },

  async verifyPin(enteredPin: string): Promise<{ success: boolean; state: AuthState; message?: string }> {
    const currentState = this.getAuthState();
    if (currentState.isLocked) {
      return {
        success: false,
        state: currentState,
        message: `Acceso bloqueado temporalmente. Espera ${currentState.remainingLockoutSeconds}s.`
      };
    }

    // Check against synced DB PIN
    const currentPin = await this.syncPinFromDB();
    if (enteredPin === currentPin) {
      // Success: reset attempts
      localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      localStorage.removeItem(LOCKOUT_UNTIL_KEY);
      return {
        success: true,
        state: {
          isLocked: false,
          remainingLockoutSeconds: 0,
          remainingAttempts: MAX_ATTEMPTS
        }
      };
    } else {
      // Failed attempt
      const failedAttempts = parseInt(localStorage.getItem(ATTEMPTS_STORAGE_KEY) || '0', 10) + 1;
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, failedAttempts.toString());

      if (failedAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        localStorage.setItem(LOCKOUT_UNTIL_KEY, lockoutUntil.toString());
        return {
          success: false,
          state: {
            isLocked: true,
            remainingLockoutSeconds: 60,
            remainingAttempts: 0
          },
          message: 'Demasiados intentos fallidos. Panel bloqueado por 60 segundos por seguridad.'
        };
      }

      const remaining = MAX_ATTEMPTS - failedAttempts;
      return {
        success: false,
        state: {
          isLocked: false,
          remainingLockoutSeconds: 0,
          remainingAttempts: remaining
        },
        message: `PIN incorrecto. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`
      };
    }
  }
};
