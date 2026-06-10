variable "aws_region" {
  description = "기본 AWS 리전 (S3, OIDC 등)"
  type        = string
  default     = "ap-northeast-2"
}

variable "domain_name" {
  description = "사이트 커스텀 도메인 (예: seungdobae.com)"
  type        = string
}

variable "subject_alternative_names" {
  description = "추가 도메인 (예: www.seungdobae.com). 비우면 apex만 사용."
  type        = list(string)
  default     = []
}

variable "create_route53_zone" {
  description = "Route53 호스팅 존을 새로 생성할지 여부. false면 기존 존을 이름으로 조회."
  type        = bool
  default     = true
}

variable "github_repo" {
  description = "OIDC 배포 권한을 부여할 GitHub 저장소 (owner/repo 형식)"
  type        = string
}

variable "github_oidc_create_provider" {
  description = "GitHub OIDC IAM provider를 새로 생성할지 여부. 계정에 이미 있으면 false."
  type        = bool
  default     = true
}

variable "price_class" {
  description = "CloudFront 가격 등급"
  type        = string
  default     = "PriceClass_200"
}
