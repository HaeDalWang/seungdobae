# 호스팅 존: 신규 생성 또는 기존 존 조회 (변수로 분기).
resource "aws_route53_zone" "site" {
  count = var.create_route53_zone ? 1 : 0
  name  = var.domain_name
}

data "aws_route53_zone" "existing" {
  count        = var.create_route53_zone ? 0 : 1
  name         = var.domain_name
  private_zone = false
}

locals {
  zone_id = var.create_route53_zone ? aws_route53_zone.site[0].zone_id : data.aws_route53_zone.existing[0].zone_id
}

# apex 도메인 A/AAAA 별칭 → CloudFront.
resource "aws_route53_record" "a" {
  zone_id = local.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "aaaa" {
  zone_id = local.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}

# SAN(예: www) 각각에 대한 별칭 레코드.
resource "aws_route53_record" "san_a" {
  for_each = toset(var.subject_alternative_names)

  zone_id = local.zone_id
  name    = each.value
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
