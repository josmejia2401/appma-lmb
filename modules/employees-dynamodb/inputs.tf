variable "env" {
  description = "Ambiente donde será desplegado el componente. dev, qa y pdn"
  type        = string
  validation {
    condition     = contains(["dev", "qa", "pdf"], var.env)
    error_message = "El ambiente no es válido"
  }
  nullable = false
  default  = "dev"
}

variable "app_name" {
  description = "Nombre de la aplicación: Appointment Management"
  type        = string
  nullable    = false
  default     = "appma"
}

variable "domain" {
  description = "Dominio o unidad de negocio al cual pertenece el componente"
  type        = string
  validation {
    condition     = contains(["security", "core"], var.domain)
    error_message = "El dominio no es válido"
  }
  nullable = false
  default  = "core"
}

variable "subdomain" {
  description = "Dominio o unidad de negocio al cual pertenece el componente"
  type        = string
  validation {
    condition     = contains(["auth", "services", "clients", "employees"], var.subdomain)
    error_message = "El sub dominio no es válido"
  }
  nullable = false
  default  = "employees"
}


variable "lambda_source" {
  description = "Ubicación del código de la lambda"
  type        = string
  nullable    = false
  default     = "../../../lambdas/auth/login/index.zip"
}


variable "lambda_path" {
  description = "Ubicación del index.js"
  type        = string
  nullable    = false
  default     = "index.js"
}


variable "environment_variables" {
  description = "Variables de entorno de la lambda"
  type        = map(string)
  nullable    = true
  default = {
    ENVIRONMENT      = "dev"
    LOGGER_LEVEL     = "DEBUG"
    REGION           = "us-east-1"
    APP_NAME         = "apma"
    JTW_SECRET_VALUE = "secret"
    JWT_TOKEN_LIFE   = "1000"
  }
}

# https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
variable "lambda_runtime" {
  description = "Config runtime de la lambda"
  type        = string
  validation {
    condition     = contains(["nodejs20.x", "nodejs18.x", "nodejs16.x"], var.lambda_runtime)
    error_message = "Runtime no es válido. Ver más https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html"
  }
  nullable = false
  default  = "nodejs20.x"
}


variable "tags" {
  description = "Tags para el recurso a crear"
  type        = map(string)
  nullable    = true
  default = {
    domain    = "core"
    component = "employees"
    env       = "dev"
  }
}



variable "table_name" {
  description = "Nombre de la tabla"
  type        = string
  nullable    = false
  default     = "employees"
}
