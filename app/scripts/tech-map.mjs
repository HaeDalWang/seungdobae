// Terraform 코드에서 센 차트·리소스를 사이트 표시용 이름으로 정리한다.
// 공개 오픈소스/AWS 서비스 이름만 다룬다. 매핑에 없는 항목은 "기타"로 묶어 이름을 노출하지 않는다.
export const OTHER = "기타";

/** Helm 차트 이름 → 제품명. 같은 제품의 여러 차트는 한 제품으로 합친다. */
const HELM_PRODUCTS = {
  "kube-prometheus-stack": "Prometheus",
  "prometheus-adapter": "Prometheus",
  "prometheus-statsd-exporter": "Prometheus",
  thanos: "Thanos",
  karpenter: "Karpenter",
  "karpenter-crd": "Karpenter",
  "metrics-server": "Metrics Server",
  "external-dns": "ExternalDNS",
  "aws-load-balancer-controller": "AWS Load Balancer Controller",
  "secrets-store-csi-driver": "Secrets Store CSI Driver",
  "secrets-store-csi-driver-provider-aws": "Secrets Store CSI Driver",
  istiod: "Istio",
  base: "Istio", // istio-release 저장소에서 확인
  cni: "Istio",
  ztunnel: "Istio",
  "kiali-operator": "Kiali",
  "kiali-server": "Kiali",
  "argo-cd": "Argo CD",
  "argocd-ecr-updater": "Argo CD",
  "argo-rollouts": "Argo Rollouts",
  "argo-workflows": "Argo Workflows",
  "cost-analyzer": "Kubecost",
  "fluent-bit": "Fluent Bit",
  jaeger: "Jaeger",
  "ingress-nginx": "ingress-nginx",
  keycloak: "Keycloak",
  keda: "KEDA",
  traefik: "Traefik",
  "eck-operator": "Elastic (ECK)",
  "eck-stack": "Elastic (ECK)",
  logstash: "Elastic (ECK)",
  elastalert2: "ElastAlert",
  jenkins: "Jenkins",
  redis: "Redis",
  valkey: "Valkey",
  postgresql: "PostgreSQL",
  "rabbitmq-cluster-operator": "RabbitMQ",
  "cert-manager": "cert-manager",
  reloader: "Reloader",
  snapscheduler: "SnapScheduler",
  k8tz: "k8tz",
  "kubernetes-event-exporter": "Kubernetes Event Exporter",
  "celery-exporter": "Celery Exporter",
  locust: "Locust",
  datadog: "Datadog",
  "mattermost-operator": "Mattermost",
  "nexus-repository-manager": "Nexus",
  signoz: "SigNoz",
  "k8s-infra": "SigNoz",
  gitlab: "GitLab",
  "cluster-autoscaler": "Cluster Autoscaler",
  litmus: "LitmusChaos",
  sonarqube: "SonarQube",
};

export function helmProduct(chart) {
  return HELM_PRODUCTS[chart] ?? OTHER;
}

/**
 * 차트별 릴리스 수(Map<chart,count>) → 제품별 설치 횟수(Map<product,count>).
 * 한 번 설치에 여러 차트가 따라오는 제품(예: Istio base+istiod, Karpenter+CRD)이 부풀려지지 않도록
 * 같은 제품의 차트 중 가장 많은 수를 설치 횟수로 본다. 매핑에 없는 차트는 각각 별개 설치라 합산한다.
 */
export function mergeByProduct(chartCounts) {
  const merged = new Map();
  for (const [chart, count] of chartCounts) {
    const product = helmProduct(chart);
    const prev = merged.get(product) ?? 0;
    merged.set(product, product === OTHER ? prev + count : Math.max(prev, count));
  }
  return merged;
}

/** aws_<service>_* 접두사 → 표시 영역. 그 외 provider는 접두사로 판단한다. */
const AWS_AREAS = {
  iam: "IAM",
  s3: "S3",
  api: "API Gateway",
  acm: "ACM",
  lb: "ELB",
  route53: "Route 53",
  sns: "SNS·SQS",
  sqs: "SNS·SQS",
  lambda: "Lambda",
  instance: "EC2",
  ec2: "EC2",
  ebs: "EC2",
  cloudwatch: "CloudWatch",
  wafv2: "WAF",
  opensearch: "OpenSearch",
  eks: "EKS",
  vpc: "네트워크(VPC)",
  security: "네트워크(VPC)",
  subnet: "네트워크(VPC)",
  route: "네트워크(VPC)",
  eip: "네트워크(VPC)",
  network: "네트워크(VPC)",
  internet: "네트워크(VPC)",
  nat: "네트워크(VPC)",
};

export function resourceArea(type) {
  if (type === "helm_release") return "Helm";
  if (type.startsWith("kubernetes_") || type.startsWith("kubectl_")) return "Kubernetes";
  if (type.startsWith("keycloak_")) return "Keycloak";
  if (type.startsWith("elasticstack_")) return "Elastic Stack";
  if (type.startsWith("aws_")) return AWS_AREAS[type.split("_")[1]] ?? OTHER;
  return OTHER;
}

/** Map(name→count)을 개수 내림차순 상위 limit개 + "기타"(나머지 합)로 정리한다. */
export function topWithOther(counts, limit) {
  const other = counts.get(OTHER) ?? 0;
  const ranked = [...counts].filter(([name]) => name !== OTHER).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const head = ranked.slice(0, limit).map(([name, count]) => ({ name, count }));
  const rest = ranked.slice(limit).reduce((sum, [, count]) => sum + count, other);
  return rest > 0 ? [...head, { name: OTHER, count: rest }] : head;
}
