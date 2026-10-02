resource "aws_s3_bucket" "a" {}
resource "helm_release" "h" {}
module "m" { source = "./m" }
