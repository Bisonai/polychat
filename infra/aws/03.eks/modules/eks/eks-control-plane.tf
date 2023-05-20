resource "aws_eks_cluster" "this" {
  name     = var.name
  role_arn = aws_iam_role.control_plane.arn
  vpc_config {
    subnet_ids              = var.subnet_ids
    security_group_ids      = [aws_security_group.control_plane.id]
    endpoint_private_access = true
    endpoint_public_access  = var.endpoint_public_access
  }
}