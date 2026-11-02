output "website_bucket_name" {
  description = "S3 bucket that stores the frontend assets"
  value       = aws_s3_bucket.website_bucket.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution to invalidate after a frontend deployment"
  value       = aws_cloudfront_distribution.cdn.id
}

output "cloudfront_domain_name" {
  description = "CloudFront-generated domain name"
  value       = aws_cloudfront_distribution.cdn.domain_name
}

output "route53_name_servers" {
  description = "Nameservers that must be configured at the domain registrar"
  value       = aws_route53_zone.primary.name_servers
}
