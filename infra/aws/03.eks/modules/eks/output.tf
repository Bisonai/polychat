output "eks_control_plane" {
  value = aws_eks_cluster.this
}

output "eks_oidc" {
  value = aws_iam_openid_connect_provider.this
}