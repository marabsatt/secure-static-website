variable "aws_region" {
  description = "AWS Region for Resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the website (e.g., example.com)"
  type        = string
}

variable "subdomain_name" {
  description = "Subdomain name for the website (e.g, www.example.com)"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name for the website"
  type        = string
}

variable "force_destroy_bucket" {
  description = "Allow Terraform to delete a non-empty website bucket"
  type        = bool
  default     = false
}
