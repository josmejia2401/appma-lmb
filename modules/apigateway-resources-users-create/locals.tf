locals {
  api_name           = "api-${var.app_name}-${var.domain}-${var.env}"
  lambda_name        = "lmb-${var.app_name}-${var.domain}-create-${var.env}"
  lambda_role_name   = "role-${var.app_name}-${var.domain}-create-${var.env}"
  lambda_policy_name = "policy-${var.app_name}-${var.domain}-create-${var.env}"
  account_id         = data.aws_caller_identity.current.account_id
  region_name        = data.aws_region.current.id
}
