resource "aws_security_group" "rds" {
  name = "${var.name}-rds"
  vpc_id = var.vpc_id

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = var.port
    to_port = var.port
    protocol = "TCP"
    cidr_blocks = [var.vpc_cidr]
  }
}