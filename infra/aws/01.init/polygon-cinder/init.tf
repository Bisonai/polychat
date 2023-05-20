provider "aws" {
  region = "ap-southeast-1"
  profile = "jo-lol"
}

resource "aws_s3_bucket" "this" {
  bucket = "polygon-cinder-apsoutheast1-tfstate"
}

resource "aws_dynamodb_table" "this" {
  name           = "polygon-cinder-terraform-lock"
  hash_key       = "LockID"
  billing_mode   = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }
}