/*
 * @Author: Anixuil
 * @Date: 2025-10-19 14:46:23
 * @LastEditors: Anixuil
 * @LastEditTime: 2025-10-19 15:22:39
 * @Description: 邮箱服务
 */
import * as nodemailer from 'nodemailer'

// 邮件配置接口
interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

// 邮件发送选项接口
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text: string;
    from?: string;
}

// 邮件模板类型
export enum EmailTemplateType {
    VERIFICATION_CODE = 'verification_code',
    WELCOME = 'welcome',
    NOTIFICATION = 'notification'
}

export class EmailService {
    private transporter: nodemailer.Transporter;
    private defaultFrom: string;
    
    constructor(config?: Partial<EmailConfig>) {
        // 默认配置
        const defaultConfig: EmailConfig = {
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: 'anixuil@foxmail.com',
                pass: 'emdkulimhvvxbadc'
            }
        };
        
        const finalConfig = { ...defaultConfig, ...config };
        this.defaultFrom = finalConfig.auth.user;
        
        this.transporter = nodemailer.createTransport(finalConfig);
    }

    /**
     * 发送邮件
     * @param options 邮件选项
     * @returns Promise<any>
     */
    async sendEmail(options: EmailOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: options.from || this.defaultFrom,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text
            };
            
            this.transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error('邮件发送失败:', err);
                    reject(err);
                    return;
                }
                console.log('邮件发送成功:', info.messageId);
                resolve(info);
            });
        });
    }

    /**
     * 验证邮件配置
     * @returns Promise<boolean>
     */
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('邮件服务连接验证成功');
            return true;
        } catch (error) {
            console.error('邮件服务连接验证失败:', error);
            return false;
        }
    }

    /**
     * 关闭邮件服务连接
     */
    close(): void {
        this.transporter.close();
    }
}