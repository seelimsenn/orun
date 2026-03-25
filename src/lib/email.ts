import { Resend } from 'resend'

// Bypasses the build-time error when the API key is not yet available in the environment
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'ORUN <onboarding@resend.dev>',
    to: email,
    subject: 'ORUN — Şifre Sıfırlama Talebi',
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 500px; margin: 0 auto; background: #0a0a0a; padding: 48px 32px; color: #e0e0e0;">
        <h1 style="text-align: center; font-size: 28px; letter-spacing: 6px; color: #c9a96e; margin-bottom: 8px;">ORUN</h1>
        <p style="text-align: center; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #888; margin-bottom: 40px;">Şifre Sıfırlama</p>
        
        <p style="font-size: 14px; line-height: 1.8; color: #bbb; margin-bottom: 24px;">
          Merhaba,<br><br>
          Hesabınız için bir şifre sıfırlama talebi aldık. Şifrenizi yenilemek için aşağıdaki bağlantıya tıklayın:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="display: inline-block; background: #c9a96e; color: #0a0a0a; padding: 16px 40px; text-decoration: none; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
            ŞİFREMİ YENİLE
          </a>
        </div>
        
        <p style="font-size: 11px; color: #666; text-align: center; margin-top: 40px; line-height: 1.6;">
          Bu bağlantı 1 saat geçerlidir.<br>
          Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
        </p>
        
        <hr style="border: none; border-top: 1px solid #222; margin: 32px 0;" />
        <p style="font-size: 10px; color: #555; text-align: center; letter-spacing: 2px;">© 2026 ORUN STUDIOS</p>
      </div>
    `
  })
}
