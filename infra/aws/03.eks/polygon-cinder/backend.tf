terraform {
  backend "s3" {
    bucket         = "polygon-cinder-apsoutheast1-tfstate"
    key            = "terraform/eks/polygon-cinder"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "polygon-cinder-terraform-lock"
    profile        = "jo-lol"
  }
}