# Secure static website template

A reusable AWS portfolio template built with a static HTML/CSS/JavaScript frontend, Terraform, and GitHub Actions. Account-specific content from the original project has been replaced with `<insert_parameter>` markers or GitHub repository settings.

## Architecture

- Route 53 hosts the public DNS zone.
- ACM provides the CloudFront TLS certificate.
- CloudFront redirects HTTP to HTTPS and serves cached content.
- A private S3 bucket stores the frontend and permits reads only from CloudFront through origin access control.
- Terraform manages infrastructure, while GitHub Actions plans changes and deploys the frontend.

## Before you deploy

You need an AWS account, a registered domain, Terraform 1.10 or later, and an AWS IAM role that GitHub Actions can assume through OpenID Connect (OIDC). The IAM role's trust policy must restrict access to your repository and intended branch or environments. Grant the role only the permissions required to manage this stack.

Create the S3 state bucket before initializing Terraform. The state bucket is separate from the website bucket created by this project.

### GitHub repository settings

Add this Actions secret:

| Secret | Value |
| --- | --- |
| `AWS_ROLE_ARN` | `<insert_parameter>` — ARN of the GitHub Actions IAM role |

Add these Actions variables:

| Variable | Value |
| --- | --- |
| `AWS_REGION` | `<insert_parameter>` — for example, `us-east-1` |
| `DOMAIN_NAME` | `<insert_parameter>` — apex domain |
| `SUBDOMAIN_NAME` | `<insert_parameter>` — for example, `www.example.com` |
| `WEBSITE_BUCKET_PREFIX` | `<insert_parameter>` — globally unique prefix; the AWS account ID is appended |
| `TF_STATE_BUCKET` | `<insert_parameter>` — existing S3 state bucket |
| `TF_STATE_KEY` | `<insert_parameter>` — for example, `website/terraform.tfstate` |

The apply workflow runs on pushes to `main`. Review its permissions and protect the branch before enabling production deployments.

### Local Terraform setup

Copy the examples and replace every marker:

```sh
cp terraform/backend.hcl.example terraform/backend.hcl
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```

Then initialize and inspect the plan:

```sh
terraform -chdir=terraform init -backend-config=backend.hcl
terraform -chdir=terraform fmt -check
terraform -chdir=terraform validate
terraform -chdir=terraform plan
```

After the first apply, update your registrar to use the Route 53 name servers shown by the `route53_name_servers` output. DNS delegation is an external step and can interrupt existing DNS or email if it is changed without migrating all required records.

## Customize the frontend

Install the Python dependencies into the project virtual environment:

```sh
uv sync --locked
```

Generate the optional architecture diagram with the project environment (Graphviz must also be installed):

```sh
uv run python assets/architecture/architecture.py
```

Search for all remaining parameters:

```sh
rg -n 'insert_parameter' . --glob '!.git/**'
```

At minimum, replace:

- Brand, biography, experience, project narrative, and social links in `frontend/`.
- The contact recipient and greeting in `frontend/script.js`.
- `frontend/images/brand-logo.svg`, `brand-mark.svg`, and `headshot/profile-placeholder.svg` with your own assets, or edit the supplied neutral placeholders.
- The architecture title in `assets/architecture/architecture.py`; run that script if you want a newly generated diagram.

Personal photos, branded raster images, Finder metadata, and the source repository's Git history were intentionally excluded. Neutral SVG assets preserve the page layout without retaining identity or EXIF data.

## Project layout

```text
frontend/                  Static website
terraform/                 AWS infrastructure
.github/workflows/         Plan and apply/deploy automation
assets/architecture/       Optional diagram source
```

## Safety notes

- Terraform can create billable AWS resources.
- The website bucket is protected from deletion while non-empty by default. Set `force_destroy_bucket = true` only if that behavior is intentional.
- Do not commit `backend.hcl`, `terraform.tfvars`, state files, credentials, or trust-policy files. They are ignored by Git.
