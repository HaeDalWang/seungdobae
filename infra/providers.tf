terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}

# 기본 리전 (S3 버킷, OIDC 등 대부분의 리소스).
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "seungdobae-site"
      ManagedBy = "terraform"
    }
  }
}

# CloudFront용 ACM 인증서는 반드시 us-east-1에 있어야 한다.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "seungdobae-site"
      ManagedBy = "terraform"
    }
  }
}
