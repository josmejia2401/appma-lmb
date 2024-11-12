resource "aws_dynamodb_table" "customers-dynamodb-table" {
  name         = local.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "userId"

  # id (hash) del cliente a crear
  attribute {
    name = "id"
    type = "S"
  }

  # id del cliente, al cual se asocia el cliente (customers)
  attribute {
    name = "userId"
    type = "S"
  }

  tags = var.environment_variables
}
