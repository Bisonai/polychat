resource "aws_eks_node_group" "default" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${var.name}-default-node-group"
  node_role_arn   = aws_iam_role.node_group.arn
  subnet_ids      = var.subnet_ids
  instance_types  = [var.nodegroup_default_instance_types]
  disk_size       = var.nodegroup_default_disk_size

  scaling_config {
    desired_size = var.nodegroup_default_scaling_config_desired_size
    max_size     = var.nodegroup_default_scaling_config_max_size
    min_size     = var.nodegroup_default_scaling_config_min_size
  }
}