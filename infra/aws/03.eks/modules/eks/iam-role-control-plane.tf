data "aws_iam_policy_document" "control_plane_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      identifiers = ["eks.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_iam_role" "control_plane" {
  name                = "${var.name}-eks-control-plane"
  assume_role_policy  = data.aws_iam_policy_document.control_plane_assume_role.json
  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
    "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  ]
}
