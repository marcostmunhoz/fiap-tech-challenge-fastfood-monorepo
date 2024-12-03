output "cloud_sql_instance_ip" {
  value = google_sql_database_instance.database.public_ip_address
}

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

    ip_configuration {
      authorized_networks {
        name  = "Allow all"
        value = "0.0.0.0/0"
      }
    }
  }
}

resource "google_sql_user" "root_user" {
  name     = "root"
  instance = google_sql_database_instance.database.name
  host     = "%"
  password = var.cloud_sql_root_password
}

resource "google_sql_database" "kitchen_db" {
  name     = "kitchen"
  instance = google_sql_database_instance.database.name
}

resource "google_sql_user" "kitchen_user" {
  name     = "kitchen"
  instance = google_sql_database_instance.database.name
  host     = "%"
  password = var.cloud_sql_kitchen_password
}

resource "google_sql_database" "order_db" {
  name     = "order"
  instance = google_sql_database_instance.database.name
}

resource "google_sql_user" "order_user" {
  name     = "order"
  instance = google_sql_database_instance.database.name
  host     = "%"
  password = var.cloud_sql_order_password
}

resource "google_sql_database" "auth_db" {
  name     = "auth"
  instance = google_sql_database_instance.database.name
}

resource "google_sql_user" "auth_user" {
  name     = "auth"
  instance = google_sql_database_instance.database.name
  host     = "%"
  password = var.cloud_sql_auth_password
}
