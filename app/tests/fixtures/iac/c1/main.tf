resource "aws_s3_bucket" "a" {}
resource "helm_release" "h" {
  chart = "kube-prometheus-stack"
}
module "m" { source = "./m" }
resource "helm_release" "x" {
  chart = "${path.module}/local"
}
