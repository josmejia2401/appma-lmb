resource "aws_apigatewayv2_authorizer" "header_based_authorizer" {
  api_id                            = data.aws_apigatewayv2_api.selected.id
  authorizer_type                   = "REQUEST"
  name                              = local.lambda_name
  authorizer_payload_format_version = "2.0"
  authorizer_uri                    = aws_lambda_function.html_lambda.invoke_arn
  enable_simple_responses           = true
  identity_sources                  = ["$request.header.authorization"]
  authorizer_result_ttl_in_seconds  = 0 #3600
}


resource "aws_lambda_permission" "allow_api_gw_invoke_authorizer" {
  statement_id  = "allowInvokeFromAPIGatewayAuthorizer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.html_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${data.aws_apigatewayv2_api.selected.execution_arn}/authorizers/${aws_apigatewayv2_authorizer.header_based_authorizer.id}"
  depends_on    = [aws_apigatewayv2_authorizer.header_based_authorizer]
}
