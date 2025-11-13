/*
 * @Author: Anixuil
 * @Date: 2025-01-27
 * @Description: 邮件模板常量
 */

// 邮件模板配置
export const EMAIL_TEMPLATES = {
    // 验证码邮件模板
    VERIFICATION_CODE: {
        subject: '邮箱验证码 - 安全验证服务',
        generateHtml: (code: string, expireMinutes: number = 5) => `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>邮箱验证码</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Microsoft YaHei', Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                <!-- 头部 -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 1px;">
                        邮箱验证码
                    </h1>
                    <p style="color: #e8e8e8; margin: 10px 0 0 0; font-size: 16px;">
                        安全验证服务
                    </p>
                </div>
                
                <!-- 主体内容 -->
                <div style="padding: 40px 30px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="display: inline-block; background-color: #f8f9fa; border: 2px dashed #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
                            <p style="color: #6c757d; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">
                                您的验证码是
                            </p>
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 25px; border-radius: 6px; display: inline-block; box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);">
                                ${code}
                            </div>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
                        <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                            ⏰ 重要提醒
                        </h3>
                        <ul style="color: #6c757d; margin: 0; padding-left: 20px; line-height: 1.6;">
                            <li>验证码有效期为 <strong style="color: #dc3545;">${expireMinutes}分钟</strong>，请及时使用</li>
                            <li>请勿将验证码泄露给他人，保护您的账户安全</li>
                            <li>如非本人操作，请忽略此邮件</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #6c757d; font-size: 14px; margin: 0; line-height: 1.5;">
                            此邮件由系统自动发送，请勿回复。<br>
                            如有疑问，请联系客服。
                        </p>
                    </div>
                </div>
                
                <!-- 底部 -->
                <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 12px; margin: 0;">
                        © ${new Date().getFullYear()} ANI_SERVER 系统安全验证服务
                    </p>
                </div>
            </div>
        </body>
        </html>
        `,
        generateText: (code: string, expireMinutes: number = 5) => 
            `您的验证码是：${code}\n验证码有效期为${expireMinutes}分钟，请及时使用。\n请勿将验证码泄露给他人，保护您的账户安全。\n如非本人操作，请忽略此邮件。`
    },

    // 欢迎邮件模板
    WELCOME: {
        subject: '欢迎注册 - ANI_FAMILY',
        generateHtml: (userName: string) => `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>欢迎注册</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Microsoft YaHei', Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">
                        欢迎注册
                    </h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #495057; margin: 0 0 20px 0;">亲爱的 ${userName}，</h2>
                    <p style="color: #6c757d; line-height: 1.6; margin: 0 0 20px 0;">
                        欢迎加入 ANI_FAMILY！您的账户已成功创建，现在可以开始使用我们的服务了。
                    </p>
                    <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <p style="color: #155724; margin: 0; font-weight: 500;">
                            ✅ 账户创建成功
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
        generateText: (userName: string) => 
            `亲爱的 ${userName}，\n欢迎加入 ANI_FAMILY！您的账户已成功创建，现在可以开始使用我们的服务了。`
    }
};

// 邮件发送配置
export const EMAIL_CONFIG = {
    // 验证码过期时间（分钟）
    VERIFICATION_CODE_EXPIRE_MINUTES: 5,
    
    // 邮件发送间隔（秒）
    EMAIL_SEND_INTERVAL: 60,
    
    // 每日邮件发送限制
    DAILY_EMAIL_LIMIT: 10,
    
    // 邮件主题前缀
    SUBJECT_PREFIX: '[系统通知]'
};

// 邮件模板工具函数
export class EmailTemplateUtils {
    /**
     * 生成验证码邮件
     * @param code 验证码
     * @param expireMinutes 过期时间（分钟）
     * @returns 邮件内容
     */
    static generateVerificationCodeEmail(code: string, expireMinutes: number = 5) {
        return {
            subject: EMAIL_TEMPLATES.VERIFICATION_CODE.subject,
            html: EMAIL_TEMPLATES.VERIFICATION_CODE.generateHtml(code, expireMinutes),
            text: EMAIL_TEMPLATES.VERIFICATION_CODE.generateText(code, expireMinutes)
        };
    }

    /**
     * 生成欢迎邮件
     * @param userName 用户名
     * @returns 邮件内容
     */
    static generateWelcomeEmail(userName: string) {
        return {
            subject: EMAIL_TEMPLATES.WELCOME.subject,
            html: EMAIL_TEMPLATES.WELCOME.generateHtml(userName),
            text: EMAIL_TEMPLATES.WELCOME.generateText(userName)
        };
    }
}
