module "eks" {
  source = "../modules/eks"

  name                   = "polygon_cinder_cluster"
  subnet_ids             = ["subnet-0c32e58fbdf212156", "subnet-0652ecf6e516bc742"]
  vpc_cidr               = "10.1.0.0/16"
  vpc_id                 = "vpc-0c357aa27d2bef1fb"
  endpoint_public_access = true

  nodegroup_default_instance_types              = "m5.2xlarge"
  nodegroup_default_disk_size                   = 200
  nodegroup_default_scaling_config_desired_size = "2"
  nodegroup_default_scaling_config_max_size     = "2"
  nodegroup_default_scaling_config_min_size     = "2"
}