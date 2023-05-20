resource "aws_subnet" "private_eks" {
  count = length(var.availability_zones)

  // vpc : 10.x.0.0/16
  // - subnets : 10.x.64.0/20, 10.x.80.0/20, 10.x.96.0/20
  cidr_block = cidrsubnet(var.cidr_block, 4, 4 + count.index)
  vpc_id     = aws_vpc.this.id

  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = false

  tags = {
    Name = "private-eks-subnet-${format("%02d", count.index+1)}-${var.vpc_name}"
  }
}
