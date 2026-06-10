output "bucket_name" {
  description = "S3 콘텐츠 버킷 이름 (CI의 aws s3 sync 대상)"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront 배포 ID (CI의 invalidation 대상)"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront 기본 도메인 (dxxxx.cloudfront.net)"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "사이트 최종 URL"
  value       = "https://${var.domain_name}"
}

output "deploy_role_arn" {
  description = "GitHub Actions가 가정할 배포 role ARN (CI secrets에 설정)"
  value       = aws_iam_role.deploy.arn
}

output "name_servers" {
  description = "외부 등록 도메인에 위임할 네임서버 (존을 새로 생성한 경우)"
  value       = var.create_route53_zone ? aws_route53_zone.site[0].name_servers : []
}
