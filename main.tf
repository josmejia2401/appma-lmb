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

module "customers_dynamodb" {
  source = "./modules/customers-dynamodb"
}

module "services_dynamodb" {
  source = "./modules/services-dynamodb"
}

module "employees_dynamodb" {
  source = "./modules/employees-dynamodb"
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
    module.customers_dynamodb
  ]
}

####################
# API GATEWAY RESOURCES USERS
####################

module "api_gateway_resources_core_users_create" {
  source        = "./modules/apigateway-resources-core-users-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}

module "api_gateway_resources_core_users_update" {
  source        = "./modules/apigateway-resources-core-users-update"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}

module "api_gateway_resources_core_users_find_by_id" {
  source        = "./modules/apigateway-resources-core-users-find-by-id"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}

module "api_gateway_resources_core_users_associate-employee" {
  source        = "./modules/apigateway-resources-core-users-associate-employee"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}


module "api_gateway_resources_core_users_find_employees" {
  source        = "./modules/apigateway-resources-core-users-find-employees"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}


module "api_gateway_resources_core_users_find_invitations" {
  source        = "./modules/apigateway-resources-core-users-find-invitations"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}


module "api_gateway_resources_core_users_update_invitation" {
  source        = "./modules/apigateway-resources-core-users-update-invitation"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.users_dynamodb
  ]
}

####################
# API GATEWAY RESOURCES SERVICES
####################

module "api_gateway_resources_core_services_create" {
  source        = "./modules/apigateway-resources-core-services-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.services_dynamodb
  ]
}

module "api_gateway_resources_core_services_update" {
  source        = "./modules/apigateway-resources-core-services-update"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.services_dynamodb
  ]
}

module "api_gateway_resources_core_services_delete" {
  source        = "./modules/apigateway-resources-core-services-delete"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.services_dynamodb
  ]
}

module "api_gateway_resources_core_services_find_by_id" {
  source        = "./modules/apigateway-resources-core-services-find-by-id"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.services_dynamodb
  ]
}

module "api_gateway_resources_core_services_find_all_or_filter" {
  source        = "./modules/apigateway-resources-core-services-find-all-or-filter"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.services_dynamodb
  ]
}


####################
# API GATEWAY RESOURCES CUSTOMERS
####################


module "api_gateway_resources_core_customers_create" {
  source        = "./modules/apigateway-resources-core-customers-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.customers_dynamodb
  ]
}

module "api_gateway_resources_core_customers_update" {
  source        = "./modules/apigateway-resources-core-customers-update"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.customers_dynamodb
  ]
}

module "api_gateway_resources_core_customers_delete" {
  source        = "./modules/apigateway-resources-core-customers-delete"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.customers_dynamodb
  ]
}

module "api_gateway_resources_core_customers_find_by_id" {
  source        = "./modules/apigateway-resources-core-customers-find-by-id"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.customers_dynamodb
  ]
}

module "api_gateway_resources_core_customers_find_all_or_filter" {
  source        = "./modules/apigateway-resources-core-customers-find-all-or-filter"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.customers_dynamodb
  ]
}


####################
# API GATEWAY RESOURCES EMPLOYEES
####################


module "api_gateway_resources_core_employees_create" {
  source        = "./modules/apigateway-resources-core-employees-create"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.employees_dynamodb
  ]
}

module "api_gateway_resources_core_employees_update" {
  source        = "./modules/apigateway-resources-core-employees-update"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.employees_dynamodb
  ]
}

module "api_gateway_resources_core_employees_delete" {
  source        = "./modules/apigateway-resources-core-employees-delete"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.employees_dynamodb
  ]
}

module "api_gateway_resources_core_employees_find_by_id" {
  source        = "./modules/apigateway-resources-core-employees-find-by-id"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.employees_dynamodb
  ]
}

module "api_gateway_resources_core_employees_find_all_or_filter" {
  source        = "./modules/apigateway-resources-core-employees-find-all-or-filter"
  api_id        = module.api_gateway.api_id # < output of module.api_gateway
  authorizer_id = module.api_gateway_resources_security_authorizer.authorizer_id
  depends_on = [
    module.api_gateway,
    module.employees_dynamodb
  ]
}
