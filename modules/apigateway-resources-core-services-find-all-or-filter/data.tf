data "aws_apigatewayv2_api" "selected" {
  #name   = local.api_name
  api_id = var.api_id
}

# automaticamente crea el zip con todo lo que haya en el directorio
data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/core/services-find-all-or-filter"
  output_path = "${path.root}/resources/core/service-find-all-or-filter/index.zip"
}

data "aws_caller_identity" "current" {

}

data "aws_region" "current" {

}
