resource "aws_db_instance" "rds" {
  identifier              = "${var.name}-rds"
  allocated_storage       = var.allocated_storage
  db_subnet_group_name    = var.db_subnet_group_name
  engine                  = var.engine
  engine_version          = var.engine_version
  username                = var.username
  password                = var.password
  instance_class          = var.instance_class
  port                    = var.port
  skip_final_snapshot     = true
  apply_immediately       = true
  vpc_security_group_ids  = [aws_security_group.rds.id]
}
