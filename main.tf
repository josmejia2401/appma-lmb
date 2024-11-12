terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      iac = "terraform"
    }
  }
  #access_key = "my-access-key"
  #secret_key = "my-secret-key"
}



####################
# DYNAMO
####################
module "users_dynamodb" {
  source = "./modules/users-dynamodb"
}

module "token_dynamodb" {
  source = "./modules/token-dynamodb"
}

module "projects_dynamodb" {
  source = "./modules/projects-dynamodb"
}

####################
# API GATEWAY
####################
module "api_gateway" {
  source = "./modules/apigateway"
}

####################
# API GATEWAY AUTHORIZER
####################

module "api_gateway_resources_security_authorizer" {
  source = "./modules/apigateway-resources-security-authorizer"
  api_id = module.api_gateway.api_id # < output of module.api_gateway
}

####################
# API GATEWAY RESOURCES
####################

module "api_gateway_resources_security_login" {
  source = "./modules/apigateway-resources-security-login"
  api_id = module.api_gateway.api_id # < output of module.api_gateway
  depends_on = [
    module.api_gateway,
    module.users_dynamodb,
    module.token_dynamodb,
    module.users_dynamodb
  ]
}

####################
# API GATEWAY RESOURCES USERS
####################

module "api_gateway_resources_users_create" {
  source        = "./modules/apigateway-resources-users-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = 0
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}

####################
# API GATEWAY RESOURCES projects
####################


module "api_gateway_resources_projects_create" {
  source        = "./modules/apigateway-resources-projects-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.projects_dynamodb
  ]
}

module "api_gateway_resources_projects_update" {
  source        = "./modules/apigateway-resources-projects-update"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.projects_dynamodb
  ]
}

module "api_gateway_resources_projects_delete" {
  source        = "./modules/apigateway-resources-projects-delete"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.projects_dynamodb
  ]
}

module "api_gateway_resources_projects_find_by_id" {
  source        = "./modules/apigateway-resources-projects-find-by-id"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.projects_dynamodb
  ]
}

module "api_gateway_resources_projects_find_all_or_filter" {
  source        = "./modules/apigateway-resources-projects-find-all-or-filter"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.projects_dynamodb
  ]
}
