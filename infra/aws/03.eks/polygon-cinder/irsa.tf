module "aws_lb_controller_irsa" {
  source = "../modules/irsa"

  eks_oidc_arn     = "arn:aws:iam::831311642255:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  eks_oidc_url     = "https://oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  name             = "orakl_baobab_cluster-aws-load-balancer-controller-irsa"
  policy           = file("${path.module}/iam_polices/aws-lb-controller-iam-policy.json")
  service_accounts = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
}

module "upload_service_irsa" {
  source = "../modules/irsa"

  eks_oidc_arn     = "arn:aws:iam::831311642255:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  eks_oidc_url     = "https://oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  name             = "orakl_baobab_cluster-upload-service-irsa"
  policy           = file("${path.module}/iam_polices/upload-service-iam-policy.json")
  service_accounts = ["system:serviceaccount:kross-service:upload-service"]
}

module "external_secrets_irsa" {
  source = "../modules/irsa"

  eks_oidc_arn     = "arn:aws:iam::831311642255:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  eks_oidc_url     = "https://oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  name             = "orakl_baobab_cluster-external-secrets-irsa"
  policy           = file("${path.module}/iam_polices/external-secrets-iam-policy.json")
  service_accounts = ["system:serviceaccount:default:nginx"]
}

module "orakl_service_irsa" {
  source = "../modules/irsa"

  eks_oidc_arn     = "arn:aws:iam::831311642255:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  eks_oidc_url     = "https://oidc.eks.ap-southeast-1.amazonaws.com/id/30C818D3A32B43D60B4C76DC031E53D8"
  name             = "orakl_baobab_cluster-service-irsa"
  policy           = file("${path.module}/iam_polices/orakl-service-iam-policy.json")
  service_accounts = ["system:serviceaccount:orakl-baobab:sa-orakl-service"]
}