variable "cloud_sql_root_password" {
  description = "The root password for the Cloud SQL instance."
  type        = string
  sensitive   = true
}
