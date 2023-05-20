module "vpc" {
  source = "../module"
  availability_zones = ["ap-southeast-1a", "ap-southeast-1c"]
  cidr_block         = "10.1.0.0/16"
  vpc_name           = "polygon_cinder_vpc"
  cluster_name       = "polygon_cinder"
}