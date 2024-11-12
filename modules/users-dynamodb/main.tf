resource "aws_dynamodb_table" "users-dynamodb-table" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  # id del usuario, administrador del sistema, cuenta personal, empresa.
  attribute {
    name = "id"
    type = "S"
  }

  tags = var.environment_variables
}
