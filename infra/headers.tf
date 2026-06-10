# 보안 응답 헤더 정책. HSTS, nosniff, frame 차단, Referrer, 기본 CSP.
resource "aws_cloudfront_response_headers_policy" "security" {
  name = "seungdobae-security-headers"

  security_headers_config {
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    # CSP는 CloudFront 관리형 보안 헤더라 custom_headers가 아닌 전용 블록에 둬야 한다.
    # 정적 SPA용. Credly 배지 이미지·GitHub 아바타 등 외부 이미지를 허용한다.
    content_security_policy {
      override = true
      content_security_policy = join("; ", [
        "default-src 'self'",
        "script-src 'self'",
        # Cloudscape는 런타임에 인라인 스타일을 주입하므로 style-src에 unsafe-inline 필요.
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://images.credly.com https://avatars.githubusercontent.com",
        "font-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
      ])
    }
  }

  # Permissions-Policy는 관리형 보안 헤더가 아니므로 커스텀 헤더로 둔다.
  custom_headers_config {
    items {
      header   = "Permissions-Policy"
      value    = "camera=(), microphone=(), geolocation=()"
      override = true
    }
  }
}
