resource "aws_db_subnet_group" "this" {
  name       = "${replace(var.vpc_name,"_","-")}-db-subnet-group"
  subnet_ids = aws_subnet.private_db[*].id
}