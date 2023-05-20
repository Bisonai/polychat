module "rds" {
  source = "../module"
  name = "polygon-cinder-database"
  db_subnet_group_name = "polygon-cinder-vpc-db-subnet-group"  
  vpc_cidr = "10.1.0.0/16"
  vpc_id = "vpc-0c357aa27d2bef1fb"
  engine = "postgres"
  engine_version = "14.6"
  username = "bisonai"
  password = "qlthskdl12"
  instance_class = "db.t4g.xlarge"
  port = 5432
  allocated_storage = 200
}