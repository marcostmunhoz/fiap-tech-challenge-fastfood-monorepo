resource "google_storage_bucket" "bucket" {
  name                        = "${local.google.project}-bucket"
  location                    = local.google.location
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = false
  force_destroy               = true

}

resource "google_api_gateway_api" "api" {
  provider = google-beta
  project  = local.google.project
  api_id   = "${local.google.project}-api"
}

resource "google_sql_database_instance" "database" {
  name                = "${local.google.project}-db"
  database_version    = "MYSQL_8_0"
  deletion_protection = false

  settings {
    tier            = "db-f1-micro"
    edition         = "ENTERPRISE"
    disk_size       = "10"
    disk_autoresize = false
  }
}

resource "google_sql_user" "user" {
  name     = "root"
  instance = google_sql_database_instance.database.name
  host     = "%"
  password = var.cloud_sql_root_password
}
