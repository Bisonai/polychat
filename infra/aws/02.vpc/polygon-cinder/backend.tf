terraform {
  backend "s3" {
    bucket         = "polygon-cinder-apsoutheast1-tfstate"
    key            = "terraform/vpc/polygon_cinder"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "polygon-cinder-terraform-lock"
    profile        = "jo-lol"
  }
}