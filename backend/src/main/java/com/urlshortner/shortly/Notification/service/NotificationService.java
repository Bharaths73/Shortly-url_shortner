package com.urlshortner.shortly.Notification.service;

import com.urlshortner.shortly.Url.events.ShortCodeCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.HtmlUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final EmailService emailService;

    @Value("${short.url.base}")
    private String SHORT_URL_BASE;

    public void sendUrlCreatedNotification(ShortCodeCreatedEvent event) {
        String subject = "Your Short URL Has Been Created";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>Hello %s!</h2>

                    <p>Your short URL has been successfully created.</p>

                    <div style="padding: 15px; background: #f4f4f4;">
                        <p><strong>Short URL:</strong></p>
                        <a href="%s">%s</a>
                        <p><strong>Original URL:</strong></p>
                        <a href="%s">%s</a>
                    </div>

                    <p>Thank you for using Shortly!</p>

                    <p>Regards,<br>Shortly Team</p>
                </body>
                </html>
                """.formatted(
                escapeHtml(event.getUserName()!=null ? event.getUserName() : "User"),
                escapeHtml(SHORT_URL_BASE + event.getShortCode()),
                escapeHtml(SHORT_URL_BASE + event.getShortCode()),
                escapeHtml(event.getOriginalUrl()),
                escapeHtml(event.getOriginalUrl())
        );

        emailService.sendHtmlEmail(event.getEmail(), subject, htmlContent);
    }

    private String escapeHtml(String value) {
        return HtmlUtils.htmlEscape(value);
    }
}
