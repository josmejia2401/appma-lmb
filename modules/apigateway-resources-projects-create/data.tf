data "aws_apigatewayv2_api" "selected" {
  #name   = local.api_name
  api_id = var.api_id
}

# automaticamente crea el zip con todo lo que haya en el directorio
data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.root}/lambdas/core/projects-create"
  output_path = "${path.root}/resources/core/projects-create/index.zip"
}

data "aws_caller_identity" "current" {

}

data "aws_region" "current" {

}
