resource "aws_route_table" "private_db" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "private-db-subnet-route-table-${var.vpc_name}"
  }
}

resource "aws_route_table_association" "private_db" {
  count = length(var.availability_zones)

  route_table_id = aws_route_table.private_db.id
  subnet_id      = aws_subnet.private_db[count.index].id
}