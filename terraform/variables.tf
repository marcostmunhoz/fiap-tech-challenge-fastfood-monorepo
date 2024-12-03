variable "cloud_sql_root_password" {
  description = "The root password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}

variable "cloud_sql_kitchen_password" {
  description = "The kitchen password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}

variable "cloud_sql_order_password" {
  description = "The order password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}

variable "cloud_sql_auth_password" {
  description = "The auth password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}
