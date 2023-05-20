resource "aws_vpc" "this" {
  cidr_block                       = var.cidr_block
  assign_generated_ipv6_cidr_block = false

  tags = {
    Name = var.vpc_name
  }
}