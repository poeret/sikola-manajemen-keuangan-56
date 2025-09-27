# Security Configuration

## Security Headers

Aplikasi ini menggunakan security headers yang komprehensif untuk melindungi dari berbagai serangan web.

### Development (Vite Dev Server)
Headers yang bisa diset di development server:
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Production Deployment

#### Netlify
Gunakan file `public/_headers` untuk mengatur security headers di Netlify.

#### Vercel
Gunakan file `vercel.json` untuk mengatur security headers di Vercel.

#### Manual Server Setup
Jika menggunakan server sendiri, pastikan untuk menambahkan headers berikut:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://cmsvmhcxmsznhpbsvopw.supabase.co; frame-ancestors 'none';
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

## Environment Variables

Pastikan untuk mengatur environment variables berikut:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_NAME=Sistem Keuangan Sekolah
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
VITE_SESSION_TIMEOUT=3600000
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_RATE_LIMIT_WINDOW=60000
```

## Security Features

### 1. Rate Limiting
- Maksimal 5 login attempts per 60 detik
- Automatic rate limit clearing pada login sukses
- Tracking remaining attempts

### 2. Session Management
- Automatic session timeout (1 jam default)
- Session timeout clearing pada logout
- Activity-based session renewal

### 3. Input Validation
- Zod schema validation untuk semua input
- Input sanitization untuk mencegah XSS
- Email, phone, dan amount validation

### 4. Audit Logging
- Login attempts logging
- Rate limit violations
- Session timeouts
- Security events tracking

## Security Monitoring

### Development Mode
Security Monitor component akan menampilkan:
- Header validation status
- Rate limit status
- Session status
- Security events

### Production Monitoring
Untuk production, implementasikan:
- Security event logging ke external service
- Rate limit monitoring
- Session analytics
- Anomaly detection

## Best Practices

1. **Environment Variables**: Jangan hardcode secrets di source code
2. **HTTPS Only**: Selalu gunakan HTTPS di production
3. **Regular Updates**: Update dependencies secara berkala
4. **Security Headers**: Pastikan semua security headers ter-set dengan benar
5. **Input Validation**: Validasi semua input dari user
6. **Rate Limiting**: Implementasi rate limiting untuk API calls
7. **Session Management**: Gunakan secure session management
8. **Audit Logging**: Log semua aktivitas keamanan

## Security Checklist

- [ ] Environment variables ter-set dengan benar
- [ ] Security headers ter-konfigurasi
- [ ] HTTPS enabled di production
- [ ] Rate limiting aktif
- [ ] Session timeout ter-konfigurasi
- [ ] Input validation aktif
- [ ] Audit logging aktif
- [ ] Security monitoring aktif
- [ ] Dependencies ter-update
- [ ] Security testing dilakukan
