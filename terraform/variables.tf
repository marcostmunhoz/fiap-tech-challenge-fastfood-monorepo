variable "cloud_sql_root_password" {
  description = "The root password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}

variable "cloud_sql_monolith_password" {
  description = "The monolith password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}
