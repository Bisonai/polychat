resource "aws_route_table" "private_eks" {
  count = length(var.availability_zones)

  vpc_id = aws_vpc.this.id

  tags = {
    Name = "private-eks-route-${format("%02d", count.index+1)}-${var.vpc_name}"
  }
}

resource "aws_route_table_association" "private_eks" {
  count = length(var.availability_zones)

  route_table_id = aws_route_table.private_eks[count.index].id
  subnet_id      = aws_subnet.private_eks[count.index].id
}

resource "aws_route" "private_eks" {
  count = length(var.availability_zones)

  route_table_id         = aws_route_table.private_eks[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat[count.index].id
}
